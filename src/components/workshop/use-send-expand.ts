import { useLayoutEffect, useRef, type RefObject } from "react";
import {
  BUTTON,
  RING_COLOR,
  OUTRO,
  SCROLL,
  TRAIL,
  clamp01,
  insetPercents,
  pillPath,
  ringOpacity,
  stepSpring,
  trunc2,
  type Spring,
} from "./send-expand-motion";

export type SendExpandRefs = {
  /** The 100vh sticky layer. Its opacity is toggled by the engine. */
  sticky: RefObject<HTMLDivElement | null>;
  /** The clipped layer — this is what gets the animated `clip-path`. */
  clip: RefObject<HTMLDivElement | null>;
  /** Panel contents. Hidden until the outline finishes tracing. */
  inner: RefObject<HTMLDivElement | null>;
  /** Absolutely positioned SVG holding the traced outline. */
  svg: RefObject<SVGSVGElement | null>;
  basePath: RefObject<SVGPathElement | null>;
  tipPath: RefObject<SVGPathElement | null>;
  gradient: RefObject<SVGLinearGradientElement | null>;
  /** Empty div that only carries the `box-shadow` ring around the resting pill. */
  ring: RefObject<HTMLDivElement | null>;
  /** Zero-content spacer whose height is the scroll budget for the whole sequence. */
  driver: RefObject<HTMLDivElement | null>;
  /** Marker for the following section — drives the outro inset + corner rounding. */
  outro: RefObject<HTMLDivElement | null>;
};

export function useSendExpandRefs(): SendExpandRefs {
  return {
    sticky: useRef<HTMLDivElement>(null),
    clip: useRef<HTMLDivElement>(null),
    inner: useRef<HTMLDivElement>(null),
    svg: useRef<SVGSVGElement>(null),
    basePath: useRef<SVGPathElement>(null),
    tipPath: useRef<SVGPathElement>(null),
    gradient: useRef<SVGLinearGradientElement>(null),
    ring: useRef<HTMLDivElement>(null),
    driver: useRef<HTMLDivElement>(null),
    outro: useRef<HTMLDivElement>(null),
  };
}

/**
 * Drives the whole sequence off a single rAF loop that parks itself as soon as
 * the springs settle, exactly like the original.
 *
 * Timeline, measured in pixels scrolled past the driver's top crossing the
 * vertical middle of the viewport:
 *
 *   0 → 100    trace the pill outline (SVG stroke-dashoffset), gradient tip trailing
 *   100        outline fades out, the real Send button fades in
 *   128        the ring pops in around it
 *   150 → end  spring-driven growth from pill to full viewport, corners easing to 0
 */
/**
 * Document scrollY range of the "dwell": from the moment the panel is fully
 * open until the content starts its exit. Shared by the engine (to report
 * progress) and callers that want to scroll to a point inside it.
 */
export function dwellRange(driverTop: number, driverH: number, outroTop: number, viewportH: number) {
  return {
    start: driverTop + driverH - viewportH / 2,
    end: outroTop - viewportH * (1 + OUTRO.exitSpan),
  };
}

export function useSendExpand(refs: SendExpandRefs, onDwell?: (progress: number) => void) {
  // Latest callback without re-running the engine effect.
  const onDwellRef = useRef(onDwell);
  onDwellRef.current = onDwell;

  useLayoutEffect(() => {
    const clip = refs.clip.current;
    const sticky = refs.sticky.current;
    const inner = refs.inner.current;
    const svg = refs.svg.current;
    const basePath = refs.basePath.current;
    const tipPath = refs.tipPath.current;
    const gradient = refs.gradient.current;
    const ring = refs.ring.current;
    const driver = refs.driver.current;
    const outro = refs.outro.current;
    if (!clip || !sticky || !inner || !svg || !basePath || !tipPath || !gradient || !ring || !driver) {
      return;
    }

    // ---- measured geometry -------------------------------------------------
    let vw = 0;
    let vh = 0;
    let pillW = 0;
    let driverH = 0;
    let driverTop = 0;
    let outroTop = 0;
    let outroH = 1;
    let viewportH = window.innerHeight;
    let isMobile = window.innerWidth < OUTRO.breakpoint;

    /** Fraction of the growth spring spent holding the pill at its resting size. */
    const holdFrac = () => (driverH > 0 ? (SCROLL.revealPx + SCROLL.holdPx) / driverH : 0);

    function measure() {
      vw = clip!.offsetWidth;
      vh = clip!.offsetHeight;
      pillW = Math.min(BUTTON.maxWidth, vw * 0.9);
      driverH = driver!.offsetHeight;
      const sy = window.scrollY;
      driverTop = driver!.getBoundingClientRect().top + sy;
      if (outro) {
        const r = outro.getBoundingClientRect();
        outroTop = r.top + sy;
        outroH = r.height || 1;
      }
    }

    const ro = new ResizeObserver(measure);
    ro.observe(clip);
    ro.observe(driver);
    measure();

    // ---- animation state ---------------------------------------------------
    const grow: Spring = { value: 0, velocity: 0 };
    const round: Spring = { value: 0, velocity: 0 };

    let layerVisible = false;
    let buttonShown = false;
    let ringShown = false;

    let lastDraw = 0;
    let tipGlow = 0;
    let lastTime = 0;

    let pathD = "";
    let pathLen = 0;
    let lastClip = "";
    let lastRingBox = "";
    let lastRingRadii = "";
    let lastRingOpacity = -1;
    let lastGrowVar = "";
    let lastExitVar = "";
    let lastDwell = "";

    let raf = 0;
    let running = false;

    // ---- discrete state transitions ---------------------------------------
    function showButton() {
      buttonShown = true;
      svg!.style.transition = "opacity 0.2s ease-out";
      svg!.style.opacity = "0";
      inner!.style.transition = "opacity 0.2s ease-out";
      inner!.style.opacity = "1";
    }

    function hideButton() {
      if (!buttonShown) return;
      buttonShown = false;
      svg!.style.transition = "none";
      svg!.style.opacity = "1";
      inner!.style.transition = "none";
      inner!.style.opacity = "0";
      hideRing();
    }

    function showRing() {
      if (ringShown) return;
      ringShown = true;
      lastRingOpacity = -1;
      ring!.style.boxShadow = `0 0 0 7px ${RING_COLOR}, 0 9px 3px 0 rgba(255,255,255,0.6)`;
      ring!.style.opacity = "1";
    }

    function hideRing() {
      if (!ringShown) return;
      ringShown = false;
      lastRingOpacity = -1;
      ring!.style.boxShadow = `0 0 0 0px ${RING_COLOR}, 0 0px 0px 0 rgba(255,255,255,0)`;
      ring!.style.opacity = "0";
    }

    function reset() {
      grow.value = 0;
      grow.velocity = 0;
      lastClip = "";
      clip!.style.clipPath = "";
      if (layerVisible) {
        layerVisible = false;
        sticky!.style.opacity = "0";
        sticky!.style.pointerEvents = "";
      }
      hideButton();
      hideRing();
      basePath!.setAttribute("stroke-dashoffset", "1");
      lastDraw = 0;
      tipGlow = 0;
      lastTime = 0;
      running = false;
    }

    // ---- outline tracing ---------------------------------------------------
    function drawTrail(p: number, dt: number) {
      // The tip glows while the trace is advancing and decays once it stalls.
      tipGlow = p > lastDraw + 1e-4 ? 1 : Math.max(0, tipGlow - dt * TRAIL.fadeSpeed);
      lastDraw = p;

      svg!.style.left = `${(vw - pillW) / 2}px`;
      svg!.style.top = `${(vh - BUTTON.height) / 2}px`;
      svg!.setAttribute("width", `${pillW}`);
      svg!.setAttribute("height", `${BUTTON.height}`);
      svg!.setAttribute("viewBox", `0 0 ${pillW} ${BUTTON.height}`);

      const d = pillPath(pillW, BUTTON.height);
      if (d !== pathD) {
        basePath!.setAttribute("d", d);
        tipPath!.setAttribute("d", d);
        pathD = d;
        pathLen = basePath!.getTotalLength();
      }
      basePath!.setAttribute("stroke-dashoffset", `${1 - p}`);

      if (tipGlow > 0.001 && p > 0.001 && pathLen > 0) {
        const len = Math.min(TRAIL.tipLen, p);
        const start = p - len;
        tipPath!.setAttribute("stroke-dasharray", `${len} 1`);
        tipPath!.setAttribute("stroke-dashoffset", `${-start}`);
        tipPath!.style.opacity = `${tipGlow}`;
        // Re-aim the gradient along the moving tip so it always reads purple → pink.
        const a = basePath!.getPointAtLength(start * pathLen);
        const b = basePath!.getPointAtLength(p * pathLen);
        gradient!.setAttribute("x1", `${a.x}`);
        gradient!.setAttribute("y1", `${a.y}`);
        gradient!.setAttribute("x2", `${b.x}`);
        gradient!.setAttribute("y2", `${b.y}`);
        tipPath!.style.display = "";
      } else {
        tipPath!.style.display = "none";
      }
    }

    function updateRing(
      w: number,
      h: number,
      tl: number,
      tr: number,
      br: number,
      bl: number,
      progress: number,
    ) {
      const box = `${(vw - w) / 2 | 0},${(vh - h) / 2 | 0},${w | 0},${h | 0}`;
      if (box !== lastRingBox) {
        ring!.style.left = `${(vw - w) / 2}px`;
        ring!.style.top = `${(vh - h) / 2}px`;
        ring!.style.width = `${w}px`;
        ring!.style.height = `${h}px`;
        lastRingBox = box;
      }
      const radii = `${tl}px ${tr}px ${br}px ${bl}px`;
      if (radii !== lastRingRadii) {
        ring!.style.borderRadius = radii;
        lastRingRadii = radii;
      }
      if (ringShown) {
        const o = (ringOpacity(progress) * 100) | 0;
        if (o !== lastRingOpacity) {
          ring!.style.opacity = `${o / 100}`;
          lastRingOpacity = o;
        }
      }
    }

    // ---- the loop ----------------------------------------------------------
    function tick() {
      running = true;
      const sy = window.scrollY;
      const now = performance.now();
      const dt = lastTime > 0 ? (now - lastTime) / 1000 : 0;
      lastTime = now;

      const clipTop = clip!.getBoundingClientRect().top;
      if (clipTop >= viewportH || clipTop + vh <= 0) {
        reset();
        return;
      }

      const driverViewTop = driverTop - sy;
      const driverViewBottom = driverViewTop + driverH;
      // Progress, in px, starting when the driver's top crosses the viewport middle.
      const px =
        driverViewBottom <= 0 ? driverH : Math.max(0, viewportH / 2 - driverViewTop);

      let w: number;
      let h: number;
      let rad: number;
      let settled: boolean;

      if (driverViewBottom <= 0) {
        // Past the end of the driver: hard-pin to fully expanded.
        w = vw;
        h = vh;
        rad = 0;
        settled = grow.value === 1;
        grow.value = 1;
        grow.velocity = 0;
      } else {
        const num = Math.max(0, px - SCROLL.drawPx - SCROLL.pausePx);
        const den = driverH - SCROLL.drawPx - SCROLL.pausePx;
        settled = stepSpring(grow, den > 0 ? Math.min(1, num / den) : 0);

        const g = clamp01(grow.value);
        const hold = holdFrac();
        if (g <= hold) {
          w = pillW;
          h = BUTTON.height;
          rad = Math.min(w, h) / 2;
        } else {
          const e = (g - hold) / (1 - hold);
          w = pillW + e * (vw - pillW);
          h = BUTTON.height + e * (vh - BUTTON.height);
          const r = Math.min(w, h) / 2;
          // Stay a perfect stadium until 75%, then square off on a quadratic ease.
          rad = e < 0.75 ? r : Math.round(r * (1 - ((e - 0.75) / 0.25) ** 2));
        }
      }

      const visible = driverViewBottom <= 0 || (driverH > 0 && px > 0);
      if (visible !== layerVisible) {
        layerVisible = visible;
        sticky!.style.transition = visible ? "none" : "opacity 0.15s ease-out 0.2s";
        sticky!.style.opacity = visible ? "1" : "0";
        // Pulled up over the previous section while hidden, so only take
        // clicks once the sequence is showing.
        sticky!.style.pointerEvents = visible ? "auto" : "";
        if (!visible) {
          hideButton();
          hideRing();
          lastDraw = 0;
          tipGlow = 0;
          lastTime = 0;
        }
      }

      const draw = Math.min(1, px / SCROLL.drawPx);
      drawTrail(draw, dt);
      if (draw >= 1 && !buttonShown) showButton();
      if (draw < 1 && buttonShown) hideButton();
      if (px >= SCROLL.shadowPx && !ringShown && buttonShown) showRing();
      if (px < SCROLL.shadowPx && ringShown) hideRing();

      // Outro: the following section pushes the panel into an inset rounded card.
      let outroRad = 0;
      let exit = 0;
      if (outro) {
        const outroViewTop = outroTop - sy;
        if (!stepSpring(round, clamp01((viewportH - outroViewTop) / outroH))) settled = false;
        outroRad = Math.round(clamp01(round.value) * (isMobile ? OUTRO.radMobile : OUTRO.rad));
        // Scroll-linked (no spring). Runs in the last stretch of the pinned
        // dwell and finishes as the outro starts, so the content is gone
        // before the panel insets and rounds off.
        const lead = viewportH * OUTRO.exitSpan;
        exit = clamp01((viewportH + lead - outroViewTop) / lead);
      }
      const rp = clamp01(round.value);
      const padX = rp * (isMobile ? OUTRO.padMobile : OUTRO.padX);
      const padY = rp * (isMobile ? OUTRO.padMobile : OUTRO.padY);

      const cw = Math.min(w, vw - padX * 2);
      const ch = Math.min(h, vh - padY * 2);
      const tl = rad;
      const tr = rad;
      const br = Math.max(rad, outroRad);
      const bl = Math.max(rad, outroRad);

      const ins = insetPercents(vw, vh, cw, ch, padY);
      const next =
        `inset(${trunc2(ins.top)}% ${trunc2(ins.x)}% ${trunc2(ins.bottom)}% ${trunc2(ins.x)}%` +
        ` round ${tl}px ${tr}px ${br}px ${bl}px)`;
      if (next !== lastClip) {
        clip!.style.clipPath = next;
        lastClip = next;
      }

      const g = clamp01(grow.value);
      const hold = holdFrac();
      const expansion = g <= hold ? 0 : (g - hold) / (1 - hold);
      updateRing(cw, ch, tl, tr, br, bl, expansion);

      // Published for the panel's own content to key off (Send label out, copy in).
      const growVar = expansion.toFixed(3);
      if (growVar !== lastGrowVar) {
        sticky!.style.setProperty("--grow", growVar);
        lastGrowVar = growVar;
      }
      // Outro progress, for the panel content to shrink as it leaves.
      const exitVar = exit.toFixed(3);
      if (exitVar !== lastExitVar) {
        sticky!.style.setProperty("--exit", exitVar);
        lastExitVar = exitVar;
      }
      // Progress through the fully-open dwell, for the panel to step through
      // its content on scroll.
      if (outro && onDwellRef.current) {
        const range = dwellRange(driverTop, driverH, outroTop, viewportH);
        const dwell = clamp01((sy - range.start) / Math.max(1, range.end - range.start)).toFixed(3);
        if (dwell !== lastDwell) {
          lastDwell = dwell;
          onDwellRef.current(Number(dwell));
        }
      }

      if (tipGlow > 0.001) settled = false;
      if (settled) {
        running = false;
        lastTime = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    }

    function schedule() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }

    function onResize() {
      viewportH = window.innerHeight;
      isMobile = window.innerWidth < OUTRO.breakpoint;
      measure();
      schedule();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    schedule();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      clip.style.clipPath = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

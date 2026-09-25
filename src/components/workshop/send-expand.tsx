import { useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

import { AppPreview, type AppFeature } from "@/components/workshop/app-preview";
import { TRAIL, TRAIL_FROM, TRAIL_TO } from "@/components/workshop/send-expand-motion";
import { dwellRange, useSendExpand, useSendExpandRefs } from "@/components/workshop/use-send-expand";

export type SendExpandContent = {
  /** Label inside the resting pill. */
  pill: string;
  /** Panel heading above the app preview. */
  heading: string;
  /** Features of the example app, one screen each. */
  features: AppFeature[];
};

// Published by the engine on the sticky layer as the pill grows (0 → 1). The
// pill label clears out as soon as growth starts; the panel copy is held back
// until the panel has squared off, then rises and scales in.
const pillLabelStyle: CSSProperties = { opacity: "calc(1 - var(--grow, 0) * 5)" };
// On the way out (--exit, 0 → 1 before the next section arrives) the copy
// shrinks so the panel's inset doesn't crop it.
const panelBodyStyle: CSSProperties = {
  opacity: "calc((var(--grow, 0) - 0.76) * 5)",
  transform:
    "translateY(calc(4px * (1 - var(--grow, 0)))) scale(calc((0.96 + 0.04 * var(--grow, 0)) * (1 - 0.12 * var(--exit, 0))))",
  transformOrigin: "top",
};

/**
 * "Send button expands to fullscreen" scroll section, adapted from
 * wc-component-library's SendExpand: an outline that
 * traces itself into a pill, then a spring-driven expansion of that pill into
 * a full-viewport panel. The next section pushes the panel back into an inset
 * card with rounded bottom corners.
 *
 * Layout contract — these pieces are load-bearing for the engine:
 *  • the stage owns the scroll budget; the driver is an out-of-flow 800px
 *    spacer whose top crossing the viewport middle starts the sequence.
 *  • the sticky layer pins at top 0 and is pulled up by calc(50px - 50vh) so
 *    it is already pinned 150px before the sequence begins.
 *  • the outro marker drives the closing inset + rounding.
 */
export function SendExpand(content: SendExpandContent) {
  const reduce = useReducedMotion();
  const refs = useSendExpandRefs();
  const n = content.features.length;
  // The fully-open dwell is split into one equal slice per feature; scrolling
  // through it steps the active item.
  const [active, setActive] = useState(0);
  useSendExpand(refs, (p) => setActive(Math.min(n - 1, Math.floor(p * n))));

  // Selecting scrolls to the middle of that feature's slice, so scroll
  // position and the active item never disagree.
  const scrollTo = (i: number) => {
    const driver = refs.driver.current;
    const outro = refs.outro.current;
    if (!driver || !outro) return setActive(i);
    const sy = window.scrollY;
    const { start, end } = dwellRange(
      driver.getBoundingClientRect().top + sy,
      driver.offsetHeight,
      outro.getBoundingClientRect().top + sy,
      window.innerHeight,
    );
    window.scrollTo({ top: start + ((i + 0.5) / n) * (end - start), behavior: "smooth" });
  };
  const preview = { active, onSelect: reduce ? setActive : scrollTo };

  if (reduce) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="banner-mesh relative overflow-hidden rounded-[2rem] text-white md:h-[min(900px,90svh)]">
          <PanelBody {...content} {...preview} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 1000px + ~1.1 viewports cover the pin-in, expansion and exit; each
          feature then gets half a viewport of scroll while fully open. */}
      <div data-hide-nav className="relative flow-root" style={{ height: `calc(1000px + ${110 + 50 * n}vh)` }}>
        {/* Out of flow on purpose: its height is scroll budget, not layout. */}
        <div ref={refs.driver} className="pointer-events-none absolute top-[200px] left-0 h-[800px] w-full" aria-hidden="true" />

        <div
          ref={refs.sticky}
          className="sticky top-0 z-3 mt-[calc(50px-50vh)] pointer-events-none h-svh w-full opacity-0 transition-opacity duration-200 ease-out"
        >
          <svg ref={refs.svg} className="pointer-events-none absolute z-[9999] overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient ref={refs.gradient} id="send-expand-trail" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={TRAIL_FROM} />
                <stop offset="100%" stopColor={TRAIL_TO} />
              </linearGradient>
            </defs>
            <path
              ref={refs.basePath}
              fill="none"
              stroke={TRAIL_FROM}
              strokeWidth={TRAIL.strokeW}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
            <path
              ref={refs.tipPath}
              fill="none"
              stroke="url(#send-expand-trail)"
              strokeWidth={TRAIL.strokeW}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0 1"
              strokeDashoffset="0"
              style={{ display: "none" }}
            />
          </svg>

          <div
            ref={refs.ring}
            className="pointer-events-none absolute z-1 opacity-0 transition-shadow duration-300 ease-out"
            aria-hidden="true"
          />

          <div ref={refs.clip} className="relative z-2 size-full [contain:layout_style_paint] will-change-[clip-path]">
            <div ref={refs.inner} className="size-full opacity-0">
              <div className="banner-mesh relative size-full overflow-hidden text-white">
                {/* Dead-centre, so it reads as the label inside the resting pill. */}
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 text-2xl font-medium md:text-4xl"
                  style={pillLabelStyle}
                >
                  <span>{content.pill}</span>
                </div>

                <div className="absolute inset-0" style={panelBodyStyle}>
                  <PanelBody {...content} {...preview} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={refs.outro} className="relative h-[100px]" aria-hidden="true" />
    </div>
  );
}

function PanelBody({
  heading,
  features,
  active,
  onSelect,
}: SendExpandContent & { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="h-full px-4 py-8 md:px-10 md:py-10 lg:px-14">
      <AppPreview heading={heading} features={features} active={active} onSelect={onSelect} />
    </div>
  );
}

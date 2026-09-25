/**
 * Motion constants and math for the "Send button expands to fullscreen" scroll
 * effect, ported 1:1 from the Extra (extra.email) landing page.
 *
 * The original is a Framer code component driving a `clip-path: inset(... round ...)`
 * on a sticky 100vh layer. Every number here comes from that implementation.
 */

/** Frame-based spring. Note: intentionally NOT time-corrected — the original
 *  integrates once per rAF tick, and that is part of the feel. */
export const SPRING = { stiffness: 0.08, damping: 0.65, threshold: 5e-4 } as const;

/** Resting size of the pill. Width is `min(maxWidth, 90% of viewport)`. */
export const BUTTON = { maxWidth: 785, height: 100 } as const;

/** Scroll budget, in pixels of the driver element, for each beat of the sequence. */
export const SCROLL = {
  /** Outline is traced over the first 100px. */
  drawPx: 100,
  /** Then it sits still for 50px. */
  pausePx: 50,
  /** The ring pops in at 128px. */
  shadowPx: 128,
  /** Head start before the pill starts growing (as a fraction of driver height). */
  revealPx: 10,
  holdPx: 90,
} as const;

/** The ring fades out over the first slice of the growth progress. */
export const RING_FADE = { start: 0.05, end: 0.2, range: 0.15 } as const;

/** Once the next section arrives, the panel insets and its bottom corners round. */
export const OUTRO = {
  rad: 60,
  padX: 60,
  padY: 40,
  radMobile: 24,
  padMobile: 12,
  breakpoint: 810,
  /** Panel content shrinks over this fraction of a viewport of
   *  scroll just before the next section arrives (ends as the inset starts). */
  exitSpan: 0.6,
} as const;

/** The traced outline and its gradient "hot tip". */
export const TRAIL = { tipLen: 0.12, fadeSpeed: 2, strokeW: 3, inset: 0 } as const;

export const TRAIL_FROM = "#000000";
export const TRAIL_TO = "#ff7a2a";

/** Halo around the resting pill. */
export const RING_COLOR = "#e7e5e4";

export type Spring = { value: number; velocity: number };

/** One spring step. Returns true once it has settled on `target`. */
export function stepSpring(s: Spring, target: number): boolean {
  const force = (target - s.value) * SPRING.stiffness;
  s.velocity = (s.velocity + force) * SPRING.damping;
  s.value += s.velocity;
  return (
    Math.abs(s.velocity) < SPRING.threshold && Math.abs(target - s.value) < SPRING.threshold
  );
}

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Truncate (not round) to 2dp, matching the original's `(v * 100 | 0) / 100`. */
export const trunc2 = (n: number) => ((n * 100) | 0) / 100;

/**
 * Stadium/rounded-rect path that starts at the top-center, so the trace reads as
 * two strokes running down either side and meeting at the bottom.
 */
export function pillPath(w: number, h: number): string {
  const { strokeW, inset } = TRAIL;
  const half = strokeW / 2;
  const r = Math.max(0, h / 2 - half - inset);
  const o = half + inset;
  const iw = w - strokeW - inset * 2;
  const ih = h - strokeW - inset * 2;
  return (
    `M${w / 2},${o}` +
    `L${o + iw - r},${o}A${r},${r},0,0,1,${o + iw},${o + r}` +
    `L${o + iw},${o + ih - r}A${r},${r},0,0,1,${o + iw - r},${o + ih}` +
    `L${o + r},${o + ih}A${r},${r},0,0,1,${o},${o + ih - r}` +
    `L${o},${o + r}A${r},${r},0,0,1,${o + r},${o}Z`
  );
}

/** Percentage insets that centre a `w x h` box in the viewport, lifted by `padBottom`. */
export function insetPercents(vw: number, vh: number, w: number, h: number, padBottom: number) {
  return {
    x: (((vw - w) / 2 / vw) * 100),
    top: (((vh - h) / 2 / vh) * 100),
    bottom: ((((vh - h) / 2 + padBottom) / vh) * 100),
  };
}

/** Ring opacity as a function of growth progress: solid, then a short fade. */
export function ringOpacity(p: number): number {
  if (p < RING_FADE.start) return 1;
  if (p > RING_FADE.end) return 0;
  return 1 - (p - RING_FADE.start) / RING_FADE.range;
}

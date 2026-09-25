import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";

// Card that widens as it scrolls in: it enters 80vw wide and, by the time its
// bottom meets the bottom of the viewport, stops a small gutter short of the
// edges, keeping its rounded corners throughout. Only clip-path animates, so
// the content inside never re-lays out. Reduced motion shows the final card.

// Resting gap between the card and the viewport edges.
const GUTTER = "12px";

export function ScrollExpandCard({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  // 1 = entering (80vw wide), 0 = settled.
  const closed = useTransform(scrollYProgress, [0, 1], [1, 0]);
  // Side inset eases from 10vw (80vw wide) down to the resting gutter.
  const clipPath = useMotionTemplate`inset(0 calc(${GUTTER} + ${closed} * (10vw - ${GUTTER})) round 2rem)`;

  return (
    <motion.div
      ref={ref}
      style={reduce ? { clipPath: `inset(0 ${GUTTER} round 2rem)` } : { clipPath }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

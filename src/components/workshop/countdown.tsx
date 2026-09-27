import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const units = [
  { key: "days", label: "วัน", ms: 86_400_000 },
  { key: "hours", label: "ชม.", ms: 3_600_000 },
  { key: "minutes", label: "นาที", ms: 60_000 },
  { key: "seconds", label: "วิ", ms: 1000 },
] as const;

function split(remaining: number) {
  let rest = Math.max(0, remaining);
  return units.map((u) => {
    const value = Math.floor(rest / u.ms);
    rest -= value * u.ms;
    return value;
  });
}

// One-line live countdown to `target` (an ISO date with offset), for the
// strip above the navbar. The static build can't know the visitor's "now",
// so the digits render as dashes until mount; the strip disappears once the
// target has passed.
export function Countdown({ target, label }: { target: string; label: string }) {
  const reduce = useReducedMotion();
  const end = new Date(target).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now !== null && now >= end) return null;
  const values = now === null ? null : split(end - now);

  // Same light grey as the page's content cards.
  return (
    <div className="flex items-center justify-center gap-3 bg-neutral-100 px-4 py-1.5 md:gap-4">
      <span className="text-sm text-foreground/60">{label}</span>
      <div className="flex items-center gap-1 md:gap-1.5" role="timer" aria-live="off">
        {units.map((u, i) => (
          <span
            key={u.key}
            className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 ring-1 ring-black/5"
          >
            <span className="relative block h-5 w-[2ch] overflow-hidden text-center text-sm leading-5 font-semibold tabular-nums">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={values ? values[i] : "–"}
                  initial={reduce ? false : { y: "-100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={reduce ? undefined : { y: "100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {values ? String(values[i]).padStart(2, "0") : "––"}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-xs leading-5 text-[#ff6a13]">{u.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

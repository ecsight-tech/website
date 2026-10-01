import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import HighlightedHeading from "../components/HighlightedHeading";
import { problemPills as pills } from "../data/content";

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter("th", { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

function TypewriterHashtag({ text }: { text: string }) {
  const graphemes = useMemo(() => splitGraphemes(text), [text]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = setTimeout(() => setCount(1), 800);
    return () => clearTimeout(start);
  }, []);

  useEffect(() => {
    if (count === 0) return;
    if (count >= graphemes.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), 300);
    return () => clearTimeout(id);
  }, [count, graphemes.length]);

  const visible = graphemes.slice(0, count).join("");
  const done = count >= graphemes.length;

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      className="absolute left-1/2 top-1/2 scale-150 md:scale-100 -translate-y-1/2 -translate-x-1/2 text-center text-[48px] font-semibold tracking-[-0.02em] text-brand md:text-[64px]"
    >
      <span>{visible}</span>
      <motion.span
        aria-hidden="true"
        animate={{ opacity: done ? [1, 0, 1] : 1 }}
        transition={
          done
            ? { duration: 0.9, repeat: Infinity, ease: "linear" }
            : { duration: 0 }
        }
        className="ml-1 inline-block w-[0.08em] align-[-0.05em]"
      >
        |
      </motion.span>
    </motion.p>
  );
}

export default function Problem() {
  return (
    <section className="relative overflow-hidden bg-bg-deep px-6 py-[120px] md:px-10 md:py-[160px]">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-20 md:gap-[120px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <HighlightedHeading
            prefix="เบื่อไหมที่ต้อง"
            highlight="ทำงานเดิม ๆ ซ้ำ ๆ ทุกวัน"
          />
        </motion.div>

        <div className="relative w-full h-[260px] md:h-[465px] lg:h-[620px]">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[620px] scale-[0.42] md:scale-75 lg:scale-100 origin-top">
            <svg
              className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2"
              width="1000"
              height="620"
              viewBox="-500 0 1000 620"
              fill="none"
              aria-hidden="true"
            >
              <motion.ellipse
                cx={0}
                cy={269}
                rx={482}
                ry={269}
                stroke="rgb(233,113,58)"
                strokeWidth={2}
                strokeDasharray="6 14"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </svg>
            <TypewriterHashtag text="#ทำวนไป" />
            {pills.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                style={{ left: `calc(50% + ${p.x}px)`, top: p.y }}
                className="absolute -translate-x-1/2 scale-150 md:scale-100"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  className="flex items-center whitespace-nowrap rounded-full border border-brand bg-bg-deep px-8 py-4 text-[24px] font-semibold tracking-[-0.02em] text-white md:text-[32px]"
                >
                  {p.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-[28px] font-semibold tracking-[-0.02em] text-white md:text-[40px] lg:text-[48px]"
        >
          จะดีกว่าไหม ถ้าคุณมีพนักงานฝีมือดี
          <br className="hidden md:block" />{" "}
          <span className="text-brand">ช่วยทำงาน 24 ชั่วโมง</span>
        </motion.p>
      </div>
    </section>
  );
}

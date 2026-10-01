import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { heroCards as cards, meta, workshop } from "../data/content";

const rotatingWords = [
  "ทำงาน",
  "สรุปประชุม",
  "ทำรายงาน",
  "เขียนคอนเทนต์",
  "หาไอเดีย",
];

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | "auto">("auto");

  useEffect(() => {
    const id = setInterval(
      () => setWordIdx((i) => (i + 1) % rotatingWords.length),
      1800,
    );
    return () => clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    if (measureRef.current) {
      setWidth(measureRef.current.offsetWidth);
    }
  }, [wordIdx]);

  return (
    <section id="top" className="relative overflow-hidden bg-bg pb-0 pt-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8 text-center"
        >
          <div className="inline-flex items-center gap-4">
            <div className="relative flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#01d3ad]" />
              <div className="w-3 h-3 rounded-full bg-[#01d3ad] animate-ping absolute" />
            </div>{" "}
            <p className="text-lg font-semibold text-brand md:text-2xl">
              {workshop.batch}
            </p>
          </div>

          <h1 className="max-w-[1063px] text-4xl font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-[64px] lg:text-[80px]">
            สร้าง AI Agent <br /> ที่พร้อม
            <span className="text-brand md:hidden">ทำงาน</span>
            <motion.span
              animate={{ width }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden md:inline-flex overflow-hidden align-bottom text-brand"
            >
              <span
                ref={measureRef}
                aria-hidden
                className="invisible whitespace-nowrap pointer-events-none absolute"
              >
                {rotatingWords[wordIdx]}
              </span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={rotatingWords[wordIdx]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="whitespace-nowrap"
                >
                  {rotatingWords[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </motion.span>
            แทนคุณ
            <span className="inline-flex items-center gap-3 align-middle">
              ด้วย{" "}
              <span className="inline-flex size-12 -rotate-3 hover:rotate-0 transition-all duration-300 items-center justify-center p-2 md:p-3 rounded-2xl md:rounded-3xl bg-brand-warm md:size-[70px] lg:size-[84px]">
                <span className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                  <img src="/claude-cowork/claude.svg" alt="Claude" />
                </span>
              </span>{" "}
              Claude ใน 1 วัน
            </span>
          </h1>

          <ul className="flex flex-col md:flex-row flex-wrap md:items-center justify-center gap-4 md:gap-6">
            {meta.map(({ icon: Icon, label, href }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-lg text-ink-muted md:text-xl lg:text-2xl"
              >
                <Icon className="size-5 md:size-6" strokeWidth={2} />
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-start md:text-center underline underline-offset-4 hover:text-ink"
                  >
                    {label}
                  </a>
                ) : (
                  <span className="font-semibold text-start md:text-center">
                    {label}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-5 mt-8">
            <motion.a
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={workshop.registerHref}
              className="inline-flex items-center justify-center rounded-[20px] bg-brand px-8 py-5 text-xl font-semibold text-white md:text-2xl"
            >
              ลงทะเบียน Workshop
            </motion.a>
            <p className="text-lg text-ink-muted md:text-xl">
              เปิดรับสมัครแล้ว ที่นั่งจำนวนจำกัด
            </p>
          </div>
        </motion.div>

        <div className="relative flex h-100 items-start justify-center -mt-16 md:mt-24 scale-60 md:scale-100 origin-bottom">
          {cards.map((c, i) => {
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: c.offsetY }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  rotate: `${c.rotate}deg`,
                  x: c.offsetX,
                  zIndex: i === 1 ? 10 : 1,
                }}
                className="absolute w-[380px] h-full rounded-t-4xl border border-neutral-200 bg-white p-12 shadow-lg"
              >
                <div className="flex items-center justify-center gap-3 w-fit mx-auto">
                  <div className="flex size-[100px] items-center justify-center rounded-3xl border border-neutral-200 text-neutral-700">
                    <img src={c.leftSrc} alt={c.leftAlt} className="size-14" />
                  </div>
                  <div className="h-px flex-1 border-t border-dashed border-neutral-300"></div>
                  <div className="flex size-[100px] items-center justify-center rounded-3xl border border-neutral-200 text-neutral-700">
                    <img
                      src={c.rightSrc}
                      alt={c.rightAlt}
                      className="size-14"
                    />
                  </div>
                </div>
                <h3 className="mt-8 text-center text-[32px] font-semibold tracking-tight text-black">
                  {c.title}
                </h3>
                <p className="mt-4 text-center text-lg leading-relaxed text-black/40">
                  {c.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

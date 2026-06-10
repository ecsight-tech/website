"use client";

import { motion } from "motion/react";
import { ImageIcon } from "lucide-react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const cards = [
  { className: "hidden xl:block w-72 aspect-[4/3] -ml-48 mt-24 -rotate-6", icon: false },
  { className: "w-80 aspect-[4/3] mt-16 -rotate-3", icon: false },
  { className: "w-72 aspect-[3/4] z-10", icon: true },
  { className: "w-80 aspect-[4/3] mt-16 rotate-3", icon: false },
  { className: "hidden xl:block w-72 aspect-[4/3] -mr-48 mt-24 rotate-6", icon: false },
];

export function Hero({
  badge = "Ecsight Group",
  titleLine1 = "One Partner To Launch",
  titleLine2 = "From Insight To Execution",
  subtitle = "พัฒนาศักยภาพธุรกิจและบุคลากรให้พร้อมรับมือกับอนาคต ด้วยโซลูชันเชิงลึก การอบรมระดับมืออาชีพ และเทคโนโลยีที่เหมาะสมกับธุรกิจ",
  ctaLabel = "เริ่มต้นรับคำแนะนำ",
  ctaHref = "#contact",
}: {
  badge?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden bg-black pt-40 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "radial-gradient(85% 90% at 50% 110%, #2b4bf2 0%, #1226a8 45%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="relative flex items-center gap-4"
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-linear-to-b from-[#3b5bff] to-[#1e3ad9] text-xl font-bold text-white shadow-lg shadow-blue-600/30">
          E
        </span>
        <span className="text-2xl font-medium text-white">{badge}</span>
      </motion.div>

      <h1 className="relative mt-8 text-balance text-5xl font-semibold leading-[1.15] tracking-tight md:text-7xl">
        <motion.span
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
          className="block text-white"
        >
          {titleLine1}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: easeOut }}
          className="block text-white/45"
        >
          {titleLine2}
        </motion.span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: easeOut }}
        className="relative mt-8 max-w-xl text-balance px-6 text-base text-white/70 md:text-lg"
      >
        {subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: easeOut }}
        className="relative mt-12"
      >
        <a
          href={ctaHref}
          className="inline-flex items-center rounded-full bg-linear-to-b from-[#3b5bff] to-[#1e3ad9] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/40 ring-1 ring-white/20 transition-transform hover:scale-[1.03]"
        >
          {ctaLabel}
        </a>
      </motion.div>

      <div className="relative mt-20 flex w-full items-start justify-center gap-8 px-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 + i * 0.08, ease: easeOut }}
            className={`flex shrink-0 items-center justify-center rounded-3xl bg-linear-to-b from-zinc-200 to-zinc-300 shadow-2xl ${card.className}`}
          >
            {card.icon && <ImageIcon className="size-20 text-zinc-400" strokeWidth={1.5} />}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

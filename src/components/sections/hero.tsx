"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FiImage } from "react-icons/fi";

import { LogoMark } from "@/components/site/logo";

const easeOut = [0.16, 1, 0.3, 1] as const;

const cards = [
  { left: "-14%", top: 120, rotate: -10, height: 420, width: 460 },
  { left: "8%", top: 64, rotate: -5, height: 480, width: 500 },
  { left: "50%", top: 0, rotate: 0, height: 620, width: 460, center: true },
  { left: "66%", top: 64, rotate: 5, height: 480, width: 500 },
  { left: "92%", top: 120, rotate: 10, height: 420, width: 460 },
];

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-background px-6 pt-44 md:pt-52">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%]"
        style={{
          background:
            "radial-gradient(75% 90% at 50% 115%, color-mix(in oklab, var(--primary) 90%, transparent), color-mix(in oklab, var(--primary) 35%, transparent) 55%, transparent 80%)",
        }}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="flex items-center gap-3"
        >
          <LogoMark className="size-12 text-2xl" />
          <span className="font-heading text-2xl font-medium md:text-3xl">
            {t("badge")}
          </span>
        </motion.span>

        <h1 className="mt-10 text-balance text-5xl leading-[1.12] tracking-tight md:text-7xl">
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            className="block"
          >
            {t("titleLine1")}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: easeOut }}
            className="block text-foreground/55"
          >
            {t("titleLine2")}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: easeOut }}
          className="mt-8 max-w-2xl text-pretty text-base text-foreground/80 md:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: easeOut }}
          href="#contact"
          className="mt-12 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-opacity hover:opacity-90"
        >
          {t("cta")}
        </motion.a>
      </div>

      <div className="relative mx-auto mt-24 h-[420px] max-w-7xl md:h-[520px]">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80, rotate: c.rotate }}
            animate={{ opacity: 1, y: 0, rotate: c.rotate }}
            transition={{ duration: 0.9, delay: 0.5 + i * 0.08, ease: easeOut }}
            className="absolute flex items-center justify-center rounded-3xl bg-[#d7d7d7]"
            style={{
              left: c.left,
              top: c.top,
              width: c.width,
              height: c.height,
              transform: c.center ? "translateX(-50%)" : undefined,
              zIndex: c.center ? 10 : 1,
            }}
          >
            {c.center ? <FiImage className="size-24 text-black/25" /> : null}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

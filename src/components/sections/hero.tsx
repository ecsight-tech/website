"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FiImage } from "react-icons/fi";

import Aurora from "@/components/Aurora";
import { LogoMark } from "@/components/site/logo";

const easeOut = [0.16, 1, 0.3, 1] as const;

const cards = [
  { left: "-14%", top: 120, rotate: -10, height: 420, width: 460 },
  { left: "8%", top: 64, rotate: -5, height: 480, width: 500 },
  {
    left: "50%",
    top: 0,
    rotate: 0,
    height: 620,
    width: 460,
    center: true,
  },
  { left: "66%", top: 64, rotate: 5, height: 480, width: 500 },
  { left: "92%", top: 120, rotate: 10, height: 420, width: 460 },
];

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden px-6 pt-20 md:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[80%]"
      >
        <Aurora
          colorStops={["#1F44E8", "#4D6BFF", "#1F44E8"]}
          amplitude={1.0}
          blend={0.6}
        />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="flex items-center gap-3"
        >
          <LogoMark className="size-12" />
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
          className="mt-8 max-w-2xl text-pretty text-base text-foreground/80 md:text-xl"
        >
          {t("subtitle")}
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: easeOut }}
          href="#contact"
          className="mt-12 rounded-full bg-linear-to-br from-10% from-[#195EDD] to-primary px-8 py-4 text-xl tracking-wide font-medium text-primary-foreground shadow-lg shadow-primary/30 inset-shadow-[0_1px_0_rgb(255_255_255/0.25)] hover:scale-105 transition-all duration-300 hover:opacity-90"
        >
          {t("cta")}
        </motion.a>
      </div>

      <div className="relative mx-auto mt-24 h-[420px] max-w-7xl md:h-[520px]">
        {cards.map((c, i) => (
          <div
            key={i}
            style={{
              left: c.left,
              top: c.top,
              width: c.width,
              height: c.height,
              transform: c.center ? "translateX(-50%)" : undefined,
              zIndex: c.center ? 10 : 1,
            }}
            className="absolute"
          >
            <motion.div
              initial={{ opacity: 0, y: 80, rotate: c.rotate }}
              animate={{ opacity: 1, y: 0, rotate: c.rotate }}
              transition={{
                duration: 0.9,
                delay: 0.5 + i * 0.08,
                ease: easeOut,
              }}
              className="flex size-full items-center justify-center rounded-3xl bg-[#d7d7d7]"
            >
              {c.center ? <FiImage className="size-24 text-black/25" /> : null}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}

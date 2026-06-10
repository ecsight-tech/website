"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { FiImage } from "react-icons/fi";

import Aurora from "@/components/Aurora";
import { LogoMark } from "@/components/site/logo";

const easeOut = [0.16, 1, 0.3, 1] as const;

const cards = [
  { left: "-14%", top: 120, rotate: -10, height: 420, width: 460, depth: 2 },
  { left: "8%", top: 64, rotate: -5, height: 480, width: 500, depth: 1 },
  { left: "50%", top: 0, rotate: 0, height: 620, width: 460, depth: 0, center: true },
  { left: "66%", top: 64, rotate: 5, height: 480, width: 500, depth: 1 },
  { left: "92%", top: 120, rotate: 10, height: 420, width: 460, depth: 2 },
];

export function Hero() {
  const t = useTranslations("hero");

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const centerY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const outerY = useTransform(scrollYProgress, [0, 1], [0, -190]);
  const depthY = [centerY, midY, outerY];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 pt-20 md:pt-28"
    >
      <motion.div
        aria-hidden
        style={{ y: auroraY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[80%]"
      >
        <Aurora
          colorStops={["#1F44E8", "#4D6BFF", "#1F44E8"]}
          amplitude={1.0}
          blend={0.6}
        />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
      >
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
          className="mt-12 rounded-full bg-linear-to-br from-10% from-[#195EDD] to-primary px-8 py-4 text-xl tracking-wide font-medium text-primary-foreground shadow-lg shadow-primary/30 inset-shadow-[0_1px_0_rgb(255_255_255/0.25)] transition-opacity hover:opacity-90"
        >
          {t("cta")}
        </motion.a>
      </motion.div>

      <div className="relative mx-auto mt-24 h-[420px] max-w-7xl md:h-[520px]">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            style={{
              y: depthY[c.depth],
              left: c.left,
              top: c.top,
              width: c.width,
              height: c.height,
              x: c.center ? "-50%" : 0,
              zIndex: c.center ? 10 : 1,
            }}
            className="absolute"
          >
            <motion.div
              initial={{ opacity: 0, y: 80, rotate: c.rotate }}
              animate={{ opacity: 1, y: 0, rotate: c.rotate }}
              transition={{ duration: 0.9, delay: 0.5 + i * 0.08, ease: easeOut }}
              className="flex size-full items-center justify-center rounded-3xl bg-[#d7d7d7]"
            >
              {c.center ? <FiImage className="size-24 text-black/25" /> : null}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

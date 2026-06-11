"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Marquee from "react-fast-marquee";
import { FiImage } from "react-icons/fi";

import Aurora from "@/components/Aurora";
import { LogoMark } from "@/components/site/logo";

const easeOut = [0.16, 1, 0.3, 1] as const;

const cards = [{ offset: 128 }, { offset: 0 }];

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden pt-20 md:pt-28">
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

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center px-6">
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

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: easeOut }}
        className="mt-16 mb-16 h-[528px] md:h-[608px]"
      >
        <Marquee speed={50} autoFill>
          {cards.map((c, i) => (
            <div
              key={i}
              style={{ marginTop: c.offset }}
              className="mx-2 flex h-[400px] w-[270px] items-center justify-center rounded-4xl bg-[#d7d7d7] md:mx-3 md:h-[480px] md:w-[320px]"
            >
              <FiImage className="size-20 text-black/25" />
            </div>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}

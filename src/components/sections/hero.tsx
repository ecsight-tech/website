"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const t = useTranslations("hero");
  const words = t("title").split(" ");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 20%, color-mix(in oklab, var(--primary) 30%, transparent), transparent)",
        }}
      />
      <div className="mx-auto w-full max-w-6xl">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-foreground/70"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          {t("badge")}
        </motion.span>

        <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: easeOut }}
              className="inline-block pr-[0.25em]"
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: easeOut }}
          className="mt-8 max-w-xl text-lg text-foreground/70"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: easeOut }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#contact"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            {t("ctaPrimary")}
          </a>
          <a
            href="#work"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
          >
            {t("ctaSecondary")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

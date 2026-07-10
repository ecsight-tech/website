import { motion } from "motion/react";

import Aurora from "@/components/Aurora";
import { PanoramaSlider } from "@/components/panorama-slider";
import { LogoMark } from "@/components/site/logo";
import { MotionButton } from "@/components/ui/button";
import type { Messages } from "@/i18n/ui";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero({ t }: { t: Messages["hero"] }) {
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
            {t.badge}
          </span>
        </motion.span>

        <h1 className="mt-10 text-balance text-3xl leading-[1.12] tracking-tight md:text-7xl">
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            className="block"
          >
            {t.titleLine1}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: easeOut }}
            className="block text-foreground/55"
          >
            {t.titleLine2}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: easeOut }}
          className="mt-8 max-w-2xl text-pretty text-base text-foreground/80 md:text-xl"
        >
          {t.subtitle}
        </motion.p>

        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <MotionButton
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: easeOut }}
            href="#contact"
            variant="primary"
            size="lg"
          >
            {t.cta}
          </MotionButton>
          <MotionButton
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: easeOut }}
            href="#work"
            variant="secondary"
            size="lg"
          >
            {t.secondaryCta}
          </MotionButton>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: easeOut }}
        className="mt-16 mb-8 h-[440px] md:h-[520px]"
      >
        <PanoramaSlider />
      </motion.div>
    </section>
  );
}

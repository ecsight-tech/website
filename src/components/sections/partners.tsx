"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";

import { urlFor } from "@/sanity/lib/image";

type Partner = {
  _id: string;
  name: string;
  industry?: string;
  description?: string;
  logo?: Parameters<typeof urlFor>[0];
};

export function Partners({ partners }: { partners?: Partner[] }) {
  const t = useTranslations("partners");
  const targetRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxShift, setMaxShift] = useState(0);

  // Progress spans exactly the sticky window: section top pinned -> bottom released
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setMaxShift(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [partners?.length]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);

  if (!partners || partners.length === 0) return null;

  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <h2 className="mx-auto w-full max-w-7xl px-6 text-4xl tracking-tight md:text-6xl">
          {t("heading")}
        </h2>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="mt-14 flex gap-6 pl-6 md:pl-12"
        >
          {partners.map((p) => (
            <article
              key={p._id}
              className="relative flex h-[580px] w-[500px] shrink-0 flex-col overflow-hidden rounded-4xl bg-white/[0.04] p-10"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(40% 35% at 92% 100%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 100%)",
                }}
              />
              <div className="relative">
                {p.logo ? (
                  <Image
                    src={urlFor(p.logo).width(112).height(112).url()}
                    alt={p.name}
                    width={56}
                    height={56}
                    className="size-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-16 rounded-full bg-[#d9d9d9]" />
                )}
                <h3 className="mt-6 font-heading text-3xl font-medium">
                  {p.name}
                </h3>
                {p.industry ? (
                  <p className="mt-1 text-2xl text-foreground/75">
                    {p.industry}
                  </p>
                ) : null}
                {p.description ? (
                  <p className="mt-6 text-lg leading-relaxed text-foreground/55">
                    {p.description}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

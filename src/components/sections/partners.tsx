import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import SpotlightCard from "@/components/SpotlightCard";
import { urlFor } from "@/sanity/lib/image";

type Partner = {
  _id: string;
  name: string;
  industry?: string;
  description?: string;
  logo?: Parameters<typeof urlFor>[0];
};

export function Partners({
  partners,
  heading,
}: {
  partners?: Partner[];
  heading: string;
}) {
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
      // Scroll-driven shift is desktop-only; mobile uses native swipe scroll
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setMaxShift(
        isDesktop
          ? Math.max(0, track.scrollWidth - window.innerWidth + 48)
          : 0,
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [partners?.length]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);

  if (!partners || partners.length === 0) return null;

  return (
    <section ref={targetRef} className="relative md:h-[300vh]">
      <div className="flex flex-col justify-center overflow-hidden py-20 md:sticky md:top-0 md:h-svh md:py-0">
        <h2 className="mx-auto w-full max-w-7xl px-6 text-4xl tracking-tight md:text-6xl">
          {heading}
        </h2>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="mt-10 flex flex-col gap-4 px-6 md:mt-14 md:flex-row md:pr-0 md:pl-12"
        >
          {partners.map((p) => (
            <SpotlightCard
              key={p._id}
              spotlightColor="color-mix(in oklab, var(--primary) 50%, transparent)"
              className="flex w-full shrink-0 flex-col rounded-4xl bg-white/4 p-6 sm:p-10 md:aspect-square md:w-[min(85vw,500px)]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
              />
              <div className="relative">
                {p.logo ? (
                  <div className="flex items-center justify-center size-14 sm:size-20">
                    <img
                      src={urlFor(p.logo).width(112).height(112).url()}
                      alt={p.name}
                      width={56}
                      height={56}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center size-14 sm:size-20">
                    <img
                      src="/dataechooo_logo.png"
                      alt={p.name}
                      width={56}
                      height={56}
                      loading="lazy"
                      className="size-14 rounded-full object-cover sm:size-20"
                    />
                  </div>
                )}
                <h3 className="mt-5 font-heading text-2xl font-medium sm:mt-8 sm:text-3xl">
                  {p.name}
                </h3>
                {p.industry ? (
                  <p className="mt-1 text-base text-foreground/75 sm:text-xl">
                    {p.industry}
                  </p>
                ) : null}
                {p.description ? (
                  <p className="mt-4 text-base leading-relaxed text-foreground/55 sm:mt-6 sm:text-xl">
                    {p.description}
                  </p>
                ) : null}
              </div>
            </SpotlightCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

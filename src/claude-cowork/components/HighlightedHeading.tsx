import { motion } from "motion/react";

type Props = {
  prefix: string;
  suffix?: string;
  highlight: string;
  align?: "left" | "center";
};

export default function HighlightedHeading({
  prefix,
  highlight,
  suffix,
  align = "center",
}: Props) {
  const alignClass = align === "left" ? "text-left" : "text-center";
  return (
    <h2
      className={`relative ${alignClass} text-4xl font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[56px] lg:text-[64px]`}
    >
      {prefix}{" "}
      <span className="relative inline-block">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
          style={{ originX: 0 }}
          className="absolute left-0 top-0 z-0 block h-12 w-full rotate-[-0.5deg] bg-brand md:h-20"
        />
        <span className="relative z-10 ">{highlight}</span>
      </span>
      <br />
      <span className="relative z-10 inline-block">{suffix}</span>
    </h2>
  );
}

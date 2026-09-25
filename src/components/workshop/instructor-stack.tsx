import { createRef, useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MeshGradient } from "@mesh-gradient/react";
import { UserRoundedIcon } from "@solar-icons/react/linear";

export type Instructor = {
  name: string;
  nickname: string;
  org: string;
  bio: string;
  photo?: string;
  logos: boolean;
};

// Sticky offset (px) shared by every card, so a later card lands exactly on
// top of the earlier one.
const STICKY_TOP = 96;
// How far a covered card shrinks back as the next card slides over it.
const COVERED_SCALE = 0.9;
// Photo backdrop: black dominant, orange secondary, a light highlight.
// Later colors are drawn as higher wave layers and cover more, so the
// highlight sits lowest and black on top. The highlight is #F7EABE blended
// 50% into the orange so its band reads as warm light rather than a large
// cream area. Each card gets its own seed so the animated patterns differ.
export const MESH_COLORS: [string, string, string, string] = [
  "#000000",
  "#fbaa69",
  "#ff6a13",
  "#000000",
];

// Stacking cards: on md+ each card sticks at the same offset and the next one
// scrolls up over it while the covered card scales back. On mobile the cards
// are taller than the viewport, so they simply stack in flow.
export function InstructorStack({ instructors }: { instructors: Instructor[] }) {
  const wrappers = useRef(instructors.map(() => createRef<HTMLDivElement>()));

  return (
    <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-12 md:mt-14 md:gap-24 md:pb-24">
      {instructors.map((p, i) => (
        <div
          key={p.name}
          ref={wrappers.current[i]}
          className="md:sticky"
          style={{ top: STICKY_TOP }}
        >
          <Card instructor={p} nextRef={wrappers.current[i + 1]} seed={i + 1} />
        </div>
      ))}
    </div>
  );
}

function Card({
  instructor: p,
  nextRef,
  seed,
}: {
  instructor: Instructor;
  /** Mesh gradient seed — distinct per card for different patterns. */
  seed: number;
  /** Wrapper of the card that slides over this one; drives the shrink. */
  nextRef?: RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: nextRef as RefObject<HTMLElement> | undefined,
    offset: ["start end", `start ${STICKY_TOP}px`],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, nextRef ? COVERED_SCALE : 1],
  );

  return (
    <motion.article
      style={{ "--stack-scale": scale } as React.CSSProperties}
      className="grid origin-top overflow-hidden rounded-[2rem] bg-neutral-100 md:scale-(--stack-scale) md:grid-cols-[2fr_3fr]"
    >
      <div className="relative isolate flex items-end justify-center bg-black px-6 pt-10 md:pt-16">
        <MeshGradient
          aria-hidden
          className="absolute inset-0 -z-10 size-full"
          options={{ colors: MESH_COLORS, seed, animationSpeed: 0.8 }}
        />
        {p.photo ? (
          <img
            src={p.photo}
            alt={p.name}
            loading="lazy"
            className="max-h-[28rem] w-auto max-w-full object-contain object-bottom"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-t-3xl bg-white/10">
            <UserRoundedIcon className="size-16 text-white/30" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center px-6 py-10 md:py-16 md:pr-16">
        <h3 className="text-3xl leading-snug md:text-4xl">
          {p.name} <span className="whitespace-nowrap">{p.nickname}</span>
        </h3>
        <p className="mt-1 text-xl text-foreground/50">{p.org}</p>
        <p className="mt-6 max-w-sm leading-loose text-foreground/50">{p.bio}</p>
        {p.logos ? (
          <div className="mt-8 flex items-center gap-5">
            <img src="/ecsight-logo-bl.svg" alt="Ecsight" className="h-8 w-auto" />
            <img src="/dataechooo-logo-bl.svg" alt="Data Echooo" className="h-7 w-auto" />
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

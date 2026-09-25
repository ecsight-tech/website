import { useEffect, useRef, useState, type RefObject } from "react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";

import type { Instructor } from "@/components/workshop/instructor-stack";

const ease = [0.16, 1, 0.3, 1] as const;
// Gap between the cursor and the card's nearest corner.
const OFFSET = 16;

type Speaker = Pick<Instructor, "name" | "nickname" | "org" | "bio" | "photo">;

// Hero speaker cut-outs. Hovering one (mouse only) enlarges it, greys out the
// other, and grows a detail card out of the cursor that then trails it on a
// spring. The card flips to the other side of the cursor near the column's
// right/bottom edge so the hero's rounded clip never cuts it off. Each
// speaker has their own card: moving to the other one leaves the old card
// where it was to close, while a new card opens at the cursor.
export function HeroSpeakers({ speakers }: { speakers: Speaker[] }) {
  const reduce = useReducedMotion() ?? false;
  const boxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [flip, setFlip] = useState({ x: false, y: false });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const track = (e: React.PointerEvent) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const lx = e.clientX - box.left;
    const ly = e.clientY - box.top;
    const w = cardRef.current?.offsetWidth ?? 288;
    const h = cardRef.current?.offsetHeight ?? 180;
    setFlip({ x: lx + OFFSET + w > box.width, y: ly + OFFSET + h > box.height });
    mx.set(lx);
    my.set(ly);
  };

  const enter = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    // Update the cursor first so the new card is born exactly there.
    track(e);
    setHovered(i);
  };

  const speaker = hovered === null ? null : speakers[hovered];

  return (
    <div
      ref={boxRef}
      onPointerMove={(e) => e.pointerType === "mouse" && track(e)}
      onPointerLeave={() => setHovered(null)}
      className="relative flex items-end justify-center self-end"
    >
      {speakers.map((p, i) => {
        const active = hovered === i;
        const dimmed = hovered !== null && !active;
        // The second cut-out sits a little smaller and tucked behind.
        const base = i === 1 ? 0.9 : 1;
        return p.photo ? (
          <motion.img
            key={p.name}
            src={p.photo}
            alt={p.name}
            onPointerEnter={enter(i)}
            initial={false}
            animate={{
              scale: active ? base * 1.06 : base,
              filter: dimmed ? "grayscale(1) brightness(0.7)" : "grayscale(0) brightness(1)",
            }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease }}
            style={{ zIndex: active ? 2 : 1 }}
            className={
              "relative w-1/2 max-w-80 origin-bottom object-contain object-bottom" + (i === 1 ? " -ml-10" : "")
            }
          />
        ) : null;
      })}

      <AnimatePresence>
        {speaker && (
          <SpeakerCard
            key={speaker.name}
            speaker={speaker}
            mx={mx}
            my={my}
            flip={flip}
            reduce={reduce}
            cardRef={cardRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// One speaker's card. While present it trails the cursor on its own spring;
// once its speaker is left it stops following (position and flip frozen) and
// collapses into the corner where the cursor last was.
function SpeakerCard({
  speaker,
  mx,
  my,
  flip,
  reduce,
  cardRef,
}: {
  speaker: Speaker;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  flip: { x: boolean; y: boolean };
  reduce: boolean;
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  const present = useIsPresent();
  const presentRef = useRef(present);
  presentRef.current = present;
  const frozenFlip = useRef(flip);
  if (present) frozenFlip.current = flip;
  const f = frozenFlip.current;

  // Local copies of the cursor that stop updating on exit.
  const px = useMotionValue(mx.get());
  const py = useMotionValue(my.get());
  useEffect(() => {
    const offX = mx.on("change", (v) => presentRef.current && px.set(v));
    const offY = my.on("change", (v) => presentRef.current && py.set(v));
    return () => {
      offX();
      offY();
    };
  }, [mx, my, px, py]);
  const spring = reduce ? { duration: 0 } : { stiffness: 500, damping: 40, mass: 0.6 };
  const x = useSpring(px, spring);
  const y = useSpring(py, spring);

  return (
    <motion.div aria-hidden style={{ x, y }} className="pointer-events-none absolute top-0 left-0 z-10">
      <motion.div
        ref={present ? cardRef : undefined}
        initial={{ scale: 0, opacity: 0, borderRadius: 40 }}
        animate={{ scale: 1, opacity: 1, borderRadius: 20, transition: reduce ? { duration: 0 } : { duration: 0.45, ease } }}
        exit={{ scale: 0, opacity: 0, borderRadius: 40, transition: reduce ? { duration: 0 } : { duration: 0.3, ease } }}
        style={{
          // Grows out of (and collapses back into) its corner at the cursor.
          transformOrigin: `${f.x ? "right" : "left"} ${f.y ? "bottom" : "top"}`,
          translateX: f.x ? `calc(-100% - ${OFFSET}px)` : OFFSET,
          translateY: f.y ? `calc(-100% - ${OFFSET}px)` : OFFSET,
        }}
        className="w-72 overflow-hidden bg-white p-5 text-left text-black shadow-[0_20px_40px_-12px_rgb(0_0_0/0.5)]"
      >
        <p className="text-lg leading-snug font-semibold">
          {speaker.name} <span className="font-normal text-black/50">{speaker.nickname}</span>
        </p>
        <p className="mt-0.5 text-sm text-[#ff6a13]">{speaker.org}</p>
        <p className="mt-3 text-sm leading-relaxed text-black/70">{speaker.bio}</p>
      </motion.div>
    </motion.div>
  );
}

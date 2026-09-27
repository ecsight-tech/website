import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import {
  BookIcon,
  CameraIcon,
  BoxIcon,
  Buildings2Icon,
  CalculatorIcon,
  CaseIcon,
  ChefHatIcon,
  CodeFileIcon,
  CupHotIcon,
  DumbbellIcon,
  HeartIcon,
  HomeIcon,
  PawIcon,
  PlayIcon,
  ScissorsIcon,
  ShopIcon,
  SquareAcademicCapIcon,
  TShirtIcon,
  StethoscopeIcon,
} from "@solar-icons/react/bold";

import { cn } from "@/lib/utils";

export type PerkLoopVariant = "kit" | "help" | "network" | "community" | "replay" | "discount";

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 260, damping: 26 } as const;

// Real imagery from /public, shared with the rest of the page.
const PHOTO = {
  chef: "/workshop/instructor-chef.webp",
  jerome: "/workshop/instructor-jerome.webp",
  class: [1, 2, 3, 4].map((n) => `/workshop/class/class-${n}.webp`),
};

// Looping illustration for each perk card, on a transparent stage (the
// card's own grey shows through). Each variant pauses while off-screen and
// renders a still frame for reduced motion.
export function PerkLoop({ variant }: { variant: PerkLoopVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const reduce = useReducedMotion() ?? false;
  const playing = inView && !reduce;

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 select-none">
      {variant === "kit" ? <Kit playing={playing} /> : null}
      {variant === "help" ? <Help playing={playing} reduce={reduce} /> : null}
      {variant === "network" ? <Network playing={playing} /> : null}
      {variant === "community" ? <Community playing={playing} /> : null}
      {variant === "replay" ? <Replay playing={playing} /> : null}
      {variant === "discount" ? <Discount playing={playing} reduce={reduce} /> : null}
    </div>
  );
}

// Advances 0 → n-1 → 0 … every `ms` while playing.
function useStep(playing: boolean, n: number, ms: number, initial = 0) {
  const [step, setStep] = useState(initial);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setStep((s) => (s + 1) % n), ms);
    return () => clearInterval(id);
  }, [playing, n, ms]);
  return step;
}

/* ── Shared pieces, matching the "why" card mock-ups ────────────────────── */

const shadow = "shadow-[0_12px_28px_-14px_rgb(0_0_0/0.5)]";

// White app card with the orange brand tile and optional Live badge (same
// look as MockFrame in why-loops.tsx).
function Frame({
  title,
  subtitle,
  mark = "M",
  live,
  className,
  children,
}: {
  title: string;
  subtitle: string;
  mark?: ReactNode;
  live?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-white text-[10px] text-foreground/70 ring-1 ring-black/5", shadow, className)}>
      <div className="flex items-center gap-2 px-3 pt-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#ff9447] to-[#ff6a13] text-[10px] font-bold text-white shadow-sm">
          {mark}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[11px] font-semibold text-foreground">{title}</p>
          <p className="truncate text-foreground/45">{subtitle}</p>
        </div>
        {live ? (
          <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#16a34a]/10 px-2 py-0.5 font-medium text-[#16a34a]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#16a34a]" />
            Live
          </span>
        ) : null}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

// Black tile with the orange inner glow (the hero chips' icon style).
function GlowIcon({ Icon, className }: { Icon: ComponentType<{ className?: string }>; className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[9px] bg-black text-white shadow-[0_0_0_1px_#000,inset_0_0_10px_rgb(254_105_19/0.8)]",
        className,
      )}
    >
      <Icon className="size-[55%] [filter:drop-shadow(0_0_3px_#fe6913)]" />
    </span>
  );
}

// Round instructor cut-out on the orange mesh colours.
function Face({ src, className }: { src: string; className?: string }) {
  return (
    <span
      className={cn(
        "block shrink-0 overflow-hidden rounded-full bg-linear-to-br from-[#fbaa69] to-[#ff6a13] ring-2 ring-white",
        className,
      )}
    >
      <img src={src} alt="" className="size-full scale-150 object-cover object-top pt-1" />
    </span>
  );
}

/* ── Kit: template code, skill, guidebook take turns at the front ────────── */

const kitItems = [
  { key: "code", Item: CodeItem },
  { key: "skill", Item: SkillItem },
  { key: "book", Item: BookItem },
];
// Front, then fanned out left and right behind it.
const fan = [
  { x: "0%", y: "0%", rotate: 0, scale: 1, zIndex: 3, filter: "brightness(1)" },
  { x: "-36%", y: "6%", rotate: -8, scale: 0.86, zIndex: 2, filter: "brightness(0.8)" },
  { x: "36%", y: "6%", rotate: 8, scale: 0.86, zIndex: 1, filter: "brightness(0.8)" },
];

function Kit({ playing }: { playing: boolean }) {
  const front = useStep(playing, kitItems.length, 2400);
  return (
    <div className="absolute top-1/2 left-1/2 aspect-[4/5] w-[40%] max-w-44 -translate-1/2">
      {kitItems.map(({ key, Item }, i) => {
        const depth = (i - front + kitItems.length) % kitItems.length;
        const { zIndex, ...pose } = fan[depth];
        return (
          <motion.div
            key={key}
            initial={false}
            animate={pose}
            transition={spring}
            style={{ zIndex }}
            className="absolute inset-0"
          >
            <Item />
          </motion.div>
        );
      })}
    </div>
  );
}

function CodeItem() {
  return (
    <div className={cn("flex h-full flex-col overflow-hidden rounded-2xl bg-[#141414] ring-1 ring-white/10", shadow)}>
      <div className="flex items-center gap-1 border-b border-white/10 px-3 py-2">
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="size-1.5 rounded-full bg-white/25" />
        <span className="ml-1.5 font-mono text-[8px] text-white/40">app.tsx</span>
      </div>
      <div className="space-y-0.5 p-3 font-mono text-[8px] leading-relaxed text-white/60">
        <p>
          <span className="text-[#ff7a2a]">export default</span> <span className="text-white">App</span>
        </p>
        <p className="pl-2">
          <span className="text-[#ff7a2a]">return</span> <span className="text-[#fbaa69]">&lt;Booking</span>
        </p>
        <p className="pl-4">
          shop=<span className="text-[#fbaa69]">"MyShop"</span>
        </p>
        <p className="pl-2 text-[#fbaa69]">/&gt;</p>
      </div>
      <div className="mt-auto flex items-center gap-2 p-3">
        <GlowIcon Icon={CodeFileIcon} className="size-6" />
        <span className="text-[9px] font-semibold text-white">Template code</span>
      </div>
    </div>
  );
}

function SkillItem() {
  return (
    <Frame title="SKILL.md" subtitle="ระบบจองคิว" mark="S" className="flex h-full flex-col">
      <div className="flex flex-col gap-1.5 text-[8px]">
        {["สร้างฟอร์ม", "เชื่อม database", "Deploy ขึ้นเว็บ"].map((s) => (
          <span key={s} className="flex items-center gap-1.5 rounded-lg bg-neutral-50 px-2 py-1.5 ring-1 ring-black/5">
            <span className="flex size-3 items-center justify-center rounded-full bg-[#ff6a13] text-[7px] text-white">✓</span>
            {s}
          </span>
        ))}
      </div>
    </Frame>
  );
}

function BookItem() {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl bg-linear-to-br from-[#ffb070] via-[#ff6a13] to-[#b8430a] p-3 pl-4 text-white",
        shadow,
      )}
    >
      {/* Spine + gloss, like the page's orange buttons. */}
      <span className="absolute inset-y-0 left-0 w-2 bg-black/20" />
      <span className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/30 to-transparent to-50%" />
      <BookIcon className="relative size-5 opacity-90" />
      <p className="relative mt-auto text-[8px] opacity-80">Guidebook</p>
      <p className="relative text-[13px] leading-tight font-semibold">
        Build Apps
        <br />
        with AI
      </p>
    </div>
  );
}

/* ── Help: stuck on an error → raise a hand → an instructor fixes it ────── */

function Help({ playing, reduce }: { playing: boolean; reduce: boolean }) {
  // 0 error, 1 hand raised, 2 instructor arrives, 3 fixed.
  const step = useStep(playing, 4, 1500, reduce ? 3 : 0);
  const fixed = step === 3;

  return (
    <div className="absolute inset-x-[7%] top-1/2 flex -translate-y-1/2 items-end gap-3 md:inset-x-[12%]">
      <Frame title="จองคิว · MyShop" subtitle="บันทึกการจอง" live={fixed} className="flex-1">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-xl bg-neutral-50 p-2 ring-1 ring-black/5">
            <p className="text-foreground/45">ลูกค้า</p>
            <p className="mt-0.5 font-semibold whitespace-nowrap text-foreground">คุณมิ้นท์</p>
          </div>
          <div className="rounded-xl bg-neutral-50 p-2 ring-1 ring-black/5">
            <p className="text-foreground/45">เวลา</p>
            <p className="mt-0.5 font-semibold whitespace-nowrap text-foreground">13:00 น.</p>
          </div>
        </div>
        <motion.div
          initial={false}
          animate={{ backgroundColor: fixed ? "rgb(22 163 74 / 0.1)" : "rgb(239 68 68 / 0.1)" }}
          className="mt-2 flex items-center gap-2 rounded-xl px-2.5 py-2"
        >
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white transition-colors",
              fixed ? "bg-[#16a34a]" : "bg-red-500",
            )}
          >
            {fixed ? "✓" : "!"}
          </span>
          <span className={cn("truncate font-medium", fixed ? "text-[#16a34a]" : "text-red-600")}>
            {fixed ? "บันทึกสำเร็จแล้ว" : "บันทึกไม่สำเร็จ"}
          </span>
        </motion.div>
      </Frame>

      <div className="flex w-20 shrink-0 flex-col items-center gap-2 md:w-28">
        <AnimatePresence mode="popLayout">
          {step === 1 ? (
            <Bubble key="ask">✋ ขอช่วยหน่อย</Bubble>
          ) : step >= 2 ? (
            <Bubble key="coming" accent>
              {fixed ? "เรียบร้อย 👍" : "ไปช่วยครับ"}
            </Bubble>
          ) : null}
        </AnimatePresence>
        <div className="flex -space-x-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-semibold text-white ring-2 ring-white">
            คุณ
          </span>
          <motion.span
            initial={false}
            animate={step >= 2 ? { x: 0, opacity: 1, scale: 1 } : { x: 16, opacity: 0, scale: 0.6 }}
            transition={spring}
          >
            <Face src={PHOTO.jerome} className="size-10" />
          </motion.span>
        </div>
      </div>
    </div>
  );
}

// Chat bubble: dark, or orange for the instructor.
function Bubble({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.9 }}
      transition={{ duration: 0.35, ease }}
      className={cn(
        "rounded-2xl px-2.5 py-1.5 text-center text-[10px] leading-tight whitespace-nowrap text-white",
        accent
          ? "bg-linear-to-br from-[#ff9447] to-[#ff6a13] shadow-sm"
          : "bg-neutral-900",
      )}
    >
      {children}
    </motion.span>
  );
}

/* ── Network: businesses from every field, three marquee rows ─────────────── */

const businesses: [ComponentType<{ className?: string }>, string][] = [
  [CupHotIcon, "ร้านกาแฟ"],
  [StethoscopeIcon, "คลินิก"],
  [HomeIcon, "อสังหาฯ"],
  [ShopIcon, "ร้านออนไลน์"],
  [Buildings2Icon, "โรงงาน"],
  [CaseIcon, "ที่ปรึกษา"],
  [ChefHatIcon, "ร้านอาหาร"],
  [ScissorsIcon, "ร้านเสริมสวย"],
  [BoxIcon, "นำเข้า-ส่งออก"],
  [SquareAcademicCapIcon, "สถาบันกวดวิชา"],
  [DumbbellIcon, "ฟิตเนส"],
  [CalculatorIcon, "สำนักงานบัญชี"],
  [TShirtIcon, "ร้านเสื้อผ้า"],
  [CameraIcon, "สตูดิโอถ่ายภาพ"],
  [PawIcon, "ร้านสัตว์เลี้ยง"],
];

// Three rows, all drifting left at different speeds (seconds per loop), each
// starting partway through its loop so the rows never line up.
const lanes = [
  { duration: 60, delay: -8 },
  { duration: 43, delay: -30 },
  { duration: 54, delay: -18 },
];

function Network({ playing }: { playing: boolean }) {
  const per = Math.ceil(businesses.length / lanes.length);
  const rows = lanes.map((_, r) => businesses.slice(r * per, (r + 1) * per));
  return (
    <>
    <div className="absolute inset-0 flex flex-col justify-center gap-3 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      {rows.map((row, r) => (
        <div
          key={r}
          className="flex w-max gap-3"
          style={{
            animation: `perk-marquee ${lanes[r].duration}s linear ${lanes[r].delay}s infinite`,
            animationPlayState: playing ? "running" : "paused",
          }}
        >
          {/* The row twice, then that pair again: the -50% loop lands on an
              identical frame, and one half is always wider than the card. */}
          {[...row, ...row, ...row, ...row].map(([Icon, label], i) => (
            <span
              key={i}
              className="flex items-center gap-2 rounded-full bg-white py-3 pr-4 pl-3.5 text-sm whitespace-nowrap ring-1 ring-black/5"
            >
              <Icon className="size-5 text-[#ff6a13]" />
              {label}
            </span>
          ))}
        </div>
      ))}
    </div>

    {/* Heart tile floating in the middle, above the rows: solid black with
        the highlighted pricing card's raised edge (.card-raised, defined in
        BuildAppsWithAI.astro). That class owns box-shadow, so the float
        shadow goes on the wrapper as a filter. */}
    <motion.div
      animate={playing ? { y: [0, -8, 0], rotate: [-3, 3, -3] } : { y: 0, rotate: 0 }}
      transition={playing ? { duration: 4, ease: "easeInOut", repeat: Infinity } : { duration: 0.4 }}
      className="absolute top-1/2 left-1/2 z-10 -mt-10 -ml-10 size-20 [filter:drop-shadow(0_16px_18px_rgb(0_0_0/0.3))] md:-mt-12 md:-ml-12 md:size-24"
    >
      <span className="card-raised flex size-full items-center justify-center rounded-[28%] bg-black">
        <HeartIcon className="size-[48%] text-[#ff6a13]" />
      </span>
    </motion.div>
    </>
  );
}

/* ── Community: the LINE OpenChat group, messages arriving ─────────────── */

// A dark-mode LINE OpenChat screen (the real "Ecsight Club" group). Messages
// arrive at the bottom and push older ones up and out of the top.
type Msg =
  | { kind: "date"; text: string }
  | { kind: "text"; who: string; photo?: string; text: string; time: string }
  | { kind: "image"; who: string; photo?: string; src: string; time: string }
  | { kind: "own"; text: string; time: string };

const thread: Msg[] = [
  { kind: "date", text: "Wed, 23/09" },
  { kind: "text", who: "Safe", photo: PHOTO.chef, text: "Opus 5.5 ปล่อยออกมาแล้ว เก่งขึ้นเยอะเลยค้าบ", time: "11:50" },
  { kind: "text", who: "นก", text: "ร้านนวดของฉันเปิดจองคิวผ่านแอปแล้ว 🎉", time: "11:52" },
  { kind: "image", who: "Jerome", photo: PHOTO.jerome, src: PHOTO.class[1], time: "11:55" },
  { kind: "text", who: "Jerome", photo: PHOTO.jerome, text: "สรุปเทคนิคจากคลาสล่าสุดครับ", time: "11:55" },
  { kind: "own", text: "ขอบคุณครับ ได้ไอเดียเยอะเลย 🙏", time: "11:56" },
  { kind: "text", who: "ปอ", text: "เชื่อม LINE OA ยังไงดีครับ", time: "11:58" },
  { kind: "text", who: "Safe", photo: PHOTO.chef, text: "คืนนี้ Live สอนเลยครับ 🔥", time: "12:01" },
];
// Rendered window: enough that the oldest one is already clipped off the
// top before it's dropped.
const WINDOW = 6;

function Community({ playing }: { playing: boolean }) {
  const [count, setCount] = useState(4);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setCount((c) => c + 1), 1900);
    return () => clearInterval(id);
  }, [playing]);
  const shown = Array.from({ length: Math.min(count, WINDOW) }, (_, k) => count - Math.min(count, WINDOW) + k);

  return (
    <div
      className={cn(
        "absolute inset-x-[6%] inset-y-[7%] isolate flex flex-col overflow-hidden rounded-2xl bg-[#0b0f1a] text-[9px] text-white ring-1 ring-white/10",
        shadow,
      )}
    >
      {/* Club artwork glow behind the chat, like the group's wallpaper. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgb(37_99_235/0.28),transparent_60%)]" />

      {/* LINE header: back, OpenChat badge, group name + member count. */}
      <div className="relative z-10 flex items-center gap-1.5 bg-[#1c1c1e] px-2.5 py-2">
        <svg viewBox="0 0 24 24" className="size-3 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-[#06c755]">
          <span className="size-1.5 rounded-full border border-white" />
        </span>
        <p className="min-w-0 truncate text-[10px] font-semibold">Ecsight Club - AI & Business Community</p>
        <span className="shrink-0 text-[10px] font-semibold">(122)</span>
        <svg viewBox="0 0 24 24" className="ml-auto size-3 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.5-4.5" />
        </svg>
        <svg viewBox="0 0 24 24" className="size-3 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M5 7h14M5 12h14M5 17h14" />
        </svg>
      </div>

      {/* Thread: bottom-anchored; older messages fade out well before they
          reach the header, so nothing shows cut against its edge. */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-2.5 pt-4 pb-2 [mask-image:linear-gradient(to_bottom,transparent,transparent_12%,black_45%)]">
        {shown.map((n) => (
          <motion.div
            key={n}
            layout="position"
            initial={n < 4 ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <Message msg={thread[n % thread.length]} />
          </motion.div>
        ))}
      </div>

      {/* Input bar. */}
      <div className="relative flex items-center gap-2 bg-[#1c1c1e] px-2.5 py-1.5">
        <span className="text-[13px] leading-none text-white/70">+</span>
        <span className="flex-1 rounded-full bg-white/10 px-2.5 py-1 text-white/35">Aa</span>
        <span className="size-2.5 rounded-full border-[1.5px] border-white/60" />
      </div>
    </div>
  );
}

function Message({ msg }: { msg: Msg }) {
  if (msg.kind === "date") {
    return (
      <p className="mx-auto w-fit rounded-full bg-black/40 px-2 py-0.5 text-[8px] text-white/70">{msg.text}</p>
    );
  }
  if (msg.kind === "own") {
    return (
      <div className="flex items-end justify-end gap-1">
        <span className="text-[7px] text-white/40">{msg.time}</span>
        <p className="max-w-[72%] rounded-2xl rounded-tr-sm bg-[#86e36d] px-2.5 py-1.5 leading-snug text-black">{msg.text}</p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-1.5">
      {msg.photo ? (
        <Face src={msg.photo} className="size-6 ring-0" />
      ) : (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-600 text-[8px] font-semibold">
          {msg.who.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-[8px] text-white/60">{msg.who}</p>
        <div className="mt-0.5 flex items-end gap-1">
          {msg.kind === "image" ? (
            <img src={msg.src} alt="" className="h-14 w-24 rounded-xl object-cover" />
          ) : (
            <p className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[#2c2c2e] px-2.5 py-1.5 leading-snug">{msg.text}</p>
          )}
          <span className="shrink-0 text-[7px] text-white/40">{msg.time}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Replay: a deck of recorded sessions, shuffling to the front ─────── */

const sessions = ["ไอเดีย", "ออกแบบ", "สร้างแอป"];
const DECK_MS = 2600;
// Front, then tucked behind it: lower, and tilted out to either side.
const deck = [
  { x: "0%", y: "0%", rotate: 0, scale: 1, zIndex: 3, filter: "brightness(1)" },
  { x: "-9%", y: "5%", rotate: -3, scale: 1.02, zIndex: 2, filter: "brightness(0.55)" },
  { x: "9%", y: "5%", rotate: 3, scale: 1.02, zIndex: 1, filter: "brightness(0.55)" },
];

function Replay({ playing }: { playing: boolean }) {
  const front = useStep(playing, deck.length, DECK_MS);
  return (
    <div className="absolute top-1/2 left-1/2 aspect-video w-[66%] -translate-1/2">
      {deck.map((_, i) => {
        const depth = (i - front + deck.length) % deck.length;
        const { zIndex, ...pose } = deck[depth];
        const isFront = depth === 0;
        return (
          <motion.div
            key={i}
            initial={false}
            animate={pose}
            transition={spring}
            style={{ zIndex }}
            className={cn("absolute inset-0 overflow-hidden rounded-2xl bg-black ring-1", shadow, isFront ? "ring-white/60" : "ring-white/10")}
          >
            {/* A class photo as the recording's thumbnail. */}
            <img src={PHOTO.class[i % PHOTO.class.length]} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10" />

            <motion.span
              initial={false}
              animate={{ opacity: isFront ? 1 : 0, scale: isFront ? 1 : 0.8 }}
              transition={{ duration: 0.3, ease }}
              className="absolute top-1/2 left-1/2 flex size-11 -translate-1/2 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40 backdrop-blur-md"
            >
              <PlayIcon className="size-5 text-white" />
            </motion.span>

            <div className="absolute inset-x-3 bottom-3 text-white">
              <p className="text-[10px] font-semibold">
                Session {i + 1} · {sessions[i]}
              </p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/25">
                {/* Plays through while this card is at the front. */}
                <motion.div
                  initial={false}
                  animate={{ width: isFront && playing ? "100%" : isFront ? "40%" : "0%" }}
                  transition={{ duration: isFront && playing ? DECK_MS / 1000 : 0.2, ease: "linear" }}
                  className="h-full rounded-full bg-[#ff6a13]"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Discount: regular price crossed out, rolls down to the alumni price ── */

const FULL = 4990;
const ALUMNI = 1590;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function Discount({ playing, reduce }: { playing: boolean; reduce: boolean }) {
  // 0 regular price, 1 struck through + rolling down, 2 settled with badge.
  const step = useStep(playing, 3, 1800, reduce ? 2 : 0);
  const [price, setPrice] = useState(reduce ? ALUMNI : FULL);

  useEffect(() => {
    if (reduce) return;
    if (step === 0) setPrice(FULL);
    if (step !== 1) return;
    const controls = animate(FULL, ALUMNI, { duration: 1.2, ease, onUpdate: setPrice });
    return () => controls.stop();
  }, [step, reduce]);

  const struck = step >= 1;
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[80%] max-w-sm md:w-[62%]">
        <Frame title="คลาสถัดไป" subtitle="ราคาพิเศษสำหรับศิษย์เก่า" mark="%">
          <div className="rounded-xl bg-neutral-50 px-3 py-3 ring-1 ring-black/5">
            <div className="flex items-baseline gap-3">
              <span className="relative text-sm text-foreground/40">
                {fmt(FULL)}
                <motion.span
                  initial={false}
                  animate={{ scaleX: struck ? 1 : 0 }}
                  transition={{ duration: 0.35, ease }}
                  style={{ transformOrigin: "0% 50%" }}
                  className="absolute top-1/2 left-0 h-px w-full bg-current"
                />
              </span>
              <span
                className="text-4xl font-semibold text-foreground tabular-nums transition-colors duration-300 md:text-5xl"
                style={{ color: struck ? "#ff6a13" : undefined }}
              >
                {fmt(struck ? price : FULL)}
              </span>
              <span className="text-sm text-foreground/50">บาท</span>
            </div>
          </div>
        </Frame>
        {/* Badge in the page's orange CTA finish. cta-mesh sets its own
            position, so it goes on an inner span. */}
        <motion.span
          initial={false}
          animate={step === 2 ? { opacity: 1, scale: 1, rotate: 8 } : { opacity: 0, scale: 0.6, rotate: 0 }}
          transition={spring}
          className="absolute -top-3 -right-3"
        >
          <span className="cta-mesh block rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-black">
            ศิษย์เก่า −{Math.round((1 - ALUMNI / FULL) * 100)}%
          </span>
        </motion.span>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CheckCircleIcon } from "@solar-icons/react/bold";
import { MeshGradient } from "@mesh-gradient/react";

import { cn } from "@/lib/utils";
import { MESH_COLORS } from "@/components/workshop/instructor-stack";

export type WhyLoopVariant = "stack" | "orbit" | "chat";

const ease = [0.16, 1, 0.3, 1] as const;
// Same animated backdrop as the instructor cards; a seed per card so the
// three patterns differ.
const meshSeed: Record<WhyLoopVariant, number> = { stack: 11, orbit: 12, chat: 13 };

// Looping illustration for the "why simple" cards. Each variant pauses while
// off-screen and renders a still final frame for reduced motion.
export function WhyLoop({ variant }: { variant: WhyLoopVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const reduce = useReducedMotion() ?? false;
  const playing = inView && !reduce;

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 isolate">
      <MeshGradient
        className="absolute inset-0 -z-10 size-full"
        options={{ colors: MESH_COLORS, seed: meshSeed[variant], animationSpeed: 0.8, isStatic: reduce }}
      />
      {variant === "stack" ? <Stack playing={playing} /> : null}
      {variant === "orbit" ? <Orbit playing={playing} /> : null}
      {variant === "chat" ? <Chat playing={playing} reduce={reduce} /> : null}
    </div>
  );
}

/* ── Stack: depth carousel of app screens, simple → full system ─────────── */

// Landing → sign in → dashboard → data → checkout. `url` is just a stable key.
const steps = [
  { url: "myshop.app", Screen: LandingScreen },
  { url: "myshop.app/login", Screen: SignInScreen },
  { url: "myshop.app/dashboard", Screen: DashboardScreen },
  { url: "myshop.app/orders", Screen: TableScreen },
  { url: "myshop.app/checkout", Screen: CheckoutScreen },
];

// Visible layers: front, middle, back. Further screens wait hidden behind
// the back layer. Back layers tilt away slightly for depth.
const layers = [
  { y: "0%", scale: 1, rotateX: 0, filter: "brightness(1)", opacity: 1 },
  { y: "-7%", scale: 0.93, rotateX: 3, filter: "brightness(0.94)", opacity: 1 },
  { y: "-14%", scale: 0.86, rotateX: 5, filter: "brightness(0.88)", opacity: 1 },
];
const hiddenLayer = { ...layers[2], opacity: 0 };
const spring = { type: "spring", stiffness: 220, damping: 26 } as const;

function Stack({ playing }: { playing: boolean }) {
  const [front, setFront] = useState(0);
  const n = steps.length;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setFront((f) => (f + 1) % n), 2600);
    return () => clearInterval(id);
  }, [playing, n]);

  return (
    // Sits slightly below centre: the back layers peek out above the front.
    <div
      style={{ perspective: 1200 }}
      className="absolute inset-x-[9%] top-[53%] aspect-[4/3] -translate-y-1/2"
    >
      {steps.map(({ url, Screen }, i) => {
        const depth = (i - front + n) % n;
        // The screen leaving the front slides off down-left with a tilt,
        // then rejoins the back of the pile unseen.
        const animate =
          depth === n - 1
            ? {
                x: ["0%", "-10%", "0%"],
                y: ["0%", "22%", hiddenLayer.y],
                rotate: [0, -5, 0],
                scale: [1, 0.96, hiddenLayer.scale],
                rotateX: 0,
                filter: hiddenLayer.filter,
                opacity: [1, 0, 0],
                transition: { duration: 0.8, times: [0, 0.55, 1], ease },
              }
            : { ...(layers[depth] ?? hiddenLayer), x: "0%", rotate: 0, transition: spring };
        return (
          <motion.div
            key={url}
            initial={false}
            animate={animate}
            style={{ zIndex: n - depth, transformOrigin: "50% 0%" }}
            className="absolute inset-0 overflow-hidden rounded-xl bg-white shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/5"
          >
            <div className="h-full p-3 text-[9px] text-foreground/70">
              <Screen />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

const Bar = ({ className }: { className?: string }) => (
  <span className={cn("block h-1.5 rounded-full bg-neutral-200", className)} />
);

function LandingScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 font-semibold text-foreground">
          <span className="size-2 rounded-full bg-[#ff6a13]" />
          MyShop
        </span>
        <span className="flex gap-2 text-foreground/40">
          <span>สินค้า</span>
          <span>เกี่ยวกับ</span>
          <span>ติดต่อ</span>
        </span>
      </div>
      <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
        <span className="text-[11px] font-semibold text-foreground">ร้านของคุณ ออนไลน์แล้ว</span>
        <Bar className="w-3/5" />
        <span className="mt-1 rounded-full bg-[#ff6a13] px-3 py-0.5 font-medium text-white">เริ่มสั่งซื้อ</span>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((k) => (
          <div key={k} className="rounded-md bg-neutral-100 p-1.5">
            <span className="mb-1 block size-2.5 rounded bg-[#ff6a13]/20" />
            <Bar className="w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SignInScreen() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-3/5 space-y-1.5">
        <p className="text-center text-[11px] font-semibold text-foreground">เข้าสู่ระบบ</p>
        {["อีเมล", "รหัสผ่าน"].map((l) => (
          <div key={l}>
            <p className="mb-0.5">{l}</p>
            <span className="block h-3.5 rounded-md bg-neutral-100 ring-1 ring-black/5" />
          </div>
        ))}
        <span className="block rounded-md bg-[#ff6a13] py-0.5 text-center font-medium text-white">เข้าสู่ระบบ</span>
        <span className="flex items-center justify-center gap-1 rounded-md py-0.5 ring-1 ring-black/10">
          <span className="size-2 rounded-full bg-[conic-gradient(#ea4335_0_25%,#fbbc05_0_50%,#34a853_0_75%,#4285f4_0)]" />
          Continue with Google
        </span>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="flex h-full gap-2">
      <div className="flex w-1/5 flex-col gap-1.5 rounded-md bg-neutral-100 p-1.5">
        <span className="h-1.5 rounded-full bg-[#ff6a13]" />
        <Bar />
        <Bar />
        <Bar />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex gap-1.5">
          <div className="flex-1 rounded-md bg-neutral-100 px-1.5 py-1">
            <p>ยอดขายวันนี้</p>
            <p className="text-[10px] font-semibold text-foreground">฿12,480</p>
          </div>
          <div className="flex-1 rounded-md bg-neutral-100 px-1.5 py-1">
            <p>เทียบเมื่อวาน</p>
            <p className="text-[10px] font-semibold text-[#16a34a]">+18%</p>
          </div>
        </div>
        <div className="flex flex-1 items-end gap-1 rounded-md bg-neutral-100 p-1.5">
          {[35, 55, 40, 70, 60, 85, 100].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={cn("flex-1 rounded-sm", i === 6 ? "bg-[#ff6a13]" : "bg-neutral-300")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TableScreen() {
  const rows = [
    { status: "ชำระแล้ว", cls: "bg-[#16a34a]/10 text-[#16a34a]" },
    { status: "รอส่ง", cls: "bg-[#ff6a13]/10 text-[#ff6a13]" },
    { status: "ชำระแล้ว", cls: "bg-[#16a34a]/10 text-[#16a34a]" },
    { status: "ร่าง", cls: "bg-neutral-100 text-foreground/45" },
  ];
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="h-3.5 flex-1 rounded-md bg-neutral-100 ring-1 ring-black/5" />
        <span className="rounded-md bg-[#ff6a13] px-1.5 py-0.5 font-medium text-white">+ เพิ่ม</span>
      </div>
      <div className="flex flex-1 flex-col justify-between rounded-md ring-1 ring-black/5">
        {rows.map((r, i) => (
          <div
            key={i}
            className={cn("flex items-center gap-1.5 px-1.5", i > 0 && "border-t border-black/5")}
          >
            <span className="size-2.5 rounded-full bg-neutral-200" />
            <Bar className="w-2/5" />
            <span className={cn("ml-auto rounded-full px-1.5 py-px text-[8px]", r.cls)}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutScreen() {
  return (
    <div className="flex h-full gap-2">
      <div className="flex flex-1 flex-col gap-1 rounded-md bg-neutral-100 p-1.5">
        <p className="font-semibold text-foreground">สรุปคำสั่งซื้อ</p>
        {["฿290", "฿450", "฿120"].map((p) => (
          <div key={p} className="flex items-center justify-between">
            <Bar className="w-1/2 bg-neutral-300" />
            <span>{p}</span>
          </div>
        ))}
        <div className="mt-auto flex justify-between border-t border-black/10 pt-1 font-semibold text-foreground">
          <span>รวม</span>
          <span>฿860</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <p>บัตรเครดิต</p>
        <span className="block h-3.5 rounded-md bg-neutral-100 ring-1 ring-black/5" />
        <div className="flex gap-1">
          <span className="block h-3.5 flex-1 rounded-md bg-neutral-100 ring-1 ring-black/5" />
          <span className="block h-3.5 flex-1 rounded-md bg-neutral-100 ring-1 ring-black/5" />
        </div>
        <span className="mt-auto block rounded-md bg-[#ff6a13] py-0.5 text-center font-medium text-white">
          ชำระเงิน ฿860
        </span>
        <p className="flex items-center justify-center gap-1 text-[#16a34a]">
          <CheckCircleIcon className="size-2.5" />
          ชำระเงินปลอดภัย
        </p>
      </div>
    </div>
  );
}

/* ── Orbit: dev-tool logos circling Claude ──────────────────────────────── */

// Brand SVGs from Simple Icons (cdn.simpleicons.org), saved in /public.
const logoBase = "/workshop/logos/";
const satellites = [
  { slug: "github", name: "GitHub" },
  { slug: "vercel", name: "Vercel" },
  { slug: "supabase", name: "Supabase" },
  { slug: "resend", name: "Resend" },
  { slug: "cloudflare", name: "Cloudflare" },
  { slug: "figma", name: "Figma" },
];

// One slow turn every 40s (keyframes `orbit-spin` live in the page's global
// styles). The ring spins; each tile counter-spins at the same rate so logos
// stay upright.
function Orbit({ playing }: { playing: boolean }) {
  const spin = {
    animation: "orbit-spin 40s linear infinite",
    animationPlayState: playing ? "running" : "paused",
  } as const;

  return (
    <>
      <div
        style={spin}
        className="absolute top-1/2 left-1/2 aspect-square w-[92%] -translate-1/2"
      >
        {satellites.map(({ slug }, i) => {
          const angle = (i / satellites.length) * 2 * Math.PI - Math.PI / 2;
          return (
            <div
              key={slug}
              style={{
                left: `${50 + 42 * Math.cos(angle)}%`,
                top: `${50 + 42 * Math.sin(angle)}%`,
              }}
              className="absolute w-[22%] -translate-1/2"
            >
              <div
                style={{ ...spin, animationDirection: "reverse" }}
                className="flex aspect-square items-center justify-center rounded-[28%] bg-white shadow-sm"
              >
                <img src={`${logoBase}${slug}.svg`} alt="" className="size-[46%]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Core */}
      <div className="absolute top-1/2 left-1/2 flex aspect-square w-[30%] -translate-1/2 items-center justify-center rounded-[28%] bg-[#D77655] shadow-md">
        <img src={`${logoBase}claude-cream.svg`} alt="" className="size-[62%]" />
      </div>
    </>
  );
}

/* ── Chat: prompts typed one after another, AI answers with the app ─────── */

type Turn = { ask: string; reply: string; App: () => React.ReactElement };

const turns: Turn[] = [
  {
    ask: "ช่วยสร้างระบบจองคิวสำหรับร้านของฉันหน่อย",
    reply: "ได้เลย! นี่คือหน้าจองคิวของร้านคุณ",
    App: BookingMock,
  },
  {
    ask: "เพิ่มแดชบอร์ดสรุปยอดขายรายวันด้วย",
    reply: "เสร็จแล้ว! แดชบอร์ดยอดขายวันนี้",
    App: DashboardMock,
  },
  {
    ask: "ทำฟอร์มสมัครสมาชิกให้ลูกค้าด้วย",
    reply: "เรียบร้อย! ฟอร์มสมัครพร้อมส่งอีเมลยืนยัน",
    App: SignupMock,
  },
];

// Split into grapheme clusters so Thai vowels / tone marks never render
// detached mid-typing.
const graphemes = (text: string) =>
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? [...new Intl.Segmenter("th", { granularity: "grapheme" }).segment(text)].map((s) => s.segment)
    : [...text];

// prompt: typing into the input · thinking: dots · reply: AI typing ·
// app: mockup shown, holding before the next prompt.
type Phase = "prompt" | "thinking" | "reply" | "app";

function Chat({ playing, reduce }: { playing: boolean; reduce: boolean }) {
  const [cycle, setCycle] = useState(0);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>(reduce ? "app" : "prompt");
  const [shown, setShown] = useState(0);

  const current = turns[turn];
  const askParts = useMemo(() => graphemes(current.ask), [current.ask]);
  const replyParts = useMemo(() => graphemes(current.reply), [current.reply]);

  useEffect(() => {
    if (reduce) {
      setPhase("app");
      return;
    }
    if (!playing) return;
    let t: ReturnType<typeof setTimeout>;
    const next = (p: Phase, delay: number) =>
      (t = setTimeout(() => {
        setShown(0);
        setPhase(p);
      }, delay));

    if (phase === "prompt") {
      if (shown < askParts.length) t = setTimeout(() => setShown((n) => n + 1), 45);
      else next("thinking", 450);
    } else if (phase === "thinking") next("reply", 900);
    else if (phase === "reply") {
      if (shown < replyParts.length) t = setTimeout(() => setShown((n) => n + 1), 30);
      else next("app", 250);
    } else {
      // Hold on the mockup, then the next prompt — or restart the thread.
      const last = turn === turns.length - 1;
      t = setTimeout(
        () => {
          setShown(0);
          setPhase("prompt");
          setTurn(last ? 0 : turn + 1);
          if (last) setCycle((c) => c + 1);
        },
        last ? 3000 : 1800,
      );
    }
    return () => clearTimeout(t);
  }, [phase, shown, turn, playing, reduce, askParts.length, replyParts.length]);

  const sent = phase !== "prompt";
  const replying = phase === "reply" || phase === "app";

  // Camera: zooms in only while a prompt is being typed, and pans with the
  // caret. The caret's position as a fraction of the stage is unaffected by
  // the stage's own scale, so it can be measured mid-zoom.
  const stageRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const [focus, setFocus] = useState({ x: 0.5, y: 0.9 });
  const typing = !reduce && phase === "prompt" && shown > 0;
  useEffect(() => {
    if (!typing || !stageRef.current || !caretRef.current) return;
    const stage = stageRef.current.getBoundingClientRect();
    const caret = caretRef.current.getBoundingClientRect();
    const x = (caret.left - stage.left) / stage.width;
    const y = (caret.top + caret.height / 2 - stage.top) / stage.height;
    setFocus({ x: Math.min(0.88, Math.max(0.12, x)), y });
  }, [typing, shown]);
  const camera = typing
    ? { scale: 1.8, originX: focus.x, originY: focus.y }
    : { scale: 1, originX: focus.x, originY: focus.y };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={cycle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, ...camera }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 0.4 },
          scale: { duration: 0.8, ease },
          originX: { duration: 0.35, ease: "easeOut" },
          originY: { duration: 0.35, ease: "easeOut" },
        }}
        ref={stageRef}
        className="absolute inset-0 flex flex-col gap-3 p-[7%]"
      >
        {/* Thread: bottom-anchored, older messages scroll off the top. */}
        <div className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%)]">
          <div className="flex flex-col gap-3">
            {turns.slice(0, turn).map((t) => (
              <Exchange key={t.ask} turn={t} />
            ))}
            {sent ? <UserBubble text={current.ask} animate={!reduce} /> : null}
            {phase === "thinking" ? (
              <motion.div layout className="py-1">
                <TypingDots />
              </motion.div>
            ) : null}
            {replying ? (
              <motion.div layout className="flex flex-col gap-2">
                <p className="text-sm leading-relaxed font-medium text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.45)]">
                  {phase === "reply" ? replyParts.slice(0, shown).join("") : current.reply}
                  {phase === "reply" ? <Caret /> : null}
                </p>
                {phase === "app" ? (
                  <motion.div
                    layout
                    initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease }}
                    className="origin-top-left"
                  >
                    <current.App />
                  </motion.div>
                ) : null}
              </motion.div>
            ) : null}
          </div>
        </div>

        {/* Prompt input */}
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-sm shadow-sm ring-1 ring-black/5">
          <p className="min-w-0 flex-1 truncate text-foreground/80">
            {phase === "prompt" && shown > 0 ? (
              <>
                {askParts.slice(0, shown).join("")}
                <Caret ref={caretRef} />
              </>
            ) : (
              <span className="text-foreground/35">พิมพ์สิ่งที่อยากสร้าง…</span>
            )}
          </p>
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-white transition-colors",
              phase === "prompt" && shown > 0 ? "bg-[#ff6a13]" : "bg-neutral-300",
            )}
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Exchange({ turn }: { turn: Turn }) {
  return (
    <motion.div layout className="flex flex-col gap-3">
      <UserBubble text={turn.ask} animate={false} />
      <p className="text-sm leading-relaxed font-medium text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.45)]">{turn.reply}</p>
      <turn.App />
    </motion.div>
  );
}

function UserBubble({ text, animate }: { text: string; animate: boolean }) {
  return (
    <motion.p
      layout
      initial={animate ? { opacity: 0, y: 16, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease }}
      className="ml-auto max-w-[85%] origin-bottom-right rounded-2xl rounded-br-md bg-black/45 px-3.5 py-2.5 text-sm leading-relaxed text-white ring-1 ring-white/10 backdrop-blur-md"
    >
      {text}
    </motion.p>
  );
}

function Caret({ ref }: { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <span ref={ref} className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-[#ff6a13]" />
  );
}

/* Mini app mockups — one per prompt. Styled as polished app cards: brand
   header with a live badge, real-looking content, orange accents. */

function MockFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white text-[10px] text-foreground/70 shadow-[0_12px_28px_-14px_rgb(0_0_0/0.35)] ring-1 ring-black/5">
      <div className="flex items-center gap-2 px-3 pt-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#ff9447] to-[#ff6a13] text-[10px] font-bold text-white shadow-sm">
          M
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[11px] font-semibold text-foreground">{title}</p>
          <p className="truncate text-foreground/45">{subtitle}</p>
        </div>
        <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#16a34a]/10 px-2 py-0.5 font-medium text-[#16a34a]">
          <span className="size-1.5 animate-pulse rounded-full bg-[#16a34a]" />
          Live
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function BookingMock() {
  const days = [
    { d: "จ", n: 12 },
    { d: "อ", n: 13 },
    { d: "พ", n: 14 },
    { d: "พฤ", n: 15 },
  ];
  const slots = [
    { t: "10:00" },
    { t: "11:00" },
    { t: "13:00", on: true },
    { t: "14:00" },
    { t: "15:00", full: true },
    { t: "16:00" },
  ];
  return (
    <MockFrame title="จองคิว · MyShop" subtitle="เลือกวันและเวลาที่สะดวก">
      <div className="grid grid-cols-4 gap-1.5">
        {days.map(({ d, n }) => (
          <span
            key={n}
            className={cn(
              "flex flex-col items-center rounded-xl py-1.5 leading-tight",
              n === 13 ? "bg-black text-white" : "bg-neutral-100",
            )}
          >
            <span className={n === 13 ? "text-white/60" : "text-foreground/40"}>{d}</span>
            <span className="text-[12px] font-semibold">{n}</span>
          </span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {slots.map(({ t, on, full }) => (
          <span
            key={t}
            className={cn(
              "rounded-lg py-1.5 text-center font-medium",
              on
                ? "bg-[#ff6a13]/10 text-[#ff6a13] ring-1 ring-[#ff6a13]"
                : full
                  ? "bg-neutral-50 text-foreground/25"
                  : "bg-white ring-1 ring-black/10",
            )}
          >
            {full ? "เต็ม" : t}
          </span>
        ))}
      </div>
      <span className="mt-2.5 flex items-center justify-center rounded-xl bg-linear-to-b from-[#ff8433] to-[#ff6a13] py-2 font-semibold text-white shadow-sm">
        ยืนยันการจอง · อ 13, 13:00
      </span>
    </MockFrame>
  );
}

function DashboardMock() {
  const points = [30, 42, 36, 55, 48, 66, 82];
  const w = 200;
  const h = 56;
  const xy = points.map((p, i) => [(i / (points.length - 1)) * w, h - (p / 100) * h]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <MockFrame title="แดชบอร์ดยอดขาย" subtitle="อัปเดตล่าสุด เมื่อสักครู่">
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-xl bg-neutral-50 p-2 ring-1 ring-black/5">
          <p className="text-foreground/45">ยอดขายวันนี้</p>
          <p className="mt-0.5 text-[14px] font-semibold text-foreground">฿12,480</p>
          <span className="mt-1 inline-block rounded-full bg-[#16a34a]/10 px-1.5 font-medium text-[#16a34a]">
            ▲ 18%
          </span>
        </div>
        <div className="rounded-xl bg-neutral-50 p-2 ring-1 ring-black/5">
          <p className="text-foreground/45">ออเดอร์</p>
          <p className="mt-0.5 text-[14px] font-semibold text-foreground">86</p>
          <span className="mt-1 inline-block rounded-full bg-[#ff6a13]/10 px-1.5 font-medium text-[#ff6a13]">
            12 รอส่ง
          </span>
        </div>
      </div>
      <div className="mt-2 rounded-xl bg-neutral-50 p-2 ring-1 ring-black/5">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sales-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#ff6a13" stopOpacity="0.28" />
              <stop offset="1" stopColor="#ff6a13" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#sales-fill)" />
          <path d={line} fill="none" stroke="#ff6a13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-1 flex justify-between text-foreground/35">
          {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

function SignupMock() {
  return (
    <MockFrame title="สมัครสมาชิก" subtitle="รับส่วนลด 10% สำหรับสมาชิกใหม่">
      <div className="space-y-1.5">
        {[
          { label: "ชื่อ-นามสกุล", value: "สมชาย ใจดี" },
          { label: "อีเมล", value: "somchai@email.com" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg px-2 py-1 ring-1 ring-black/10">
            <p className="text-[9px] text-foreground/40">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1.5">
        <span className="flex size-3 items-center justify-center rounded bg-[#ff6a13] text-[8px] text-white">✓</span>
        ยอมรับเงื่อนไขการใช้งาน
      </p>
      <span className="mt-2 flex items-center justify-center rounded-xl bg-linear-to-b from-[#ff8433] to-[#ff6a13] py-2 font-semibold text-white shadow-sm">
        สมัครสมาชิก
      </span>
      <p className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-[#16a34a]/10 py-1 font-medium text-[#16a34a]">
        <CheckCircleIcon className="size-3" />
        ส่งอีเมลยืนยันไปที่ somchai@email.com แล้ว
      </p>
    </MockFrame>
  );
}

function TypingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-white"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

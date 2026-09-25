import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AddCircleIcon, AltArrowDownIcon, AltArrowUpIcon, CheckCircleIcon } from "@solar-icons/react/bold";

import { cn } from "@/lib/utils";

export type AppScreen = "form" | "rules" | "dashboard" | "database" | "launch";
export type AppFeature = { screen: AppScreen; title: string; body: string };

const ease = [0.16, 1, 0.3, 1] as const;
const URL = "quote.yourbiz.com";

// Feature explorer: pill list on the left (the active pill morphs into a
// card with its description, arrows step through), app mockup on the right showing
// that feature's screen of an example quotation app.
// Controlled: the parent owns `active` (driven by scroll) and decides what a
// selection does (scroll to it, or just set it).
export function AppPreview({
  heading,
  features,
  active,
  onSelect,
}: {
  heading: string;
  features: AppFeature[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const n = features.length;
  const step = (d: number) => onSelect(Math.min(n - 1, Math.max(0, active + d)));
  const current = features[active];
  const fade = reduce ? { duration: 0 } : { duration: 0.35, ease };

  return (
    <div className="grid w-full items-center gap-6 md:h-full md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:items-stretch md:gap-10">
      {/* Left column: heading above the list. On mobile it dissolves
          (contents) so the order is heading → mockup → list. */}
      <div className="contents md:order-1 md:flex md:flex-col md:gap-8 md:self-center">
        {/* Indented past the arrow buttons so it lines up with the pills. */}
        <h2 className="order-1 text-2xl leading-snug md:pl-15 md:text-3xl lg:text-4xl">{heading}</h2>
        <div className="order-3 flex gap-3 md:gap-4">
          <div className="hidden flex-col justify-center gap-3 md:flex">
            <ArrowButton label="ก่อนหน้า" disabled={active === 0} onClick={() => step(-1)}>
              <AltArrowUpIcon className="size-5" />
            </ArrowButton>
            <ArrowButton label="ถัดไป" disabled={active === n - 1} onClick={() => step(1)}>
              <AltArrowDownIcon className="size-5" />
            </ArrowButton>
          </div>

          {/* A column of pills with the active one open. */}
          <ul className="flex min-w-0 flex-1 flex-col items-start gap-2 md:gap-3">
            {features.map((f, i) => {
              const open = i === active;
              return (
                // One surface that morphs: a pill when closed, a card with the
                // detail when open. The radius is constant (a pill at pill
                // height, rounded corners once taller) and set via style so
                // motion's layout animation keeps it undistorted while scaling.
                <motion.li
                  key={f.screen}
                  layout={!reduce}
                  transition={fade}
                  style={{ borderRadius: 26 }}
                  className={cn(
                    "overflow-hidden bg-white/10 transition-colors",
                    open ? "max-md:w-full md:w-full md:max-w-md" : "hover:bg-white/15",
                  )}
                >
                  <motion.button
                    layout={reduce ? false : "position"}
                    transition={fade}
                    type="button"
                    aria-expanded={open}
                    onClick={() => onSelect(i)}
                    className="flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm text-white md:px-5 md:py-3 md:text-lg"
                  >
                    {!open && <AddCircleIcon className="size-5 shrink-0 text-white/70 md:size-6" />}
                    <span className={cn(open && "font-medium")}>{f.title}</span>
                  </motion.button>
                  {open && (
                    <motion.p
                      layout={reduce ? false : "position"}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={reduce ? fade : { ...fade, delay: 0.12 }}
                      className="px-4 pb-4 text-sm leading-relaxed text-white/75 md:px-5 md:pb-5 md:text-base"
                    >
                      {f.body}
                    </motion.p>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Illustration only — the pills carry the content. */}
      <div aria-hidden className="order-2 md:min-h-0">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/10">
          <div className="relative aspect-[16/10] text-[10px] text-foreground/70 md:aspect-auto md:min-h-0 md:flex-1 md:text-sm">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.screen}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={fade}
                className="absolute inset-0 p-3 md:p-6"
              >
                <Screen screen={current.screen} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-default disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/* ── Example app screens: "QuickQuote", a quotation app ─────────────────── */

function Screen({ screen }: { screen: AppScreen }) {
  return (
    <div className="flex h-full gap-3">
      <aside className="hidden w-[22%] flex-col gap-1 rounded-xl bg-white p-2 sm:flex">
        <span className="mb-2 flex items-center gap-1.5 px-1.5 font-semibold text-foreground">
          <span className="flex size-5 items-center justify-center rounded-md bg-linear-to-br from-[#ff9447] to-[#ff6a13] text-[9px] font-bold text-white">
            Q
          </span>
          QuickQuote
        </span>
        {(
          [
            ["dashboard", "ภาพรวม"],
            ["form", "สร้างใบเสนอราคา"],
            ["database", "ลูกค้า"],
          ] as const
        ).map(([key, label]) => (
          <span
            key={key}
            className={cn(
              "truncate rounded-md px-1.5 py-1",
              (screen === key || (screen === "rules" && key === "form")) && "bg-[#ff6a13]/10 font-medium text-[#ff6a13]",
            )}
          >
            {label}
          </span>
        ))}
      </aside>
      <div className="min-w-0 flex-1 rounded-xl bg-white p-3 md:p-4">
        {screen === "form" && <FormScreen />}
        {screen === "rules" && <RulesScreen />}
        {screen === "dashboard" && <DashboardScreen />}
        {screen === "database" && <DatabaseScreen />}
        {screen === "launch" && <LaunchScreen />}
      </div>
    </div>
  );
}

const Title = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-[12px] font-semibold text-foreground md:text-xl">{children}</p>
);

function Field({ label, value, focus }: { label: string; value: string; focus?: boolean }) {
  return (
    <div>
      <p className="mb-1">{label}</p>
      <p
        className={cn(
          "truncate rounded-md bg-neutral-50 px-2 py-1.5 text-foreground ring-1 ring-black/10",
          focus && "ring-2 ring-[#ff6a13]/60",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function FormScreen() {
  return (
    <div className="flex h-full flex-col">
      <Title>สร้างใบเสนอราคาใหม่</Title>
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <Field label="ชื่อลูกค้า" value="บริษัท สยามเทรดดิ้ง" />
        <Field label="วันที่" value="31 ต.ค. 2569" />
        <Field label="สินค้า" value="กล่องกระดาษ A4" focus />
        <div className="grid grid-cols-2 gap-2">
          <Field label="จำนวน" value="20" />
          <Field label="ราคา/หน่วย" value="350" />
        </div>
      </div>
      <p className="mt-2 text-[#ff6a13]">+ เพิ่มรายการ</p>
      <span className="mt-auto self-end rounded-md bg-[#ff6a13] px-4 py-1.5 font-medium text-white">บันทึก</span>
    </div>
  );
}

function RulesScreen() {
  const rows = [
    ["กล่องกระดาษ A4", "20 × 350", "7,000.00"],
    ["เทปกาว OPP", "50 × 45", "2,250.00"],
  ];
  const sums: [string, string, string?][] = [
    ["รวม", "9,250.00"],
    ["ส่วนลดลูกค้าประจำ 10%", "−925.00", "text-[#16a34a]"],
    ["VAT 7%", "582.75"],
  ];
  return (
    <div className="flex h-full flex-col">
      <Title>ใบเสนอราคา #0142</Title>
      <div className="divide-y divide-black/5">
        {rows.map(([name, qty, total]) => (
          <div key={name} className="flex justify-between gap-2 py-1.5">
            <span className="truncate text-foreground">{name}</span>
            <span className="ml-auto text-foreground/45">{qty}</span>
            <span className="w-[22%] text-right text-foreground">{total}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-1 rounded-lg bg-neutral-50 p-2 md:p-3">
        {sums.map(([label, value, tone]) => (
          <p key={label} className={cn("flex justify-between", tone)}>
            <span>{label}</span>
            <span>{value}</span>
          </p>
        ))}
        <p className="flex justify-between border-t border-black/10 pt-1 text-[12px] font-semibold text-[#ff6a13] md:text-xl">
          <span>ยอดสุทธิ</span>
          <span>฿8,907.75</span>
        </p>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="flex h-full flex-col">
      <Title>ภาพรวมเดือนนี้</Title>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["ใบเสนอราคา", "24"],
          ["อนุมัติแล้ว", "18"],
          ["ยอดรวม", "฿186,400"],
        ].map(([label, value], i) => (
          <div key={label} className="rounded-lg bg-neutral-50 p-2">
            <p className="truncate">{label}</p>
            <p className={cn("truncate text-[12px] font-semibold md:text-xl", i === 2 ? "text-[#ff6a13]" : "text-foreground")}>
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-1 items-end gap-1.5 rounded-lg bg-neutral-50 p-2 md:gap-2">
        {[30, 45, 38, 60, 52, 75, 68, 90].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={cn("flex-1 rounded-sm", i === 7 ? "bg-[#ff6a13]" : "bg-neutral-300")}
          />
        ))}
      </div>
    </div>
  );
}

function DatabaseScreen() {
  const rows: [string, string, "อนุมัติ" | "รอตอบ" | "ร่าง"][] = [
    ["บริษัท สยามเทรดดิ้ง", "฿8,907.75", "อนุมัติ"],
    ["ร้านกาแฟบ้านสวน", "฿12,400.00", "รอตอบ"],
    ["คลินิกฟันดี", "฿35,000.00", "อนุมัติ"],
    ["โรงแรมริมน้ำ", "฿64,200.00", "ร่าง"],
  ];
  const tone = {
    อนุมัติ: "bg-[#16a34a]/10 text-[#16a34a]",
    รอตอบ: "bg-[#ff6a13]/10 text-[#ff6a13]",
    ร่าง: "bg-neutral-100 text-foreground/50",
  };
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[12px] font-semibold text-foreground md:text-xl">ลูกค้า</p>
        <span className="w-2/5 truncate rounded-md bg-neutral-50 px-2 py-1 text-foreground/40 ring-1 ring-black/10">ค้นหาลูกค้า…</span>
      </div>
      <div className="divide-y divide-black/5">
        {rows.map(([name, amount, status]) => (
          <div key={name} className="flex items-center gap-2 py-1.5 md:py-2">
            <span className="truncate text-foreground">{name}</span>
            <span className="ml-auto">{amount}</span>
            <span className={cn("w-14 shrink-0 rounded-full py-0.5 text-center", tone[status])}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LaunchScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-[#16a34a]/10 md:size-12">
        <CheckCircleIcon className="size-6 text-[#16a34a] md:size-7" />
      </span>
      <p className="text-[13px] font-semibold text-foreground md:text-lg">แอปของคุณออนไลน์แล้ว</p>
      <p className="rounded-md bg-neutral-50 px-3 py-1 text-foreground ring-1 ring-black/10">https://{URL}</p>
      <p>ส่งลิงก์ให้ทีมหรือลูกค้าใช้งานได้ทันที ทั้งบนคอมและมือถือ</p>
      <span className="mt-1 rounded-md bg-[#ff6a13] px-4 py-1.5 font-medium text-white">คัดลอกลิงก์</span>
    </div>
  );
}

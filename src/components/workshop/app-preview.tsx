import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AddCircleIcon,
  AltArrowDownIcon,
  AltArrowUpIcon,
  ArrowRightUpIcon,
  CheckCircleIcon,
  CopyIcon,
  DeliveryIcon,
  DocumentTextIcon,
  GlobalIcon,
  GraphUpIcon,
  LockKeyholeIcon,
  SettingsIcon,
  ShieldCheckIcon,
  TagPriceIcon,
  UsersGroupRoundedIcon,
  Widget5Icon,
} from "@solar-icons/react/bold";

import { cn } from "@/lib/utils";

export type AppScreen = "form" | "rules" | "dashboard" | "database" | "launch";
export type AppFeature = { screen: AppScreen; title: string; body: string };

const ease = [0.16, 1, 0.3, 1] as const;
const URL = "quote.yourbiz.com";

// Feature explorer: pill list on the left (the active pill morphs into a
// card with its description, arrows step through), app mockup on the right showing
// that feature's screen of an example quotation app.
// Controlled: the parent owns `active`; clicking a pill or an arrow selects.
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
          <BrowserBar screen={current.screen} />
          <div className="relative aspect-[4/3] text-[10px] text-foreground/70 md:aspect-auto md:min-h-0 md:flex-1 md:text-sm">
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

// Browser-bar path per screen, so the URL reads like a real app.
const PATHS: Record<AppScreen, string> = {
  form: "/quotes/new",
  rules: "/quotes/0142",
  dashboard: "/dashboard",
  database: "/customers",
  launch: "",
};

// Sidebar entry lit for each screen.
const NAV = [
  { key: "dashboard", label: "ภาพรวม", Icon: Widget5Icon },
  { key: "quotes", label: "ใบเสนอราคา", Icon: DocumentTextIcon },
  { key: "customers", label: "ลูกค้า", Icon: UsersGroupRoundedIcon },
  { key: "settings", label: "ตั้งค่า", Icon: SettingsIcon },
] as const;
const NAV_FOR: Record<AppScreen, (typeof NAV)[number]["key"]> = {
  form: "quotes",
  rules: "quotes",
  dashboard: "dashboard",
  database: "customers",
  launch: "dashboard",
};

const ORANGE = "#ff6a13";
const GREEN = "#16a34a";

// Staggered entrance for list items / cards inside a screen (screens remount
// on every switch, so these replay each time a tab is opened).
const rise = (i: number) => ({
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.08 + i * 0.05, ease },
});

function BrowserBar({ screen }: { screen: AppScreen }) {
  return (
    <div className="flex items-center gap-2 border-b border-black/5 bg-white px-3 py-2 md:gap-3 md:px-4 md:py-2.5">
      <span className="flex gap-1">
        <span className="size-2 rounded-full bg-[#ff5f57] md:size-2.5" />
        <span className="size-2 rounded-full bg-[#febc2e] md:size-2.5" />
        <span className="size-2 rounded-full bg-[#28c840] md:size-2.5" />
      </span>
      <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1 text-[9px] text-foreground/60 md:w-1/2 md:text-xs">
        <LockKeyholeIcon className="size-3 shrink-0 text-foreground/40" />
        <span className="truncate">
          {URL}
          <span className="text-foreground/35">{PATHS[screen]}</span>
        </span>
      </span>
      <span className="w-8 md:w-12" />
    </div>
  );
}

function Screen({ screen }: { screen: AppScreen }) {
  const lit = NAV_FOR[screen];
  return (
    <div className="flex h-full gap-2.5 md:gap-3">
      <aside className="hidden w-[21%] shrink-0 flex-col gap-0.5 rounded-xl bg-white p-2 sm:flex md:p-2.5">
        <span className="mb-3 flex items-center gap-1.5 px-1.5 pt-0.5 font-semibold text-foreground">
          <span className="flex size-5 items-center justify-center rounded-md bg-linear-to-br from-[#ff9447] to-[#ff6a13] text-[9px] font-bold text-white md:size-6 md:text-[11px]">
            Q
          </span>
          QuickQuote
        </span>
        {NAV.map(({ key, label, Icon }) => (
          <span
            key={key}
            className={cn(
              "flex items-center gap-1.5 truncate rounded-md px-1.5 py-1 md:py-1.5",
              lit === key ? "bg-[#ff6a13]/10 font-medium text-[#ff6a13]" : "text-foreground/55",
            )}
          >
            <Icon className="size-3.5 shrink-0 md:size-4" />
            {label}
          </span>
        ))}
        <span className="mt-auto flex items-center gap-1.5 rounded-md px-1.5 py-1 text-foreground/55">
          <span className="flex size-5 items-center justify-center rounded-full bg-neutral-800 text-[8px] text-white md:size-6 md:text-[10px]">
            ส
          </span>
          <span className="truncate">สมชาย</span>
        </span>
      </aside>
      <div className="min-w-0 flex-1 overflow-hidden rounded-xl bg-white p-3 md:p-5">
        {screen === "form" && <FormScreen />}
        {screen === "rules" && <RulesScreen />}
        {screen === "dashboard" && <DashboardScreen />}
        {screen === "database" && <DatabaseScreen />}
        {screen === "launch" && <LaunchScreen />}
      </div>
    </div>
  );
}

function Header({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-2 md:mb-4">
      <div className="min-w-0">
        <p className="truncate text-[12px] font-semibold text-foreground md:text-lg">{title}</p>
        {sub && <p className="truncate text-foreground/45 max-md:hidden">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

const TONES = {
  อนุมัติ: "bg-[#16a34a]/10 text-[#16a34a]",
  รอตอบ: "bg-[#ff6a13]/10 text-[#ff6a13]",
  ร่าง: "bg-neutral-100 text-foreground/50",
} as const;
type Status = keyof typeof TONES;

const Badge = ({ status }: { status: Status }) => (
  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-center", TONES[status])}>{status}</span>
);

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-1 text-foreground/50">{label}</p>
      <p className="truncate rounded-md bg-neutral-50 px-2 py-1.5 text-foreground ring-1 ring-black/10">{value}</p>
    </div>
  );
}

/* Form: a new quote being filled in; the last line item is mid-typing. */
function FormScreen() {
  const items = [
    ["กล่องกระดาษ A4", "20", "350", "7,000"],
    ["เทปกาว OPP", "50", "45", "2,250"],
  ];
  return (
    <div className="flex h-full flex-col">
      <Header title="สร้างใบเสนอราคาใหม่" sub="เลขที่ QT-0142">
        <Badge status="ร่าง" />
      </Header>
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <Field label="ลูกค้า" value="บริษัท สยามเทรดดิ้ง" className="max-md:col-span-2" />
        <Field label="ผู้ติดต่อ" value="คุณวิภา · 081-234-5678" className="max-md:hidden" />
        <Field label="วันที่" value="31 ต.ค. 2569" className="max-md:hidden" />
        <Field label="ยืนราคาถึง" value="30 พ.ย. 2569" className="max-md:hidden" />
      </div>

      <div className="mt-3 overflow-hidden rounded-lg ring-1 ring-black/10 md:mt-4">
        <div className="grid grid-cols-[1fr_12%_18%_18%] gap-2 bg-neutral-50 px-2.5 py-1.5 text-foreground/50">
          <span>รายการ</span>
          <span className="text-right">จำนวน</span>
          <span className="text-right">ราคา/หน่วย</span>
          <span className="text-right">รวม</span>
        </div>
        {items.map(([name, qty, price, total], i) => (
          <motion.div
            key={name}
            {...rise(i)}
            className="grid grid-cols-[1fr_12%_18%_18%] gap-2 border-t border-black/5 px-2.5 py-1.5 text-foreground"
          >
            <span className="truncate">{name}</span>
            <span className="text-right">{qty}</span>
            <span className="text-right">{price}</span>
            <span className="text-right">{total}</span>
          </motion.div>
        ))}
        <motion.div
          {...rise(2)}
          className="grid grid-cols-[1fr_12%_18%_18%] gap-2 border-t border-black/5 bg-[#ff6a13]/5 px-2.5 py-1.5 max-md:hidden"
        >
          <span className="flex items-center truncate text-foreground">
            บับเบิ้ลกันกระแทก
            <span className="ml-0.5 inline-block h-3 w-px animate-pulse bg-[#ff6a13] md:h-4" />
          </span>
          <span className="text-right text-foreground/30">0</span>
          <span className="text-right text-foreground/30">0</span>
          <span className="text-right text-foreground/30">–</span>
        </motion.div>
      </div>
      <p className="mt-2 text-[#ff6a13] max-md:hidden">+ เพิ่มรายการ</p>
      <div className="mt-3 max-md:hidden">
        <p className="mb-1 text-foreground/50">หมายเหตุ</p>
        <p className="rounded-md bg-neutral-50 px-2 py-1.5 text-foreground/70 ring-1 ring-black/10">
          จัดส่งภายใน 7 วันหลังยืนยัน · ชำระเงินภายใน 30 วัน
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-black/5 pt-2.5 md:pt-3">
        <p className="text-foreground/50">
          รวม <span className="font-semibold text-foreground">฿9,250.00</span>
        </p>
        <div className="flex gap-1.5 md:gap-2">
          <span className="rounded-md px-3 py-1.5 text-foreground/60 ring-1 ring-black/10 max-sm:hidden">บันทึกร่าง</span>
          <span className="rounded-md bg-[#ff6a13] px-3 py-1.5 font-medium text-white">ส่งใบเสนอราคา</span>
        </div>
      </div>
    </div>
  );
}

/* Rules: the quote's totals, with the business rules that produced them. */
function RulesScreen() {
  const rules = [
    { Icon: TagPriceIcon, title: "ลูกค้าประจำ", detail: "ส่วนลด 10% อัตโนมัติ" },
    { Icon: DeliveryIcon, title: "ยอดเกิน ฿5,000", detail: "ส่งฟรี" },
    { Icon: ShieldCheckIcon, title: "VAT 7%", detail: "คิดหลังหักส่วนลด" },
  ];
  const sums: [string, string, string?][] = [
    ["ยอดรวม", "9,250.00"],
    ["ส่วนลดลูกค้าประจำ 10%", "−925.00", "text-[#16a34a]"],
    ["ค่าส่ง", "ฟรี", "text-[#16a34a]"],
    ["VAT 7%", "582.75"],
  ];
  return (
    <div className="flex h-full flex-col">
      <Header title="ใบเสนอราคา QT-0142" sub="บริษัท สยามเทรดดิ้ง · ลูกค้าประจำ">
        <Badge status="รอตอบ" />
      </Header>
      <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[1fr_0.85fr] md:gap-4">
        <div className="hidden flex-col gap-1.5 sm:flex md:gap-2">
          <p className="text-foreground/50">กฎที่ระบบใช้กับใบนี้</p>
          {rules.map(({ Icon, title, detail }, i) => (
            <motion.div key={title} {...rise(i)} className="flex items-center gap-2 rounded-lg bg-neutral-50 p-2 ring-1 ring-black/5 md:p-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#ff6a13]/10 md:size-8">
                <Icon className="size-3.5 text-[#ff6a13] md:size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">{title}</span>
                <span className="block truncate text-foreground/50">{detail}</span>
              </span>
              <CheckCircleIcon className="size-4 shrink-0 md:size-5" style={{ color: GREEN }} />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col rounded-lg bg-neutral-50 p-2.5 md:p-4">
          <div className="mb-2 space-y-1 border-b border-black/10 pb-2 text-foreground md:space-y-1.5">
            {[
              ["กล่องกระดาษ A4 × 20", "7,000.00"],
              ["เทปกาว OPP × 50", "2,250.00"],
            ].map(([n, v]) => (
              <p key={n} className="flex justify-between gap-2">
                <span className="truncate">{n}</span>
                <span>{v}</span>
              </p>
            ))}
          </div>
          <div className="mt-auto space-y-1 md:space-y-1.5">
            {sums.map(([label, value, tone], i) => (
              <motion.p key={label} {...rise(i + 2)} className={cn("flex justify-between gap-2", tone)}>
                <span className="truncate">{label}</span>
                <span>{value}</span>
              </motion.p>
            ))}
          </div>
          <motion.p
            {...rise(6)}
            className="mt-2 flex items-baseline justify-between border-t border-black/10 pt-2 font-semibold text-[#ff6a13]"
          >
            <span>ยอดสุทธิ</span>
            <span className="text-[14px] md:text-2xl">฿8,907.75</span>
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/* Dashboard: KPIs with trend, monthly sales chart, top customers. */
function DashboardScreen() {
  const kpis = [
    ["ใบเสนอราคา", "24", "+12%"],
    ["อัตราปิดการขาย", "75%", "+8%"],
    ["ยอดขายเดือนนี้", "฿186,400", "+23%"],
  ];
  const months = ["มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค."];
  const bars = [34, 48, 41, 58, 52, 70, 64, 92];
  const top: [string, number][] = [
    ["โรงแรมริมน้ำ", 92],
    ["คลินิกฟันดี", 64],
    ["ร้านกาแฟบ้านสวน", 38],
    ["บริษัท สยามเทรดดิ้ง", 27],
    ["สตูดิโอโยคะใจดี", 14],
  ];
  return (
    <div className="flex h-full flex-col">
      <Header title="ภาพรวมเดือนตุลาคม" sub="อัปเดตล่าสุด 2 นาทีที่แล้ว" />
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {kpis.map(([label, value, delta], i) => (
          <motion.div key={label} {...rise(i)} className="rounded-lg bg-neutral-50 p-2 ring-1 ring-black/5 md:p-3">
            <p className="truncate text-foreground/50">{label}</p>
            <p className={cn("mt-0.5 truncate text-[12px] font-semibold md:text-xl", i === 2 ? "text-[#ff6a13]" : "text-foreground")}>
              {value}
            </p>
            <p className="mt-0.5 flex items-center gap-0.5 text-[#16a34a]">
              <ArrowRightUpIcon className="size-3" />
              {delta}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-2.5 grid min-h-0 flex-1 gap-2.5 md:mt-3 md:grid-cols-[1fr_32%] md:gap-3">
        <div className="flex min-h-20 flex-col rounded-lg bg-neutral-50 p-2 ring-1 ring-black/5 md:min-h-0 md:p-3">
          <p className="mb-2 flex items-center gap-1.5 text-foreground/50">
            <GraphUpIcon className="size-3.5 text-[#ff6a13]" />
            ยอดขายรายเดือน
          </p>
          <div className="relative flex min-h-0 flex-1 items-end gap-1 md:gap-2">
            {/* Gridlines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((g) => (
                <span key={g} className="border-t border-dashed border-black/5" />
              ))}
            </div>
            {bars.map((h, i) => (
              <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                {i === bars.length - 1 && (
                  <motion.span
                    {...rise(9)}
                    className="absolute left-1/2 -translate-x-1/2 rounded bg-foreground px-1 py-0.5 whitespace-nowrap text-white"
                    style={{ bottom: `calc(${h}% + 4px)` }}
                  >
                    ฿186k
                  </motion.span>
                )}
                <motion.span
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.04, ease }}
                  style={{ height: `${h}%`, transformOrigin: "bottom", background: i === bars.length - 1 ? ORANGE : undefined }}
                  className="rounded-t-sm bg-neutral-300"
                />
              </div>
            ))}
          </div>
          <div className="mt-1 flex gap-1 text-center text-foreground/40 md:gap-2">
            {months.map((m) => (
              <span key={m} className="flex-1 truncate">
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden flex-col gap-2 rounded-lg bg-neutral-50 p-3 ring-1 ring-black/5 md:flex">
          <p className="text-foreground/50">ลูกค้ายอดสูงสุด</p>
          {top.map(([name, pct], i) => (
            <motion.div key={name} {...rise(i + 3)}>
              <p className="flex justify-between gap-2 text-foreground">
                <span className="truncate">{name}</span>
                <span className="text-foreground/50">{pct}%</span>
              </p>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-black/5">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease }}
                  className="block h-full rounded-full bg-[#ff6a13]"
                />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Database: searchable, filterable customer list with status. */
function DatabaseScreen() {
  const rows: [string, string, string, Status, string][] = [
    ["บริษัท สยามเทรดดิ้ง", "QT-0142", "฿8,907.75", "รอตอบ", "#ff6a13"],
    ["ร้านกาแฟบ้านสวน", "QT-0141", "฿12,400.00", "อนุมัติ", "#0ea5e9"],
    ["คลินิกฟันดี", "QT-0139", "฿35,000.00", "อนุมัติ", "#8b5cf6"],
    ["โรงแรมริมน้ำ", "QT-0137", "฿64,200.00", "ร่าง", "#14b8a6"],
    ["สตูดิโอโยคะใจดี", "QT-0135", "฿4,800.00", "อนุมัติ", "#ec4899"],
    ["ร้านดอกไม้พิมพ์ใจ", "QT-0133", "฿2,650.00", "รอตอบ", "#f59e0b"],
    ["บริษัท ไทยแพ็คกิ้ง", "QT-0131", "฿41,300.00", "อนุมัติ", "#22c55e"],
  ];
  const filters: [string, string][] = [
    ["ทั้งหมด", "128"],
    ["อนุมัติ", "86"],
    ["รอตอบ", "27"],
    ["ร่าง", "15"],
  ];
  return (
    <div className="flex h-full flex-col">
      <Header title="ลูกค้า" sub="ทั้งหมด 128 ราย">
        <span className="flex w-2/5 items-center gap-1.5 truncate rounded-md bg-neutral-50 px-2 py-1 text-foreground/40 ring-1 ring-black/10">
          <svg viewBox="0 0 24 24" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          ค้นหาลูกค้า…
        </span>
      </Header>
      <div className="mb-2 flex gap-1.5 md:mb-3">
        {filters.map(([label, count], i) => (
          <span
            key={label}
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 md:px-2.5 md:py-1",
              i === 0 ? "bg-foreground text-white" : "bg-neutral-100 text-foreground/60",
            )}
          >
            {label}
            <span className={i === 0 ? "text-white/60" : "text-foreground/35"}>{count}</span>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_18%_22%_16%] gap-2 border-b border-black/5 pb-1.5 text-foreground/45 max-sm:grid-cols-[1fr_28%_20%]">
        <span>ลูกค้า</span>
        <span className="max-sm:hidden">ใบล่าสุด</span>
        <span className="text-right">ยอด</span>
        <span className="text-center">สถานะ</span>
      </div>
      <div className="divide-y divide-black/5">
        {rows.map(([name, quote, amount, status, color], i) => (
          <motion.div
            key={name}
            {...rise(i)}
            className={cn(
              "grid grid-cols-[1fr_18%_22%_16%] items-center gap-2 py-1.5 max-sm:grid-cols-[1fr_28%_20%] md:py-2",
              i >= 4 && "max-md:hidden",
            )}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold text-white md:size-6 md:text-[10px]"
                style={{ background: color }}
              >
                {name.replace(/^(บริษัท|ร้าน|คลินิก|โรงแรม|สตูดิโอ)\s*/, "").slice(0, 1)}
              </span>
              <span className="truncate text-foreground">{name}</span>
            </span>
            <span className="text-foreground/50 max-sm:hidden">{quote}</span>
            <span className="text-right text-foreground">{amount}</span>
            <span className="flex justify-center">
              <Badge status={status} />
            </span>
          </motion.div>
        ))}
      </div>
      <p className="mt-auto flex items-center justify-between pt-2 text-foreground/45 max-md:hidden">
        <span>แสดง 1–7 จาก 128</span>
        <span className="flex gap-1">
          <span className="rounded bg-foreground px-1.5 text-white">1</span>
          <span className="px-1.5">2</span>
          <span className="px-1.5">3</span>
        </span>
      </p>
    </div>
  );
}

/* Launch: deployed — checks passed, live URL to share, the app on a phone. */
function LaunchScreen() {
  const checks = ["Build แอป", "เชื่อมฐานข้อมูล", "ใบรับรอง HTTPS", "เปิดใช้งานออนไลน์"];
  return (
    <div className="flex h-full items-center gap-4 md:gap-8">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#16a34a]/10 px-2.5 py-1 font-medium text-[#16a34a]">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#16a34a] opacity-60" />
            <span className="relative size-2 rounded-full bg-[#16a34a]" />
          </span>
          Live
        </span>
        <p className="mt-2 text-[13px] font-semibold text-foreground md:text-2xl">แอปของคุณออนไลน์แล้ว</p>
        <p className="mt-1 text-foreground/50">ส่งลิงก์ให้ทีมหรือลูกค้าใช้งานได้ทันที ทั้งบนคอมและมือถือ</p>

        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-neutral-50 p-1.5 pl-2.5 ring-1 ring-black/10 md:mt-4">
          <GlobalIcon className="size-3.5 shrink-0 text-foreground/40 md:size-4" />
          <span className="min-w-0 flex-1 truncate font-medium text-foreground">https://{URL}</span>
          <span className="flex items-center gap-1 rounded-md bg-[#ff6a13] px-2.5 py-1 font-medium text-white">
            <CopyIcon className="size-3.5" />
            คัดลอก
          </span>
        </div>

        <div className="mt-3 space-y-1 md:mt-4 md:space-y-1.5">
          {checks.map((c, i) => (
            <motion.p key={c} {...rise(i)} className="flex items-center gap-1.5 text-foreground/70">
              <CheckCircleIcon className="size-3.5 shrink-0 md:size-4" style={{ color: GREEN }} />
              {c}
            </motion.p>
          ))}
        </div>
      </div>

      {/* The same app, on a phone. */}
      <motion.div
        initial={{ opacity: 0, y: 16, rotate: 4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        className="hidden w-[30%] max-w-44 shrink-0 rounded-[1.4rem] bg-foreground p-1.5 shadow-xl sm:block"
      >
        <div className="flex aspect-[9/17] flex-col gap-1.5 overflow-hidden rounded-[1.1rem] bg-neutral-50 p-2 text-[7px] md:text-[9px]">
          <span className="mx-auto mb-1 h-1 w-8 rounded-full bg-black/15" />
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <span className="flex size-3.5 items-center justify-center rounded bg-[#ff6a13] text-[6px] text-white">Q</span>
            QuickQuote
          </span>
          <span className="rounded-md bg-white p-1.5 ring-1 ring-black/5">
            <span className="block text-foreground/50">ยอดขายเดือนนี้</span>
            <span className="block text-[10px] font-semibold text-[#ff6a13] md:text-[13px]">฿186,400</span>
          </span>
          {[
            ["สยามเทรดดิ้ง", "รอตอบ"],
            ["บ้านสวน", "อนุมัติ"],
            ["ฟันดี", "อนุมัติ"],
          ].map(([n, st]) => (
            <span key={n} className="flex items-center justify-between rounded-md bg-white px-1.5 py-1 ring-1 ring-black/5">
              <span className="truncate text-foreground">{n}</span>
              <span className={cn("rounded-full px-1", TONES[st as Status])}>{st}</span>
            </span>
          ))}
          <span className="mt-auto rounded-md bg-[#ff6a13] py-1 text-center font-medium text-white">+ ใบเสนอราคาใหม่</span>
        </div>
      </motion.div>
    </div>
  );
}

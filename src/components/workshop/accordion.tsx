import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AddIcon, ChefHatIcon, TargetIcon } from "@solar-icons/react/linear";
import {
  BugIcon,
  CodeSquareIcon,
  CupStarIcon,
  LaptopMinimalisticIcon,
  LightbulbBoltIcon,
  RulerPenIcon,
  SettingsIcon,
} from "@solar-icons/react/bold";

import { cn } from "@/lib/utils";

// Items come from Astro as serializable props, so icons are referenced by
// name and resolved here.
const icons = {
  idea: LightbulbBoltIcon,
  target: TargetIcon,
  blueprint: RulerPenIcon,
  code: CodeSquareIcon,
  settings: SettingsIcon,
  bug: BugIcon,
  laptop: LaptopMinimalisticIcon,
  showcase: CupStarIcon,
  lunch: ChefHatIcon,
};

export type AccordionIconName = keyof typeof icons;

export type AccordionItem = {
  /** Optional leading icon (agenda rows, dividers). */
  icon?: AccordionIconName;
  title: string;
  /** Omit for a plain, non-expandable row. */
  body?: string;
  /** Small orange label above the title (agenda time slot). */
  label?: string;
  /** Render as a labelled divider (e.g. "Lunch Break") instead of a row. */
  divider?: boolean;
};

// Single-open accordion. "agenda" = rounded cards with a time label, first
// item open; "faq" = pill rows, all closed.
export function Accordion({
  items,
  variant = "agenda",
}: {
  items: AccordionItem[];
  variant?: "agenda" | "faq";
}) {
  const [open, setOpen] = useState<number | null>(
    variant === "agenda" ? 0 : null,
  );
  const baseId = useId();
  // Session numbers for the agenda (dividers like "Lunch Break" don't count).
  let session = 0;

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-${i}`;
        const Icon = item.icon ? icons[item.icon] : null;
        const number =
          variant === "agenda" && !item.divider
            ? String(++session)
            : null;

        if (item.divider) {
          return (
            <li
              key={item.title}
              className="flex items-center justify-center gap-2 py-2 text-lg font-medium text-foreground/50"
            >
              {Icon ? <Icon aria-hidden className="size-5" /> : null}
              {item.title}
            </li>
          );
        }

        const titleBlock = (
          <span className="flex items-start gap-4">
            {Icon ? (
              <Icon aria-hidden className="mt-0.5 size-7 shrink-0 text-[#ff6a13]" />
            ) : null}
            <span>
              {item.label ? (
                <span className="block text-sm text-[#ff6a13]">{item.label}</span>
              ) : null}
              <span
                className={cn("block text-lg md:text-xl", item.label && "mt-1.5")}
              >
                {number ? (
                  <span className="mr-2 text-foreground/35 tabular-nums">{number}</span>
                ) : null}
                {item.title}
              </span>
            </span>
          </span>
        );

        if (!item.body) {
          return (
            <li
              key={item.title}
              className={cn(
                "bg-neutral-100",
                variant === "agenda" ? "rounded-2xl p-5" : "rounded-[2rem] px-7 py-6",
              )}
            >
              {titleBlock}
            </li>
          );
        }

        return (
          <li
            key={item.title}
            className={cn(
              "bg-neutral-100 transition-colors hover:bg-neutral-200/70",
              variant === "agenda" ? "rounded-2xl" : "rounded-[2rem]",
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className={cn(
                "flex w-full items-start justify-between gap-6 text-left",
                variant === "agenda" ? "p-5" : "px-7 py-6",
              )}
            >
              {titleBlock}
              <AddIcon
                aria-hidden
                className={cn(
                  "mt-1 size-5 shrink-0 transition-transform duration-300",
                  isOpen && "rotate-45",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p
                    className={cn(
                      "leading-relaxed text-foreground/60",
                      variant === "agenda" ? "px-5 pb-5" : "px-7 pb-6",
                      Icon && "pl-16",
                    )}
                  >
                    {item.body}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

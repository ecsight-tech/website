import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { faqs, workshop } from "../data/content";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-bg-deep px-6 py-[120px] md:px-10 md:py-[160px]">
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-12 lg:grid-cols-[380px_1fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand md:text-base">
            FAQ
          </p>
          <h2 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[48px] lg:text-[56px]">
            คำถามที่พบบ่อย
          </h2>
          <p className="text-base text-ink-muted md:text-lg">
            มีคำถามเพิ่มเติม? ทักมาคุยกับเราได้เลย
          </p>
          <a
            href={workshop.contactHref}
            className="inline-flex w-fit items-center justify-center rounded-2xl bg-white/10 px-6 py-3 text-base md:text-lg font-semibold text-white transition-colors hover:bg-white/20"
          >
            สอบถามเพิ่มเติม <ArrowUpRight className="size-5 ml-4" />
          </a>
        </div>

        <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left transition-colors hover:text-brand md:py-8"
                >
                  <span className="text-lg font-semibold text-white md:text-xl">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-white md:size-12"
                  >
                    <Plus className="size-5" strokeWidth={2} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 pr-16 text-lg leading-relaxed text-ink-muted md:text-xl">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

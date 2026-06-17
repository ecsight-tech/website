import { FiImage } from "react-icons/fi";

import { FadeIn } from "@/components/motion-primitives";
import type { Messages } from "@/i18n/ui";

export function CTA({ email, t }: { email?: string; t: Messages["cta"] }) {
  return (
    <section id="contact" className="px-6 py-28">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
        <FadeIn className="h-full">
          <div className="flex h-full flex-col items-center aspect-4/5 justify-center rounded-4xl bg-primary px-10 text-center">
            <h2 className="max-w-sm text-balance font-heading text-5xl font-medium text-primary-foreground md:text-6xl">
              {t.heading}
            </h2>
            <p className="mt-8 whitespace-pre-line text-base text-primary-foreground/85 md:text-lg">
              {t.subtitle}
            </p>
            <a
              href={email ? `mailto:${email}` : "#contact"}
              className="mt-10 rounded-full bg-white px-7 py-3.5 text-base font-medium text-primary shadow-lg transition-transform duration-200 hover:scale-[1.03]"
            >
              {t.button}
            </a>
          </div>
        </FadeIn>

        <FadeIn className="h-full" delay={0.12}>
          <div
            className="relative flex h-full min-h-[480px] items-center justify-center overflow-hidden rounded-4xl bg-white/[0.05] md:min-h-[580px]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          >
            <FiImage className="size-24 text-white/15" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

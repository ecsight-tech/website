import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/motion-primitives";

export function CTA({ email }: { email?: string }) {
  const t = useTranslations("cta");
  return (
    <section id="contact" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-16 text-center md:py-24">
            <h2 className="mx-auto max-w-2xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              {t("heading")}
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-foreground/65">
              {t("subtitle")}
            </p>
            <a
              href={email ? `mailto:${email}` : "#"}
              className="mt-10 inline-flex rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              {t("button")}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

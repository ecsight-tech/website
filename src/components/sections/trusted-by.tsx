import { FadeIn } from "@/components/motion-primitives";
import type { Messages } from "@/i18n/ui";

export function TrustedBy({ t }: { t: Messages["trustedBy"] }) {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-center text-4xl tracking-tight md:text-5xl">
            {t.heading}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-14 overflow-hidden rounded-[2.5rem]">
            <img
              src="/trusted_company_logos.png"
              alt={t.alt}
              loading="lazy"
              className="h-auto w-full"
              sizes="(min-width: 1152px) 1152px, 100vw"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

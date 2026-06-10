import { useTranslations } from "next-intl";

import { FadeIn, Stagger, StaggerItem } from "@/components/motion-primitives";

type Service = {
  _id: string;
  title: string;
  summary?: string;
};

export function Services({ services }: { services?: Service[] }) {
  const t = useTranslations("services");
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-sm uppercase tracking-widest text-primary">{t("kicker")}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            {t("heading")}
          </h2>
        </FadeIn>

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <StaggerItem
              key={s._id}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <h3 className="font-heading text-lg font-medium">{s.title}</h3>
              {s.summary ? (
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                  {s.summary}
                </p>
              ) : null}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

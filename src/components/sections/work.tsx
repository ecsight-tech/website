import Image from "next/image";
import { useTranslations } from "next-intl";

import { FadeIn, Stagger, StaggerItem } from "@/components/motion-primitives";
import { urlFor } from "@/sanity/lib/image";

type Project = {
  _id: string;
  title: string;
  client?: string;
  category?: string;
  excerpt?: string;
  year?: number;
  coverImage?: Parameters<typeof urlFor>[0];
};

export function Work({ projects }: { projects?: Project[] }) {
  const t = useTranslations("work");
  if (!projects || projects.length === 0) return null;

  return (
    <section id="work" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-sm uppercase tracking-widest text-primary">{t("kicker")}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            {t("heading")}
          </h2>
        </FadeIn>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <StaggerItem
              key={p._id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                {p.coverImage ? (
                  <Image
                    src={urlFor(p.coverImage).width(1200).height(750).url()}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-foreground/30">
                    {p.category ?? "Project"}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-heading text-lg font-medium">{p.title}</h3>
                  <p className="mt-1 text-sm text-foreground/60">
                    {[p.client, p.category].filter(Boolean).join(" · ")}
                  </p>
                </div>
                {p.year ? (
                  <span className="text-sm text-foreground/40">{p.year}</span>
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

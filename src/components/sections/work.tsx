import { useState } from "react";
import { FiImage } from "react-icons/fi";

import { FadeIn } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import type { Messages } from "@/i18n/ui";
import { ProjectDialog, type ProjectDetail } from "./project-dialog";

export function Work({
  projects,
  t,
}: {
  projects?: ProjectDetail[];
  t: Messages["work"];
}) {
  const [selected, setSelected] = useState<ProjectDetail | null>(null);

  if (!projects || projects.length === 0) return null;

  return (
    <section id="work" className="px-6 py-28">
      <div className="grid w-full gap-16 lg:grid-cols-[1fr_3fr] max-w-7xl mx-auto">
        <div className="self-start lg:sticky lg:top-[calc(50%-10rem)]">
          <h2 className="text-4xl tracking-tight md:text-6xl">{t.heading}</h2>
          <Button href="#work" variant="primary" size="lg" className="mt-8">
            {t.viewAll}
          </Button>
        </div>

        <div className="flex flex-col gap-16">
          {projects.map((p) => (
            <FadeIn key={p._id}>
              <button
                type="button"
                onClick={() => setSelected(p)}
                aria-label={p.title}
                className="group grid w-full cursor-pointer items-center gap-12 text-left sm:grid-cols-[minmax(0,460px)_1fr]"
              >
                <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-4xl bg-white/[0.07]">
                  {p.coverImage ? (
                    <img
                      src={urlFor(p.coverImage).width(640).height(854).url()}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <FiImage className="size-24 text-white opacity-10" />
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-4xl font-medium transition-colors group-hover:text-primary md:text-5xl">
                    {p.title}
                  </h3>
                  {p.subtitle ? (
                    <p className="mt-4 whitespace-pre-line text-2xl text-foreground/90 md:text-xl">
                      {p.subtitle}
                    </p>
                  ) : null}
                  {p.excerpt ? (
                    <p className="mt-6 max-w-lg whitespace-pre-line text-xl leading-relaxed text-foreground/55">
                      {p.excerpt}
                    </p>
                  ) : null}
                </div>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>

      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

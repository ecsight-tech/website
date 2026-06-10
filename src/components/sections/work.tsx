import Image from "next/image";
import { useTranslations } from "next-intl";
import { FiImage } from "react-icons/fi";

import { FadeIn } from "@/components/motion-primitives";
import { urlFor } from "@/sanity/lib/image";

type Project = {
  _id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  coverImage?: Parameters<typeof urlFor>[0];
};

export function Work({ projects }: { projects?: Project[] }) {
  const t = useTranslations("work");
  if (!projects || projects.length === 0) return null;

  return (
    <section id="work" className="px-6 py-28">
      <div className="grid w-full gap-16 lg:grid-cols-[1fr_3fr]">
        <div className="self-start lg:sticky lg:top-[calc(50%-4rem)]">
          <h2 className="text-4xl font-medium tracking-tight md:text-6xl">
            {t("heading")}
          </h2>
          <a
            href="#work"
            className="mt-8 inline-block rounded-full bg-linear-to-br from-10% from-[#195EDD] to-primary px-8 py-4 text-xl tracking-wide font-medium text-primary-foreground shadow-lg shadow-primary/30 inset-shadow-[0_1px_0_rgb(255_255_255/0.25)] hover:scale-105 transition-all duration-300 hover:opacity-90"
          >
            {t("viewAll")}
          </a>
        </div>

        <div className="flex flex-col gap-16">
          {projects.map((p) => (
            <FadeIn key={p._id}>
              <article className="grid items-center gap-12 sm:grid-cols-[minmax(0,460px)_1fr]">
                <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-4xl bg-white/[0.07]">
                  {p.coverImage ? (
                    <Image
                      src={urlFor(p.coverImage).width(640).height(854).url()}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <FiImage className="size-24 text-white opacity-10" />
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-4xl font-medium md:text-5xl">
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
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

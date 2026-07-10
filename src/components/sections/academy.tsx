import { FiImage } from "react-icons/fi";

import BorderGlow from "@/components/BorderGlow";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion-primitives";
import { urlFor } from "@/sanity/lib/image";

type AcademyItem = {
  _id: string;
  title: string;
  summary?: string;
  category?: string;
  targetAudience?: string[];
  image?: (Parameters<typeof urlFor>[0] & { alt?: string }) | null;
};

export function Academy({
  items,
  heading,
}: {
  items?: AcademyItem[];
  heading: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <section id="academy" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="text-center text-4xl tracking-tight md:text-6xl">
            {heading}
          </h2>
        </FadeIn>

        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {items.map((item) => (
            <StaggerItem
              key={item._id}
              className="group flex flex-col transition-transform duration-300 hover:-translate-y-1.5"
            >
              <BorderGlow
                className="flex-1 border-white/6"
                borderRadius={32}
                backgroundColor="color-mix(in oklab, white 3%, var(--background))"
                glowColor="227 85 65"
                colors={["#1f44e8", "#38bdf8", "#c084fc"]}
              >
                <div className="relative aspect-video overflow-hidden bg-linear-to-b from-white/4 to-[#16246e]">
                  {item.image ? (
                    <img
                      src={urlFor(item.image).width(800).height(450).url()}
                      alt={item.image.alt ?? item.title}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <FiImage className="size-12 text-white/10" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5 sm:p-7">
                  {item.category ? (
                    <span className="w-fit text-sm font-medium uppercase tracking-wide text-white/70">
                      {item.category}
                    </span>
                  ) : null}
                  <h3 className="font-heading text-2xl md:text-3xl">
                    {item.title}
                  </h3>
                  {item.summary ? (
                    <p className="leading-relaxed text-white/60 line-clamp-2">
                      {item.summary}
                    </p>
                  ) : null}
                  {item.targetAudience && item.targetAudience.length > 0 ? (
                    <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                      {item.targetAudience.map((audience) => (
                        <li
                          key={audience}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70"
                        >
                          {audience}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </BorderGlow>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

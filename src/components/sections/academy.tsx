import { FiImage } from "react-icons/fi";

import { FadeIn, Stagger, StaggerItem } from "@/components/motion-primitives";
import { urlFor } from "@/sanity/lib/image";

type AcademyItem = {
  _id: string;
  title: string;
  summary?: string;
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
    <section id="academy" className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="text-center text-4xl tracking-tight md:text-6xl">
            {heading}
          </h2>
        </FadeIn>

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <StaggerItem
              key={item._id}
              className="group flex flex-col overflow-hidden rounded-4xl border border-white/6 bg-white/3 transition-transform duration-300 hover:-translate-y-1.5"
            >
              <div className="relative aspect-video overflow-hidden bg-linear-to-b from-white/4 to-[#16246e]">
                {item.image ? (
                  <img
                    src={urlFor(item.image).width(800).height(450).url()}
                    alt={item.image.alt ?? item.title}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <FiImage className="size-12 text-white/10" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-7">
                <h3 className="font-heading text-2xl md:text-3xl">
                  {item.title}
                </h3>
                {item.summary ? (
                  <p className="text-sm leading-relaxed text-white/60">
                    {item.summary}
                  </p>
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

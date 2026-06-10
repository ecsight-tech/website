"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useTranslations } from "next-intl";
import { FiImage } from "react-icons/fi";

import { FadeIn } from "@/components/motion-primitives";
import { urlFor } from "@/sanity/lib/image";

type ShowcaseItem = {
  _id: string;
  title: string;
  url?: string;
  videoUrl?: string;
  poster?: Parameters<typeof urlFor>[0];
};

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  const inner = (
    <div className="relative flex h-[440px] w-[340px] shrink-0 items-center justify-center overflow-hidden rounded-4xl bg-white/[0.06] md:h-[520px] md:w-[400px]">
      {item.videoUrl ? (
        <video
          src={item.videoUrl}
          poster={
            item.poster ? urlFor(item.poster).width(800).url() : undefined
          }
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 size-full object-cover"
        />
      ) : item.poster ? (
        <Image
          src={urlFor(item.poster).width(800).height(1040).url()}
          alt={item.title}
          fill
          className="object-cover"
        />
      ) : (
        <FiImage className="size-20 text-white/15" />
      )}
    </div>
  );

  return item.url ? (
    <a href={item.url} target="_blank" rel="noreferrer" aria-label={item.title}>
      {inner}
    </a>
  ) : (
    inner
  );
}

export function ContentShowcase({ items }: { items?: ShowcaseItem[] }) {
  const t = useTranslations("showcase");
  if (!items || items.length === 0) return null;

  return (
    <section id="content" className="overflow-hidden py-28">
      <FadeIn>
        <h2 className="px-6 text-center text-4xl tracking-tight md:text-6xl">
          {t("heading")}
        </h2>
      </FadeIn>

      <div className="mt-16">
        <Marquee speed={60} pauseOnHover autoFill>
          {items.map((item) => (
            <div key={item._id} className="mr-4">
              <ShowcaseCard item={item} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

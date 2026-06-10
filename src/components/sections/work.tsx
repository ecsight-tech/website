import Image from "next/image";

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

const fallback: Project[] = [
  { _id: "p1", title: "Aurora rebrand", client: "Aurora", category: "Branding", year: 2025 },
  { _id: "p2", title: "Northwind commerce", client: "Northwind", category: "Web", year: 2025 },
  { _id: "p3", title: "Lumen product suite", client: "Lumen", category: "Product", year: 2024 },
];

export function Work({ projects }: { projects?: Project[] }) {
  const items = projects && projects.length > 0 ? projects : fallback;
  return (
    <section id="work" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-sm uppercase tracking-widest text-primary">Selected work</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            Recent projects
          </h2>
        </FadeIn>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((p) => (
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
                  <h3 className="text-lg font-medium">{p.title}</h3>
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

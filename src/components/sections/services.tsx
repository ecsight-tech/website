import { FadeIn, Stagger, StaggerItem } from "@/components/motion-primitives";

type Service = {
  _id: string;
  title: string;
  summary?: string;
};

const fallback: Service[] = [
  { _id: "f1", title: "Brand Strategy", summary: "Positioning, identity, and narrative that sets you apart." },
  { _id: "f2", title: "Web & Product", summary: "High-craft websites and product interfaces that convert." },
  { _id: "f3", title: "Design Systems", summary: "Scalable component libraries and visual language." },
  { _id: "f4", title: "Growth & Marketing", summary: "Campaigns and content that compound over time." },
];

export function Services({ services }: { services?: Service[] }) {
  const items = services && services.length > 0 ? services : fallback;
  return (
    <section id="services" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-sm uppercase tracking-widest text-primary">What we do</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            Services built for momentum
          </h2>
        </FadeIn>

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s) => (
            <StaggerItem
              key={s._id}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <h3 className="text-lg font-medium">{s.title}</h3>
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

import { FadeIn } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import type { Messages } from "@/i18n/ui";
import { LogoMark } from "@/components/site/logo";

// Same gallery source as the hero's panorama slider.
const IMAGES = [
  "/gallery/gallery-1.jpg",
  "/gallery/gallery-2.jpg",
  "/gallery/gallery-3.jpg",
  "/gallery/gallery-4.jpg",
  "/gallery/gallery-5.jpg",
  "/gallery/gallery-6.png",
  "/gallery/gallery-7.jpg",
  "/gallery/gallery-8.jpg",
];

// The reference is a row of equal-width columns, each holding one or two
// stacked portrait cards. Per-column vertical offsets create the wavy arc:
// inner columns peak highest, outer/odd columns drop lower. Rendered as a
// centered flex grid on lg+; hidden on small screens (text only).
type Column = {
  offset: string; // translate-y class — larger = pushed further down
  count: 1 | 2;
};

const COLUMNS: Column[] = [
  { offset: "translate-y-[64px]", count: 2 }, // far-left stack
  { offset: "translate-y-[0px]", count: 2 }, // peaks early
  { offset: "translate-y-[64px]", count: 1 }, // dips low
  { offset: "translate-y-[0px]", count: 1 }, // center-left peak (highest)
  { offset: "translate-y-[64px]", count: 1 }, // center
  { offset: "translate-y-[0px]", count: 1 }, // center-right
  { offset: "translate-y-[64px]", count: 1 }, // low fill
  { offset: "translate-y-[0px]", count: 2 }, // right
  { offset: "translate-y-[64px]", count: 2 }, // far-right stack
];

function PortraitCard({ src, delay }: { src: string; delay: number }) {
  return (
    <FadeIn
      delay={delay}
      className="aspect-3/4 w-full overflow-hidden rounded-xl bg-foreground/6 shadow-sm ring-1 ring-black/5"
    >
      <img src={src} alt="" loading="lazy" className="size-full object-cover" />
    </FadeIn>
  );
}

export function CTA({ email, t }: { email?: string; t: Messages["cta"] }) {
  return (
    <section id="contact" className="overflow-hidden px-6 pb-28 pt-16">
      <div className="relative mx-auto min-h-[520px] max-w-full">
        {/* card grid layer */}
        <div className="absolute inset-x-0 top-0 hidden items-start justify-center gap-3 lg:flex">
          {COLUMNS.map((col, c) => {
            const start = COLUMNS.slice(0, c).reduce((n, x) => n + x.count, 0);
            return (
              <div
                key={c}
                className={`flex w-full flex-col gap-3 ${col.offset}`}
              >
                {Array.from({ length: col.count }).map((_, r) => (
                  <PortraitCard
                    key={r}
                    src={IMAGES[(start + r) % IMAGES.length]}
                    delay={c * 0.05 + r * 0.05}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* text layer (overlaps the grid) */}
        <FadeIn className="relative z-10 flex flex-col items-center pt-12 text-center lg:pt-110">
          {/* {t.eyebrow ? (
            <span className="mb-6 rounded-full bg-black/5 px-4 py-1.5 text-sm font-medium text-foreground/70">
              {t.eyebrow}
            </span>
          ) : null} */}
          {/* <LogoMark className="size-20 mb-8" /> */}

          <h2 className="max-w-2xl text-balance font-heading text-5xl tracking-tight text-foreground md:text-6xl">
            {t.heading}
          </h2>

          <p className="mt-6 max-w-md whitespace-pre-line text-base text-foreground/55 md:text-lg">
            {t.subtitle}
          </p>

          <Button
            href={email ? `mailto:${email}` : "#contact"}
            variant="primary"
            size="md"
            className="mt-10"
          >
            {t.button}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

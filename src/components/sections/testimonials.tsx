import { FadeIn } from "@/components/motion-primitives";

type Testimonial = {
  _id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
};

export function Testimonials({ items }: { items?: Testimonial[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-4xl text-center">
        <FadeIn>
          <blockquote className="text-balance text-2xl font-medium leading-snug tracking-tight md:text-4xl">
            &ldquo;{items[0].quote}&rdquo;
          </blockquote>
          <figcaption className="mt-8 text-sm text-foreground/60">
            {items[0].author}
            {items[0].company ? `, ${items[0].company}` : ""}
          </figcaption>
        </FadeIn>
      </div>
    </section>
  );
}

import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 leading-relaxed text-foreground/70">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 text-2xl tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="mt-8 text-xl">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-6 text-lg">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l border-white/20 pl-4 leading-relaxed text-foreground/60 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-foreground/70">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-6 leading-relaxed text-foreground/70">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="underline underline-offset-2 transition-colors hover:text-foreground"
      >
        {children}
      </a>
    ),
  },
};

export function PortableBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}

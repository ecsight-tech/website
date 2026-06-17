import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { FiX, FiArrowUpRight } from "react-icons/fi";

import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";

export type ProjectDetail = {
  _id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  client?: string;
  category?: string;
  year?: number;
  url?: string;
  services?: string[];
  body?: PortableTextBlock[];
  coverImage?: Parameters<typeof urlFor>[0];
  gallery?: (Parameters<typeof urlFor>[0] & { _key: string })[];
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export function ProjectDialog({
  project,
  onClose,
}: {
  project: ProjectDetail | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  // Island is still SSR'd into static HTML; portal needs a real DOM
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-4xl bg-neutral-950 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-5 top-5 z-10 flex size-10 items-center justify-center rounded-full bg-black/40 text-foreground/80 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-foreground"
            >
              <FiX className="size-5" />
            </button>

            <div
              data-lenis-prevent
              className="overflow-y-auto overscroll-contain"
            >
            {project.coverImage ? (
              <div className="relative aspect-16/10 w-full overflow-hidden">
                <img
                  src={urlFor(project.coverImage).width(1200).height(750).url()}
                  alt={project.title}
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent" />
              </div>
            ) : null}

            <div className="px-8 pb-10 pt-6 md:px-10">
              {project.category ? (
                <span className="text-sm uppercase tracking-widest text-primary">
                  {project.category}
                </span>
              ) : null}
              <h3 className="mt-2 font-heading text-4xl font-medium md:text-5xl">
                {project.title}
              </h3>
              {project.subtitle ? (
                <p className="mt-3 whitespace-pre-line text-xl text-foreground/80">
                  {project.subtitle}
                </p>
              ) : null}

              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-white/10 py-6 sm:grid-cols-3">
                {project.client ? (
                  <Meta label="Client" value={project.client} />
                ) : null}
                {project.year ? (
                  <Meta label="Year" value={String(project.year)} />
                ) : null}
                {project.services && project.services.length > 0 ? (
                  <Meta label="Services" value={project.services.join(", ")} />
                ) : null}
              </dl>

              {project.excerpt ? (
                <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-foreground/70">
                  {project.excerpt}
                </p>
              ) : null}

              {project.body && project.body.length > 0 ? (
                <div className="prose prose-invert mt-6 max-w-none text-foreground/70">
                  <PortableText value={project.body} />
                </div>
              ) : null}

              {project.gallery && project.gallery.length > 0 ? (
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {project.gallery.map((img) => (
                    <img
                      key={img._key}
                      src={urlFor(img).width(800).height(600).url()}
                      alt={project.title}
                      loading="lazy"
                      className="aspect-4/3 w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              ) : null}

              {project.url ? (
                <Button
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  variant="primary"
                  size="md"
                  className="mt-9"
                >
                  Visit project
                  <FiArrowUpRight className="size-4" />
                </Button>
              ) : null}
            </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-foreground/45">{label}</dt>
      <dd className="mt-1 text-base text-foreground/90">{value}</dd>
    </div>
  );
}

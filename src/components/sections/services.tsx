import { useTranslations } from "next-intl";
import { FiImage } from "react-icons/fi";

import { FadeIn, Stagger, StaggerItem } from "@/components/motion-primitives";

type Service = {
  _id: string;
  title: string;
  summary?: string;
};

export function Services({ services }: { services?: Service[] }) {
  const t = useTranslations("services");
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="text-center text-4xl tracking-tight md:text-6xl">
            {t("heading")}
          </h2>
        </FadeIn>

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem
              key={s._id}
              className="group relative flex aspect-3/4 flex-col overflow-hidden rounded-4xl bg-linear-to-b from-white/[0.04] from-35% to-[#16246e] transition-transform duration-300 hover:-translate-y-1.5"
            >
              <div className="flex flex-1 items-center justify-center">
                <FiImage className="size-16 text-white/10" />
              </div>
              <h3 className="pb-12 text-center font-heading text-3xl md:text-[2.5rem]">
                {s.title}
              </h3>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

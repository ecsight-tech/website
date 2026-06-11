import Image from "next/image";
import { useTranslations } from "next-intl";

import { FadeIn } from "@/components/motion-primitives";
import logos from "../../../public/trusted_company_logos.png";

export function TrustedBy() {
  const t = useTranslations("trustedBy");
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-center text-4xl tracking-tight md:text-5xl">
            {t("heading")}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-14 overflow-hidden rounded-[2.5rem]">
            <Image
              src={logos}
              alt={t("alt")}
              className="h-auto w-full"
              sizes="(min-width: 1152px) 1152px, 100vw"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

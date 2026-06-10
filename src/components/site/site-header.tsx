"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function SiteHeader({ brand = "ecsight" }: { brand?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const nav = [
    { href: "#services", label: t("services") },
    { href: "#work", label: t("work") },
    { href: "#about", label: t("about") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
          {brand}
          <span className="text-primary">.</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs uppercase">
            {routing.locales.map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                className={
                  l === locale
                    ? "rounded-full bg-white/10 px-2.5 py-1 font-medium text-foreground"
                    : "rounded-full px-2.5 py-1 text-foreground/50 transition-colors hover:text-foreground"
                }
              >
                {l}
              </Link>
            ))}
          </div>
          <a
            href="#contact"
            className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:block"
          >
            {t("startProject")}
          </a>
        </div>
      </div>
    </motion.header>
  );
}

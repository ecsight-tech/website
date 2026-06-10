"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { FiMail, FiPhone } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLine,
  FaSpotify,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LogoInline } from "./logo";

const socialIcons: Record<string, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  line: FaLine,
  spotify: FaSpotify,
};

export type HeaderSettings = {
  title?: string;
  email?: string;
  phone?: string;
  socials?: { _key: string; platform?: string; url?: string }[];
};

export function SiteHeader({ settings }: { settings?: HeaderSettings }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const nav = [
    { href: "#about", label: t("about") },
    { href: "#services", label: t("services") },
    { href: "#work", label: t("content") },
  ];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky -top-9 z-50"
    >
      <div className="border-b border-white/10 bg-background text-xs text-foreground/80">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-5 overflow-hidden whitespace-nowrap">
            {settings?.title ? <span>{settings.title}</span> : null}
            {settings?.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="hidden items-center gap-1.5 transition-colors hover:text-foreground sm:flex"
              >
                <FiMail className="size-3.5" />
                {settings.email}
              </a>
            ) : null}
            {settings?.phone ? (
              <span className="hidden items-center gap-1.5 md:flex">
                <FiPhone className="size-3.5" />
                {settings.phone}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {settings?.socials?.map((s) => {
              const Icon = s.platform
                ? socialIcons[s.platform.toLowerCase()]
                : undefined;
              if (!Icon || !s.url) return null;
              return (
                <a
                  key={s._key}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.platform}
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <LogoInline className="h-7" />
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm text-foreground/80 transition-colors hover:text-foreground"
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
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:block"
            >
              {t("cta")}
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

import en from "../../messages/en.json";
import th from "../../messages/th.json";

export const locales = ["en", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Messages = typeof en;

const messages: Record<Locale, Messages> = { en, th };

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

/** Root path for a locale ("/" for default, "/th/" otherwise). */
export function localeHref(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}/`;
}

/** Same page in another locale — swaps the locale prefix, keeps the rest of the path. */
export function switchLocaleHref(target: Locale, currentPath: string): string {
  let path = currentPath;
  for (const l of locales) {
    if (l === defaultLocale) continue;
    if (path === `/${l}` || path.startsWith(`/${l}/`)) {
      path = path.slice(l.length + 1) || "/";
      break;
    }
  }
  if (target === defaultLocale) return path;
  return path === "/" ? `/${target}/` : `/${target}${path}`;
}

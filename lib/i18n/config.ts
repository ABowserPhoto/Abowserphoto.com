export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isLocale(segment) ? segment : null;
}

export function stripLocaleFromPathname(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && isLocale(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function withLocale(pathname: string, locale: Locale) {
  const clean = stripLocaleFromPathname(pathname);
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

export function detectLocaleFromHeader(header: string | null): Locale {
  if (!header) return defaultLocale;
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, qValue] = part.trim().split(";q=");
      return {
        tag: (tag ?? "").toLowerCase(),
        q: qValue ? Number(qValue) : 1,
      };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);

  for (const entry of preferred) {
    if (entry.tag.startsWith("de")) return "de";
    if (entry.tag.startsWith("en")) return "en";
  }

  return defaultLocale;
}

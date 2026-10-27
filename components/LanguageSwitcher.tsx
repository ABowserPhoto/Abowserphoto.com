"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  locales,
  stripLocaleFromPathname,
  withLocale,
  type Locale,
} from "../lib/i18n/config";
import { useLocale } from "../lib/i18n/LocaleProvider";
import { nicheHostForHostname } from "../lib/subdomains";

type LanguageSwitcherProps = {
  className?: string;
  onNavigated?: () => void;
};

export default function LanguageSwitcher({ className, onNavigated }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { locale: pageLocale, publicHost } = useLocale();
  const niche = nicheHostForHostname(publicHost);
  // Niche hosts rewrite `/` to a localized page, so the visible path may not
  // contain the locale. The rendered page locale is the one that is active.
  const active = pageLocale;

  function hrefFor(locale: Locale) {
    if (niche) {
      // `/de` and `/en` stay on the subdomain. The proxy rewrites them to the
      // localized landing page, so the category folder never enters the bar.
      return `/${locale}`;
    }
    return withLocale(stripLocaleFromPathname(pathname), locale);
  }

  function persistLocale(locale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    onNavigated?.();
  }

  return (
    <div className={className ?? "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"}>
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1.5">
          {index > 0 ? <span className="opacity-40" aria-hidden>|</span> : null}
          <Link
            href={hrefFor(locale)}
            hrefLang={locale}
            aria-current={locale === active ? "page" : undefined}
            onClick={() => persistLocale(locale)}
            className={locale === active ? "opacity-100" : "opacity-55 transition-opacity hover:opacity-100"}
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}

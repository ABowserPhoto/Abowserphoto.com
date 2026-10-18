"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  getLocaleFromPathname,
  locales,
  stripLocaleFromPathname,
  withLocale,
  type Locale,
} from "../lib/i18n/config";

type LanguageSwitcherProps = {
  className?: string;
  onNavigated?: () => void;
};

export default function LanguageSwitcher({ className, onNavigated }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const active = getLocaleFromPathname(pathname) ?? "en";
  const cleanPath = stripLocaleFromPathname(pathname);

  function hrefFor(locale: Locale) {
    return withLocale(cleanPath, locale);
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

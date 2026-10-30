import type { ReactNode } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import SiteFooter from "./SiteFooter";
import SiteLogo from "./SiteLogo";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";

type LightPageFrameProps = {
  locale: Locale;
  dictionary: Dictionary;
  logoUrl: string | null;
  children: ReactNode;
};

export default function LightPageFrame({ locale, dictionary, logoUrl, children }: LightPageFrameProps) {
  return (
    <div className="min-h-screen bg-[#F4F1ED] text-[#322B2B]">
      <header className="border-b border-[#322B2B]/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <SiteLogo
            logoUrl={logoUrl}
            href={withLocale("/", locale)}
            label={dictionary.home.logoLabel}
            imageClassName="h-9 w-9 object-contain"
          />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href={withLocale("/", locale)} className="text-xs font-semibold uppercase tracking-[0.18em]">
              {dictionary.nav.home}
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">{children}</main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}

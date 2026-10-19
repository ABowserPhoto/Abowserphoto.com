import Link from "next/link";
import SiteFooter from "./SiteFooter";
import SiteLogo from "./SiteLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import type { LegalDocument as LegalDocumentContent } from "../lib/legalContent";

type LegalDocumentProps = {
  document: LegalDocumentContent;
  locale: Locale;
  dictionary: Dictionary;
  logoUrl: string | null;
};

export default function LegalDocument({ document, locale, dictionary, logoUrl }: LegalDocumentProps) {
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
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="rounded-xl border border-[#E18400]/50 bg-[#E18400]/10 px-4 py-3 text-sm leading-relaxed text-[#322B2B]">
          {document.draftNote}
        </p>
        <h1 className="mt-8 text-4xl font-light tracking-tight">{document.title}</h1>
        <div className="mt-10 space-y-8">
          {document.blocks.map((block) => (
            <section key={block.heading}>
              <h2 className="text-xl font-light tracking-tight">{block.heading}</h2>
              <div
                className={`mt-3 space-y-2 text-sm leading-relaxed sm:text-base ${
                  block.missing ? "rounded-xl border border-dashed border-[#E18400]/70 px-4 py-3" : ""
                }`}
              >
                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}

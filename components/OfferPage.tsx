import LightPageFrame from "./LightPageFrame";
import GuestEnquiry from "./GuestEnquiry";
import type { Locale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import { offerPageCopy, type OfferPageKind } from "../lib/offerPages";

type OfferPageProps = {
  kind: OfferPageKind;
  locale: Locale;
  dictionary: Dictionary;
  logoUrl: string | null;
};

export default function OfferPage({ kind, locale, dictionary, logoUrl }: OfferPageProps) {
  const copy = offerPageCopy(kind, locale);
  const de = locale === "de";

  return (
    <LightPageFrame locale={locale} dictionary={dictionary} logoUrl={logoUrl}>
      <div className="pb-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#322B2B]/55">{copy.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">{copy.h1}</h1>
        <p className="mt-4 text-lg font-light tracking-tight text-[#322B2B]/80">{copy.claim}</p>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-[#322B2B]/85 sm:text-base">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          {copy.lines.length > 0 ? (
            <>
              <h2 className="pt-4 text-2xl font-light tracking-tight">{de ? "Linien" : "Lines"}</h2>
              <ul className="space-y-1">
                {copy.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          ) : null}
          {copy.steps.length > 0 ? (
            <>
              <h2 className="pt-4 text-2xl font-light tracking-tight">{de ? "So läuft es" : "How it works"}</h2>
              <ol className="space-y-1">
                {copy.steps.map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </>
          ) : null}
          {copy.datesPlaceholder ? (
            <p className="rounded-xl border border-dashed border-[#322B2B]/30 px-4 py-3">{copy.datesPlaceholder}</p>
          ) : null}
          <h2 className="pt-4 text-2xl font-light tracking-tight">{de ? "Anfrage" : "Enquiry"}</h2>
          <GuestEnquiry topic={copy.h1} />
          {copy.footnote ? <p className="text-xs leading-relaxed text-[#322B2B]/70">{copy.footnote}</p> : null}
        </div>
      </div>
    </LightPageFrame>
  );
}

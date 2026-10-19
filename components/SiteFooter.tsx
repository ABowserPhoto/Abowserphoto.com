import Link from "next/link";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import {
  BRAND_NAME,
  COMPANY_REGISTER,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  LEGAL_NAME,
  STUDIOS,
} from "../lib/site";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export default function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const country = locale === "de" ? "Deutschland" : "Germany";

  return (
    <footer className="relative z-30 border-t border-[#322B2B]/15 bg-[#F4F1ED]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#322B2B]/70">
              {dictionary.footer.contact}
            </p>
            <p className="text-[#322B2B]">{BRAND_NAME}</p>
            <a
              href={`tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, "")}`}
              className="block text-[#322B2B] transition-opacity duration-300 hover:opacity-80"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="block break-words text-[#322B2B] transition-opacity duration-300 hover:opacity-80"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#322B2B]/70">
              {dictionary.footer.studios}
            </p>
            {STUDIOS.map((studio) => (
              <p key={studio.id} className="text-[#322B2B]">
                <span className="block">{locale === "de" ? studio.nameDe : studio.nameEn}</span>
                <span className="block">{studio.street}</span>
                <span className="block">
                  {studio.postalCode} {studio.city}, {country}
                </span>
                <a
                  href={studio.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  {dictionary.footer.directions}
                </a>
              </p>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#322B2B]/70">
              {dictionary.footer.legal}
            </p>
            <p className="text-[#322B2B]">{LEGAL_NAME}</p>
            <p className="text-[#322B2B]">
              {locale === "de" ? "Gericht" : "Court"}: {COMPANY_REGISTER.court}
            </p>
            <p className="text-[#322B2B]">
              {dictionary.footer.vatId}: {COMPANY_REGISTER.vatId}
            </p>
            <p className="text-[#322B2B]">HRB: {COMPANY_REGISTER.hrb}</p>
            <Link
              href={withLocale("/impressum", locale)}
              className="inline-block font-medium underline underline-offset-2"
            >
              {dictionary.footer.impressum}
            </Link>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#322B2B]/70">
              {dictionary.footer.privacy}
            </p>
            <Link
              href={withLocale("/cookie-richtlinie", locale)}
              className="inline-flex items-center gap-2 rounded-md border border-[#322B2B]/15 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#322B2B] transition-colors duration-300 hover:bg-white"
            >
              {dictionary.footer.cookies}
            </Link>
            <Link
              href={withLocale("/datenschutz", locale)}
              className="inline-flex items-center gap-2 rounded-md border border-[#322B2B]/15 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#322B2B] transition-colors duration-300 hover:bg-white"
            >
              {dictionary.footer.privacyPolicy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

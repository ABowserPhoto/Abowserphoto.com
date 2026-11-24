import type { Locale } from "./i18n/config";

/** Public pricing line. No amounts, no tier names. */
export function pricingLead(locale: Locale) {
  if (locale === "de") {
    return "Für die Preise fordern Sie ein Angebot über das Kontaktformular, per E-Mail oder per WhatsApp an.";
  }
  return "For pricing, request a quote by contact form, email or WhatsApp.";
}

import { CONTACT_PHONE_DISPLAY } from "./contact";
import type { Locale } from "./i18n/config";

/**
 * Lines under the kept homepage H1.
 * Award logos stay out until the files are added in lib/awards.ts.
 */
export function homeHeroCopy(locale: Locale) {
  if (locale === "de") {
    return {
      claim: "It's not just a photo, it's A. Bowser Photo.",
      line: "Fotografie, Film und KI-Bildwelten für Marken, Makler und Menschen, die mehr wollen als ein Bild.",
      book: "Shooting buchen",
      call: `Anrufen ${CONTACT_PHONE_DISPLAY}`,
      whatsapp: "WhatsApp",
      note: "Preise & Buchung im Kundenkonto. Kostenlos registrieren, oder ohne Konto anfragen.",
    };
  }
  return {
    claim: "It's not just a photo, it's A. Bowser Photo.",
    line: "Photography, film, and AI image worlds for brands, agents, and people who want more than a picture.",
    book: "Book a shoot",
    call: `Call ${CONTACT_PHONE_DISPLAY}`,
    whatsapp: "WhatsApp",
    note: "Prices and booking are in the client account. Register free, or enquire without an account.",
  };
}

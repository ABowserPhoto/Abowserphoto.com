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
      note: "Angebot per Formular, E-Mail oder WhatsApp anfragen, oder mit kostenlosem Kundenkonto direkt online buchen.",
    };
  }
  return {
    claim: "It's not just a photo, it's A. Bowser Photo.",
    line: "Photography, film, and AI image worlds for brands, agents, and people who want more than a picture.",
    book: "Book a shoot",
    call: `Call ${CONTACT_PHONE_DISPLAY}`,
    whatsapp: "WhatsApp",
    note: "Request a quote by form, email or WhatsApp, or book online with a free client account.",
  };
}

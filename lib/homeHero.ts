import { CONTACT_PHONE_DISPLAY } from "./contact";
import type { Locale } from "./i18n/config";

/**
 * Lines under the kept homepage H1.
 * The proof strip stays out until award wording and logo rights are confirmed.
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
      featuredBusinessTitle: "Business-Porträts",
      featuredBusinessText: "Teams, Profile und Businessfotos im Studio Hagen oder bei Ihnen.",
      featuredFoodTitle: "Food-Fotografie",
      featuredFoodText: "Für Restaurants, Speisekarten und Produkte, im Studio oder vor Ort.",
    };
  }
  return {
    claim: "It's not just a photo, it's A. Bowser Photo.",
    line: "Photography, film, and AI image worlds for brands, agents, and people who want more than a picture.",
    book: "Book a shoot",
    call: `Call ${CONTACT_PHONE_DISPLAY}`,
    whatsapp: "WhatsApp",
    note: "Prices and booking are in the client account. Register free, or enquire without an account.",
    featuredBusinessTitle: "Business portraits",
    featuredBusinessText: "Teams, profiles, and business photographs at the Hagen studio or at your office.",
    featuredFoodTitle: "Food photography",
    featuredFoodText: "For restaurants, menus, and products, in the studio or on location.",
  };
}

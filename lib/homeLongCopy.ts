import { bookingHref } from "./booking";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  contactEmailHref,
  contactWhatsAppHref,
  HAGEN_ADDRESS,
  SOLINGEN_ADDRESS,
} from "./contact";
import type { Locale } from "./i18n/config";
import { withLocale } from "./i18n/config";
import { solingenStudioPath } from "./routes";
import { SOLINGEN_RENTAL_RATES } from "./site";
import { portalCategoryUrl } from "./subdomains";

export type HomeLongPart = {
  text: string;
  href?: string;
};

export type HomeLongBlock =
  | { kind: "h3"; text: string }
  | { kind: "p"; parts: HomeLongPart[] }
  | { kind: "ul"; items: HomeLongPart[][] };

function text(value: string): HomeLongPart {
  return { text: value };
}

function link(value: string, href: string): HomeLongPart {
  return { text: value, href };
}

function paragraph(parts: HomeLongPart[]): HomeLongBlock {
  return { kind: "p", parts };
}

function heading(value: string): HomeLongBlock {
  return { kind: "h3", text: value };
}

function list(items: HomeLongPart[][]): HomeLongBlock {
  return { kind: "ul", items };
}

export function homeLongSummary(locale: Locale) {
  return locale === "de" ? "Mehr über Aaron Bowser Photography" : "More about Aaron Bowser Photography";
}

export function homeLongBlocks(locale: Locale): HomeLongBlock[] {
  const wedding = portalCategoryUrl("wedding", { locale });
  const immo = portalCategoryUrl("real-estate", { locale });
  const film = portalCategoryUrl("cinematography", { locale });
  const studio = portalCategoryUrl("studio", { locale });
  const commercial = portalCategoryUrl("commercial", { locale });
  const social = portalCategoryUrl("social-media-management", { locale });
  const solingen = withLocale(solingenStudioPath(locale), locale);
  const form = bookingHref(withLocale("/", locale));
  const rates = SOLINGEN_RENTAL_RATES;

  if (locale === "de") {
    return [
      paragraph([
        text(
          "Ich bin Aaron Bowser, Fotograf und Videograf aus Hagen. Wer einen Fotografen in Hagen sucht, findet bei mir Fotografie und Film aus einer Hand: für Paare, Makler, Marken und Unternehmen in Hagen, Solingen, Wuppertal und ganz NRW. Mein Anspruch steckt in einem Satz: It's not just a photo, it's A. Bowser Photo."
        ),
      ]),
      heading("Ein Ansprechpartner für Ihr Marketing und Branding"),
      paragraph([
        text(
          "Sie verkaufen ein Produkt oder eine Dienstleistung? Dann brauchen Sie mehr als ein einzelnes Foto. Ich liefere Ihnen das komplette Bildmaterial aus einer Hand, in einer Bildsprache, die auf Website, Social Media und in der Werbung zusammenpasst:"
        ),
      ]),
      list([
        [link("Produktfotos", commercial), text(" für Shop, Katalog und Kampagne")],
        [link("Content für Social Media", social), text(", als Foto und als Reel im Hochformat")],
        [link("Werbe- und Commercial-Fotografie", commercial)],
        [text("Business-Porträts")],
        [text("Bilder von Ihrem Unternehmen und Ihrem Standort")],
        [text("Imagefilme und Videos")],
        [text("Lifestyle-Aufnahmen")],
      ]),
      paragraph([
        text(
          "So haben Sie einen Ansprechpartner, einen Termin für die Planung und ein Marketing- und Branding-Paket, das wirkt wie aus einem Guss."
        ),
      ]),
      heading("Hochzeit, Immobilien und Film"),
      paragraph([
        link("Hochzeiten", wedding),
        text(
          " begleite ich ruhig und nah, vom Standesamt in Hagen oder Solingen über die freie Trauung bis zum ganzen Tag, auf Wunsch mit Hochzeitsfilm. "
        ),
        link("Makler", immo),
        text(
          " in NRW bekommen Exposé-Fotos, Walk-Thru-Videos, Agent-Branding-Videos und Drohnenaufnahmen; mit Premium Home und Luxury Makler buchen Sie Fotos, Video und Drohne aus einem Termin. Die Drohne ist registriert und versichert. Für Unternehmen entstehen "
        ),
        link("Imagefilme", film),
        text(" und kurze Reels, von der Idee über den Dreh bis zum Schnitt."),
      ]),
      heading("Fotostudio Hagen"),
      paragraph([
        text(
          `Im Fotostudio Hagen, ${HAGEN_ADDRESS.street}, ${HAGEN_ADDRESS.postalCode} Hagen, entstehen Porträts, kleinere Produkt- und Commercial-Sets sowie `
        ),
        link("Bewerbungsfotos und biometrische Passbilder", studio),
        text(
          ". Ein Bewerbungsfoto kostet 29 € (1 digitales Foto), ein biometrisches Passbild 15 €, alle Preise inkl. 19 % MwSt. Das Studio ist Montag bis Samstag von 10 bis 20 Uhr und sonntags von 9 bis 12 Uhr geöffnet."
        ),
      ]),
      heading("Fotostudio Solingen"),
      paragraph([
        text("Das "),
        link("Studio in Solingen", solingen),
        text(
          `, ${SOLINGEN_ADDRESS.street}, ${SOLINGEN_ADDRESS.postalCode} Solingen, bietet rund 100 m² für größere Produktionen, Projekte und Teams: Teamshootings, Commercial- und Fashion-Sets, Food-Aufbauten und Videodrehs. Für ein Shooting in Solingen vereinbaren Sie bitte vorab einen Termin. Sie können das Studio auch für Ihre eigene Produktion mieten: ${rates.hourlyEur} € pro Stunde (mindestens ${rates.minimumHours} Stunden), ${rates.halfDayEur} € für einen halben Tag und ${rates.fullDayEur} € für einen ganzen Tag, alle Preise inkl. 19 % MwSt.`
        ),
      ]),
      heading("Ihr Angebot"),
      paragraph([
        text("Jedes Projekt bekommt ein Angebot, das zu Umfang, Ort und Termin passt. Fragen Sie es per "),
        link("Kontaktformular", form),
        text(", per "),
        link("E-Mail", contactEmailHref()),
        text(` an ${CONTACT_EMAIL} oder per `),
        link("WhatsApp", contactWhatsAppHref()),
        text(` unter ${CONTACT_PHONE_DISPLAY} an. Oder `),
        link("buchen Sie Ihr Shooting direkt online", form),
        text("."),
      ]),
    ];
  }

  return [
    paragraph([
      text(
        "I'm Aaron Bowser, a photographer and videographer based in Hagen. If you are looking for a photographer in Hagen, you get photography and film from one source: for couples, real estate agents, brands and companies in Hagen, Solingen, Wuppertal and across North Rhine-Westphalia. My standard fits in one sentence: It's not just a photo, it's A. Bowser Photo."
      ),
    ]),
    heading("One contact for your marketing and branding"),
    paragraph([
      text(
        "Selling a product or a service? Then you need more than a single photo. I deliver all your visual content from one source, in one visual language that works together on your website, on social media and in advertising:"
      ),
    ]),
    list([
      [link("Product shots", commercial), text(" for your shop, catalogue and campaigns")],
      [link("Social media content", social), text(", as photos and vertical reels")],
      [link("Advertising and commercial photography", commercial)],
      [text("Business portraits")],
      [text("Pictures of your company and your location")],
      [text("Brand films and videos")],
      [text("Lifestyle images")],
    ]),
    paragraph([
      text(
        "That gives you one contact, one planning session and a marketing and branding package that feels all of a piece."
      ),
    ]),
    heading("Weddings, real estate and film"),
    paragraph([
      text("I photograph "),
      link("weddings", wedding),
      text(
        " calmly and up close, from the registry office in Hagen or Solingen to a symbolic ceremony or the full day, with a wedding film if you like. "
      ),
      link("Agents", immo),
      text(
        " in NRW get listing photos, walk-thru videos, agent branding videos and drone footage; with Premium Home and Luxury Makler you book photos, video and drone in a single appointment. The drone is registered and insured. For companies I produce "
      ),
      link("brand films", film),
      text(" and short reels, from the idea through the shoot to the edit."),
    ]),
    heading("Hagen photo studio"),
    paragraph([
      text(
        `The Hagen photo studio at ${HAGEN_ADDRESS.street}, ${HAGEN_ADDRESS.postalCode} Hagen, is where portraits, smaller product and commercial sets, `
      ),
      link("application photos and biometric passport photos", studio),
      text(
        " are made. An application photo is €29 (1 digital photo) and a biometric passport photo is €15, all prices including 19% VAT. The studio is open Monday to Saturday from 10:00 to 20:00 and on Sundays from 9:00 to 12:00."
      ),
    ]),
    heading("Solingen photo studio"),
    paragraph([
      text("The "),
      link("studio in Solingen", solingen),
      text(
        `, ${SOLINGEN_ADDRESS.street}, ${SOLINGEN_ADDRESS.postalCode} Solingen, offers about 100 m² for larger productions, projects and teams: team shoots, commercial and fashion sets, food set-ups and video shoots. For a shoot in Solingen, please arrange an appointment in advance. You can also rent the studio for your own production: €${rates.hourlyEur} per hour (${rates.minimumHours} hour minimum), €${rates.halfDayEur} for a half day and €${rates.fullDayEur} for a full day, all prices including 19% VAT.`
      ),
    ]),
    heading("Your quote"),
    paragraph([
      text("Every project gets a quote that fits its scope, location and date. Request yours by "),
      link("contact form", form),
      text(", by "),
      link("email", contactEmailHref()),
      text(` to ${CONTACT_EMAIL} or on `),
      link("WhatsApp", contactWhatsAppHref()),
      text(` at ${CONTACT_PHONE_DISPLAY}. Or `),
      link("book your shoot online", form),
      text(" right away."),
    ]),
  ];
}

export function homeLongPlainText(locale: Locale) {
  return homeLongBlocks(locale)
    .map((block) => {
      if (block.kind === "h3") return block.text;
      if (block.kind === "p") return block.parts.map((part) => part.text).join("");
      return block.items.map((item) => item.map((part) => part.text).join("")).join("\n");
    })
    .join("\n\n");
}

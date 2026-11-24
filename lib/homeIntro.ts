import { CONTACT_EMAIL, contactEmailHref, contactWhatsAppHref, HAGEN_ADDRESS } from "./contact";
import type { Locale } from "./i18n/config";
import { withLocale } from "./i18n/config";
import { solingenStudioPath } from "./routes";
import { portalCategoryUrl } from "./subdomains";
import { bookingHref } from "./booking";

export type IntroSegment = {
  text: string;
  href?: string;
};

export type IntroParagraph = IntroSegment[];

function text(value: string): IntroSegment {
  return { text: value };
}

function link(value: string, href: string): IntroSegment {
  return { text: value, href };
}

export function homeIntroParagraphs(locale: Locale, host?: string | null): IntroParagraph[] {
  const studioHref = portalCategoryUrl("studio", { host, locale });
  const solingenHref = withLocale(solingenStudioPath(locale), locale);
  const formHref = bookingHref(withLocale("/", locale));

  if (locale === "de") {
    return [
      [
        text(
          `Ich bin Aaron Bowser, Fotograf und Videograf aus Hagen. Ich fotografiere und filme Hochzeiten, Immobilien, Marken und Unternehmen in ganz NRW, von Hagen und Wuppertal über Solingen bis Düsseldorf, Köln und ins Ruhrgebiet. Im Fotostudio Hagen, ${HAGEN_ADDRESS.street}, entstehen Porträts, `
        ),
        link("Bewerbungsfotos und Passbilder", studioHref),
        text(
          ", Mo–Sa 10–20 Uhr und So 09–12 Uhr. Das Studio in Solingen bietet rund 100 m² für größere Produktionen und Teams, nach Terminvereinbarung und auch zur Miete. Details "
        ),
        link("hier", solingenHref),
        text(
          ". Jedes Projekt bekommt ein Angebot, das zu Umfang, Ort und Termin passt. Fragen Sie es per "
        ),
        link("Kontaktformular", formHref),
        text(", "),
        link("E-Mail", contactEmailHref()),
        text(` (${CONTACT_EMAIL}) oder `),
        link("WhatsApp", contactWhatsAppHref()),
        text(" an."),
      ],
    ];
  }

  return [
    [
      text(
        `I am Aaron Bowser, a photographer and videographer from Hagen. I photograph and film weddings, property, brands and companies across NRW, from Hagen and Wuppertal through Solingen to Düsseldorf, Cologne and the Ruhr. At the Hagen studio, ${HAGEN_ADDRESS.street}, I make portraits, `
      ),
      link("application and passport photos", studioHref),
      text(
        ", Mon–Sat 10–20 and Sun 09–12. The studio in Solingen offers about 100 m² for larger productions and teams, by appointment and also for rent. Details "
      ),
      link("here", solingenHref),
      text(". Every project receives a quote that fits the scope, the place and the date. Ask for it by "),
      link("contact form", formHref),
      text(", "),
      link("email", contactEmailHref()),
      text(` (${CONTACT_EMAIL}) or `),
      link("WhatsApp", contactWhatsAppHref()),
      text("."),
    ],
  ];
}

export function homeIntroPlainText(locale: Locale) {
  return homeIntroParagraphs(locale)
    .map((paragraph) => paragraph.map((segment) => segment.text).join(""))
    .join("\n\n");
}

export function countWords(value: string) {
  return value.split(/\s+/).filter(Boolean).length;
}

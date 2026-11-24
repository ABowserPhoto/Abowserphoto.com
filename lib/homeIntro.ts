import {
  CONTACT_EMAIL,
  contactEmailHref,
  contactWhatsAppHref,
  formatAddressLine,
  HAGEN_ADDRESS,
  SOLINGEN_ADDRESS,
} from "./contact";
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
  const hagen = formatAddressLine(HAGEN_ADDRESS);
  const solingen = formatAddressLine(SOLINGEN_ADDRESS);
  const studioHref = portalCategoryUrl("studio", { host, locale });
  const solingenHref = withLocale(solingenStudioPath(locale), locale);
  const formHref = bookingHref(withLocale("/", locale));

  if (locale === "de") {
    return [
      [
        text(
          `Das Studio Hagen, ${hagen}, hat etwa 40 Quadratmeter für Porträts, Business-Bilder und kleinere Commercial-Sets. `
        ),
        text("Studio Hagen bietet Bewerbungsfotos und Passbilder, mehr dazu "),
        link("hier", studioHref),
        text("."),
      ],
      [
        text(
          `Das Studio Solingen, ${solingen}, hat etwa 100 m² und nimmt größere Produktionen, Projekte und Teams auf, die für das Studio Hagen zu groß wären. Für ein Shooting schreiben Sie uns bitte, damit wir vor Ihrem Besuch einen Termin legen. Das Studio kann auch gemietet werden, Details `
        ),
        link("hier", solingenHref),
        text("."),
      ],
      [
        text("Für die Preise fordern Sie ein Angebot an: "),
        link("Kontaktformular", formHref),
        text(", "),
        link("E-Mail", contactEmailHref()),
        text(` (${CONTACT_EMAIL}) oder `),
        link("WhatsApp", contactWhatsAppHref()),
        text("."),
      ],
    ];
  }

  return [
    [
      text(
        `The Hagen studio, ${hagen}, is about 40 square metres for portraits, business pictures, and smaller commercial sets. `
      ),
      text("Studio Hagen offers application and passport photos, more info "),
      link("here", studioHref),
      text("."),
    ],
    [
      text(
        `The Solingen studio, ${solingen}, is about 100 m² and can handle larger productions, projects and teams that would be too big for the Hagen studio. To book a shoot, please contact us to schedule an appointment before coming. The studio can also be rented, details `
      ),
      link("here", solingenHref),
      text("."),
    ],
    [
      text("For pricing, request a quote by "),
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

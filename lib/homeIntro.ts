import {
  appointmentOnlyLabel,
  formatAddressLine,
  HAGEN_ADDRESS,
  SOLINGEN_ADDRESS,
} from "./contact";
import type { Locale } from "./i18n/config";
import { withLocale } from "./i18n/config";
import { categoryPath, solingenStudioPath } from "./routes";
import { portalCategoryUrl } from "./subdomains";

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

function path(slug: Parameters<typeof categoryPath>[0], locale: Locale) {
  return withLocale(categoryPath(slug, locale), locale);
}

export function homeIntroParagraphs(locale: Locale, host?: string | null): IntroParagraph[] {
  const hagen = formatAddressLine(HAGEN_ADDRESS);
  const solingen = formatAddressLine(SOLINGEN_ADDRESS);
  const studioHref = portalCategoryUrl("studio", { host, locale });

  if (locale === "de") {
    const appointment = appointmentOnlyLabel("de", { sentence: false });
    return [
      [
        text(
          `Aaron Bowser ist Fotograf in Hagen. Das Fotostudio Hagen, ${hagen}, ist der Raum für den Alltag: etwa 40 Quadratmeter für Porträts, Business-Bilder und kleinere Commercial-Sets. Wer einen Fotografen in Hagen sucht, kommt meist hierher. Aaron arbeitet in diesem Studio täglich. Das Licht wird für die Person oder das Produkt gesetzt, und der Termin bekommt die Zeit, die er braucht, ohne dass dazwischen ein Laufkundengeschäft drängt.`
        ),
      ],
      [
        text(
          `Das zweite Studio steht in Solingen, ${solingen}. Es hat etwa 100 Quadratmeter und ist für größere Projekte und Produktionen gebaut: Teams, aufwendigere Sets und Commercial-Aufbauten, die im Alltagstudio keinen Platz haben. Das Fotostudio Solingen hat keine öffentlichen Öffnungszeiten. Es ist ${appointment} zugänglich und kann gemietet werden, wenn eine Produktion den Raum für sich braucht. Bewerbungsfotos und Passbilder werden dort nicht gemacht. Wie die Fläche genutzt wird und wie eine Miete angefragt wird, steht auf der Seite zum `
        ),
        link("Fotostudio Solingen", withLocale(solingenStudioPath("de"), "de")),
        text("."),
      ],
      [
        text("Die Aufträge bleiben getrennt, damit jede Arbeit ihre eigene Form behält. "),
        link("Hochzeiten", path("wedding", "de")),
        text(
          " fotografiere ich in Hagen, Solingen und in Nordrhein-Westfalen. Dazu gehören das Standesamt, die freie Trauung und der ganze Tag, als ruhige, filmische Reportage, nicht als gestellte Serie. Ein "
        ),
        link("Hochzeitsvideo", path("cinematography", "de")),
        text(" kann denselben Tag begleiten; Konzept, Dreh und Schnitt liegen bei der Filmproduktion. "),
        link("Business-Porträts", path("business-portraits", "de")),
        text(
          " entstehen in der Regel im Fotostudio Hagen. Ein größeres Team kommt ins Studio Solingen oder wird im Büro fotografiert. "
        ),
        link("Commercial-Fotografie", path("commercial", "de")),
        text(
          " umfasst Fashion, Beauty, Produkt und Editorial, je nachdem, ob das Set klein bleibt oder die Fläche in Solingen braucht. "
        ),
        link("Food-Fotografie", path("food", "de")),
        text(" ist für Restaurants, Speisekarten und Produkte gedacht, im Studio oder vor Ort in NRW. "),
        link("Immobilienfotografie", path("real-estate", "de")),
        text(
          " ist ein eigener Bereich für Makler in Hagen, Solingen und NRW; das Angebot richtet sich nach dem Objekt. "
        ),
        link("Social Media", path("social-media-management", "de")),
        text(
          " kommt dazu, wenn aus den Bildern ein laufender Auftritt werden soll, mit Plan, Veröffentlichung und einem Blick auf das, was getragen hat."
        ),
      ],
      [
        text(
          "Für diese Arbeiten stehen keine Paketpreise auf der Website. Hochzeit, Business, Commercial, Food, Film und Immobilien werden nach Umfang, Ort und Tag angeboten. Eine Anfrage genügt, um zu klären, welches Studio passt und wie der Termin aussehen kann. Das Fotostudio Hagen bleibt der Ort für den wiederkehrenden Alltag einer Marke. Das Studio Solingen ist der Raum, wenn die Produktion mehr Fläche und Ruhe braucht."
        ),
      ],
      [
        text(
          "Bewerbungsfotos und biometrische Passbilder sind davon ausgenommen. Sie gehören nicht zum Angebot dieser Seite und werden im Fotostudio Hagen über eine "
        ),
        link("eigene Adresse", studioHref),
        text(" vergeben."),
      ],
    ];
  }

  const appointment = appointmentOnlyLabel("en", { sentence: false });
  return [
    [
      text(
        `Aaron Bowser is a photographer in Hagen. The Hagen photo studio, ${hagen}, is the everyday room: about 40 square metres for portraits, business pictures, and smaller commercial sets. People who look for a photographer in Hagen usually come here. Aaron works in this studio every day. The light is set for the person or the product, and the session is given the time it needs, without a walk-in counter pushing the next appointment through the door.`
      ),
    ],
    [
      text(
        `The second studio is in Solingen, ${solingen}. It is about 100 square metres and is built for larger projects and productions: teams, bigger sets, and commercial builds that do not fit in the everyday studio. The Solingen photo studio has no public opening hours. It is ${appointment} and can be rented when a production needs the room to itself. Application photos and passport photos are not made there. How the floor is used, and how a rental is requested, is set out on the `
      ),
      link("Solingen studio page", withLocale(solingenStudioPath("en"), "en")),
      text("."),
    ],
    [
      text("The commissions stay separate, so each kind of work keeps its own shape. I photograph "),
      link("weddings", path("wedding", "en")),
      text(
        " in Hagen, Solingen, and across North Rhine-Westphalia. That covers the registry office, a symbolic ceremony, and the full day, as a calm cinematic reportage rather than a posed series. A "
      ),
      link("wedding film", path("cinematography", "en")),
      text(" can follow the same day; concept, shoot, and edit sit with the film production. "),
      link("Business portraits", path("business-portraits", "en")),
      text(
        " are usually made at the Hagen studio. A larger team comes to the Solingen studio or is photographed at the office. "
      ),
      link("Commercial photography", path("commercial", "en")),
      text(
        " covers fashion, beauty, product, and editorial, depending on whether the set stays small or needs the floor in Solingen. "
      ),
      link("Food photography", path("food", "en")),
      text(" is for restaurants, menus, and products, in the studio or on location in NRW. "),
      link("Real estate photography", path("real-estate", "en")),
      text(
        " is its own practice for agents in Hagen, Solingen, and NRW; the quote follows the property. "
      ),
      link("Social media", path("social-media-management", "en")),
      text(
        " joins in when the pictures need to become an ongoing presence, with a plan, publishing, and a look at what carried."
      ),
    ],
    [
      text(
        "None of this work publishes package prices on the website. Wedding, business, commercial, food, film, and real estate are quoted by scope, place, and day. An enquiry is enough to decide which studio fits and what the session can look like. The Hagen studio remains the place for the recurring everyday of a brand. The Solingen studio is the room when a production needs more floor and more quiet."
      ),
    ],
    [
      text(
        "Application photos and biometric passport photos are the exception. They are not part of the offer on this site, and they are booked at the Hagen studio through a "
      ),
      link("separate address", studioHref),
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

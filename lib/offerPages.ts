import type { Locale } from "./i18n/config";

export type OfferPageKind = "prints" | "events";

export type OfferPageCopy = {
  eyebrow: string;
  title: string;
  h1: string;
  claim: string;
  paragraphs: string[];
  lines: string[];
  steps: string[];
  footnote: string | null;
  datesPlaceholder: string | null;
};

export function offerPageCopy(kind: OfferPageKind, locale: Locale): OfferPageCopy {
  const de = locale === "de";
  switch (kind) {
    case "prints":
      return de
        ? {
            eyebrow: "Drucke",
            title: "Wandbilder & Metalldrucke | Aaron Bowser Photography",
            h1: "Wandbilder & Metalldrucke",
            claim: "Wandbilder, die bleiben.",
            paragraphs: [
              "Ihre Fotos oder eigens geschaffene KI-Kunst als Alu-Dibond, Acryl oder HD-Metall. Für Ihr Zuhause, Hotels, Restaurants und Büros.",
              "KI-Bildwelten sind als KI-Kunst klar gekennzeichnet. Es werden keine Bildelemente als Fotografie ausgegeben, die erzeugt wurden.",
              "Beispiele für KI-Bildwelten folgen, sobald freigegebene Motive vorliegen.",
              "Für Hotels und Gastronomie: Bildwelten passend zu Ihrem Haus, als KI-Kunst klar gekennzeichnet, mit Nutzungslizenz.",
              "Preise stehen im Kundenkonto nach der Registrierung oder werden im Beratungstermin besprochen. Eine Anfrage ohne Konto ist jederzeit möglich.",
            ],
            lines: ["Signature Alu", "Signature Acryl", "HD Metal (feuchtraumgeeignet)", "Galeriewand"],
            steps: [
              "Shooting oder Motivauswahl",
              "Wandvorschau mit einem Foto Ihrer echten Wand",
              "Präsentation im Studio oder bei Ihnen",
              "Fertigung, Lieferung, auf Wunsch Montage",
            ],
            footnote:
              "Individuell angefertigte Drucke sind vom Widerrufsrecht ausgenommen (§ 312g Abs. 2 Nr. 1 BGB). Alle Preise inkl. 19 % MwSt. Dieser Satz steht zur Prüfung, bevor Drucke online verkauft werden.",
            datesPlaceholder: null,
          }
        : {
            eyebrow: "Prints",
            title: "Wall art and metal prints | Aaron Bowser Photography",
            h1: "Wall art and metal prints",
            claim: "Wall art that stays.",
            paragraphs: [
              "Your photographs, or AI art made for the place, as aluminium dibond, acrylic, or HD metal. For a home, a hotel, a restaurant, or an office.",
              "AI image worlds are clearly labelled as AI art. Nothing generated is presented as a photograph.",
              "Examples of AI image worlds will follow once approved pictures exist.",
              "For hotels and restaurants: image worlds that fit the house, labelled as AI art, with a licence for use.",
              "Prices are in the client account after registration, or they are discussed in a consultation. An enquiry without an account is always possible.",
            ],
            lines: ["Signature Alu", "Signature Acrylic", "HD Metal (suitable for wet rooms)", "Gallery wall"],
            steps: [
              "A shoot or a choice of picture",
              "A preview on a photograph of your actual wall",
              "A presentation in the studio or at your place",
              "Production, delivery, and installation if you want it",
            ],
            footnote:
              "Prints made to order are excluded from the right of withdrawal (section 312g (2) no. 1 of the German Civil Code). All prices include 19% VAT. This sentence is here for review before prints are sold online.",
            datesPlaceholder: null,
          };
    case "events":
      return de
        ? {
            eyebrow: "Termine",
            title: "Termine & Aktionen | Aaron Bowser Photography",
            h1: "Termine & Aktionen",
            claim: "Mini-Sessions und Aktionen, sobald der Termin steht.",
            paragraphs: [
              "Hier erscheinen datierte Mini-Sessions und Aktionen. Business-Porträts bleiben ein eigenes Angebot und werden hier nicht vermischt.",
              "Preise stehen nicht auf dieser Seite. Sie liegen im Kundenkonto oder werden in der Anfrage besprochen.",
            ],
            lines: [],
            steps: [],
            footnote: null,
            datesPlaceholder:
              "Die nächsten Termine stehen noch nicht fest. Sobald ein Termin bestätigt ist, steht er hier. Eine Warteliste ist über das Formular möglich.",
          }
        : {
            eyebrow: "Dates",
            title: "Dates and events | Aaron Bowser Photography",
            h1: "Dates and events",
            claim: "Mini sessions and events, once the date is set.",
            paragraphs: [
              "Dated mini sessions and events will be listed here. Business portraits stay a separate offer and are not mixed in.",
              "This page does not publish prices. They sit in the client account or are discussed in the enquiry.",
            ],
            lines: [],
            steps: [],
            footnote: null,
            datesPlaceholder:
              "The next dates are not set yet. Once a date is confirmed, it will be listed here. The form is a waiting list.",
          };
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}

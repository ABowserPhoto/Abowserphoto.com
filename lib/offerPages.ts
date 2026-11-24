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
              "Für Hotels und Gastronomie: Bildwelten passend zu Ihrem Haus, als KI-Kunst klar gekennzeichnet, mit Nutzungslizenz.",
              "Jedes Wandbild wird für Ihren Raum geplant. Fordern Sie Ihr Angebot per Kontaktformular, E-Mail oder WhatsApp an. Gern zeigen wir Ihnen vorab eine Wandvorschau mit einem Foto Ihrer echten Wand.",
            ],
            lines: ["Signature Alu", "Signature Acryl", "HD Metal (feuchtraumgeeignet)", "Galeriewand"],
            steps: [
              "Shooting oder Motivauswahl",
              "Wandvorschau mit einem Foto Ihrer echten Wand",
              "Präsentation im Studio oder bei Ihnen",
              "Fertigung, Lieferung, auf Wunsch Montage",
            ],
            footnote: null,
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
              "For hotels and restaurants: image worlds that fit the house, labelled as AI art, with a licence for use.",
              "Every print is planned for your room. Request a quote by contact form, email or WhatsApp. We are glad to show a preview on a photograph of your actual wall.",
            ],
            lines: ["Signature Alu", "Signature Acrylic", "HD Metal (suitable for wet rooms)", "Gallery wall"],
            steps: [
              "A shoot or a choice of picture",
              "A preview on a photograph of your actual wall",
              "A presentation in the studio or at your place",
              "Production, delivery, and installation if you want it",
            ],
            footnote: null,
            datesPlaceholder: null,
          };
    case "events":
      return de
        ? {
            eyebrow: "Termine",
            title: "Termine & Aktionen | Aaron Bowser Photography",
            h1: "Termine & Aktionen",
            claim: "Saisonale Mini-Sessions und Aktionen im Studio.",
            paragraphs: [
              "Saisonale Mini-Sessions und Aktionen im Studio: kurze, thematische Shootings zu besonderen Anlässen, ideal als Geschenk oder für neue Familien- und Paarfotos.",
              "Plätze sind begrenzt. Tragen Sie sich in die Warteliste ein, dann melden wir uns, sobald der nächste Termin feststeht.",
            ],
            lines: [],
            steps: [],
            footnote: null,
            datesPlaceholder:
              "Neue Termine werden hier veröffentlicht. Sichern Sie sich über das Formular einen Platz auf der Warteliste.",
          }
        : {
            eyebrow: "Dates",
            title: "Dates and events | Aaron Bowser Photography",
            h1: "Dates and events",
            claim: "Seasonal mini sessions and events at the studio.",
            paragraphs: [
              "Seasonal mini sessions and events at the studio: short, themed shoots for a particular occasion, a good gift or a new family or couple photograph.",
              "Places are limited. Join the waiting list and we will write when the next date is set.",
            ],
            lines: [],
            steps: [],
            footnote: null,
            datesPlaceholder:
              "New dates are published here. Use the form to take a place on the waiting list.",
          };
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}

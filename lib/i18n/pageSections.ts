import type { FAQItem, CategorySlug } from "../content";
import { appointmentOnlyLabel } from "../contact";
import { formatStudioLine, HAGEN_STUDIO, SOLINGEN_STUDIO, studioSittingPriceAnswer } from "../site";
import type { Locale } from "./config";

export type PageSection = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

const hagen = formatStudioLine(HAGEN_STUDIO);
const solingen = formatStudioLine(SOLINGEN_STUDIO);

const weddingSections: Record<Locale, PageSection[]> = {
  de: [
    {
      id: "standesamt",
      eyebrow: "Trauung",
      title: "Standesamt-Fotograf in Solingen und Hagen",
      paragraphs: [
        "Viele Paare heiraten zuerst standesamtlich, oft in Solingen oder Hagen, und feiern später. Für diese Stunde fotografiere ich als Standesamt-Fotograf ruhig und nah am Ablauf: Ankunft, der Raum, die Trauung, die Menschen danach. Nichts wird für die Kamera nachgestellt.",
        `Wenn das Standesamt in Solingen oder das Standesamt in Hagen der ganze Termin ist, bleibt der Umfang überschaubar. Wenn danach ein Essen oder ein Spaziergang folgt, erweitern wir die Reportage. Die Trauung fotografiere ich dort, wo Sie heiraten, nicht im Studio. Porträts danach können im Studio Hagen entstehen (${hagen}, etwa 40 m²). Das größere Studio Solingen (${solingen}) ist ${appointmentOnlyLabel("de", { sentence: false })} da.`,
        "Die standesamtliche Trauung ist ein eigener Teil der Hochzeitsfotografie, mit derselben ruhigen Bildsprache wie die freie Trauung und der ganze Tag.",
      ],
    },
  ],
  en: [
    {
      id: "standesamt",
      eyebrow: "Ceremony",
      title: "Civil ceremony photographer in Solingen and Hagen",
      paragraphs: [
        "Many couples marry first at the registry office, often in Solingen or Hagen, and celebrate later. For that hour I work quietly and close to the order of the day: the arrival, the room, the ceremony, the people afterwards. Nothing is restaged for the camera.",
        `When the ceremony in Solingen or Hagen is the whole booking, the coverage stays compact. When a meal or a walk follows, we extend the reportage. The ceremony is photographed where you marry, not in the studio. Portraits afterwards can be made at the Hagen studio (${hagen}, about 40 m²). The larger Solingen studio (${solingen}) is ${appointmentOnlyLabel("en", { sentence: false })}.`,
        "A civil ceremony is its own part of the wedding coverage, not a footnote. A symbolic ceremony and a full day stay in the same visual language.",
      ],
    },
  ],
};

const businessFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Wo entstehen die Business-Porträts?",
      answer: `In der Regel im Studio Hagen, ${hagen}, etwa 40 m², wo Aaron täglich arbeitet. Das Studio Solingen, ${solingen}, etwa 100 m², ist für größere Produktionen und ${appointmentOnlyLabel("de", { sentence: false })}; es kann auch gemietet werden. Eine eigene Seite dazu folgt. Sitzungen im Büro in Nordrhein-Westfalen bleiben möglich.`,
    },
    {
      question: "Für wen sind die Porträts gedacht?",
      answer:
        "Für Geschäftsführung, Teams und Menschen mit einer eigenen Marke: Businessfotos, Mitarbeiterfotos, Firmenfotos und LinkedIn-Profilbilder.",
    },
    {
      question: "Was kostet ein Business-Porträt?",
      answer:
        "Das Honorar richtet sich nach Personenzahl, Ort und Umfang. Sie erhalten ein individuelles Angebot.",
    },
    {
      question: "Wie läuft das Shooting ab?",
      answer:
        "Wir klären Nutzung und Stimmung, dann Licht und Hintergrund. Ich leite Haltung und Ausdruck an. Sie bekommen eine enge Auswahl finaler Bilder.",
    },
    {
      question: "Können wir ein ganzes Team an einem Tag fotografieren?",
      answer:
        `Ja. Einzelporträts und kleine Runden bleiben im Studio Hagen. Ein größeres Team fotografiere ich im Studio Solingen, ${appointmentOnlyLabel("de", { sentence: false })}, oder bei Ihnen im Büro. Die Termine liegen nacheinander, jedes Porträt bleibt kurz. Wie viele Personen an einem Tag passen, hängt vom Zeitfenster ab und wird vorher festgelegt.`,
    },
  ],
  en: [
    {
      question: "Where do you photograph business portraits?",
      answer: `Usually at the Hagen studio, ${hagen}, about 40 m², where Aaron works every day. The Solingen studio, ${solingen}, about 100 m², is for larger productions and ${appointmentOnlyLabel("en", { sentence: false })}; it can also be rented. A page of its own will follow. Sessions at your office in North Rhine-Westphalia are still possible.`,
    },
    {
      question: "Who are the portraits for?",
      answer:
        "For leadership, teams, and people with their own brand. The work is business photographs, staff photographs, and LinkedIn portraits.",
    },
    {
      question: "What does a business portrait cost?",
      answer:
        "The fee depends on the number of people, the location, and the scope. You receive an individual quote.",
    },
    {
      question: "How does a session run?",
      answer:
        "We agree use and tone, then light and background. I direct posture and expression. You receive a tight edit of final photographs.",
    },
    {
      question: "Can a whole team be photographed in one day?",
      answer:
        `Yes. Individual portraits and small groups stay at the Hagen studio. A larger team is photographed at the Solingen studio, ${appointmentOnlyLabel("en", { sentence: false })}, or at your office. Sittings run one after another, and each portrait stays short. How many people fit depends on the window of time and is agreed beforehand.`,
    },
  ],
};

const weddingFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Fotografieren Sie auch nur das Standesamt?",
      answer:
        "Ja. Eine standesamtliche Trauung in Solingen, Hagen oder der Umgebung kann ein eigener Termin sein. Ein späterer Tag lässt sich dazubuchen.",
    },
    {
      question: "Wie weit im Voraus sollen wir anfragen?",
      answer:
        "Beliebte Samstage sind oft mehrere Monate vorher vergeben. Eine Anfrage lohnt, sobald das Datum steht.",
    },
    {
      question: "Reisen Sie zu Trauungen außerhalb von Hagen und Solingen?",
      answer:
        "Ja, innerhalb von Nordrhein-Westfalen regelmäßig, weiter entfernt nach Absprache. Reisekosten nennen wir mit dem Angebot.",
    },
  ],
  en: [
    {
      question: "Do you cover only the civil ceremony?",
      answer:
        "Yes. A registry-office ceremony in Solingen, Hagen, or nearby can be its own booking. A later celebration can be added.",
    },
    {
      question: "How far ahead should we enquire?",
      answer: "Popular Saturdays are often booked several months ahead. It is worth writing once the date is set.",
    },
    {
      question: "Do you travel beyond Hagen and Solingen?",
      answer:
        "Yes, regularly within North Rhine-Westphalia, and further by arrangement. Travel costs are part of the quote.",
    },
  ],
};

export function getPageSections(slug: CategorySlug, locale: Locale): PageSection[] {
  if (slug === "wedding") return weddingSections[locale];
  return [];
}

const studioFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Wo entstehen Bewerbungsfotos und Passbilder?",
      answer: `Im Studio Hagen, ${hagen}, etwa 40 m². Dort arbeitet Aaron täglich, und diese Termine werden hier gebucht.`,
    },
    {
      question: "Was unterscheidet ein Bewerbungsfoto von einem Passbild?",
      answer:
        "Das Bewerbungsfoto darf lächeln und zur Stelle passen. Das Passbild folgt den aktuellen biometrischen Vorgaben: frontal, neutraler Ausdruck, einfarbiger Hintergrund. Beides kann in einem Termin entstehen.",
    },
    {
      question: "Was kostet der Termin?",
      answer: studioSittingPriceAnswer("de"),
    },
    {
      question: "Wie läuft das Shooting ab?",
      answer:
        "Wir klären die Verwendung, dann Licht und Hintergrund. Für das Bewerbungsfoto leite ich Haltung und Ausdruck an. Das Passbild wird nach den amtlichen Vorgaben aufgenommen.",
    },
  ],
  en: [
    {
      question: "Where are application and passport photos taken?",
      answer: `At the Hagen studio, ${hagen}, about 40 m². Aaron works there every day, and these sittings are booked there.`,
    },
    {
      question: "How is an application photo different from a passport photo?",
      answer:
        "An application photo may smile and suit the role. A passport photo follows the current biometric rules: frontal, a neutral expression, and a plain background. Both can be made in the same visit.",
    },
    {
      question: "What does a sitting cost?",
      answer: studioSittingPriceAnswer("en"),
    },
    {
      question: "How does the sitting work?",
      answer:
        "We agree where the pictures will be used, then set the light and the background. For the application photo I direct posture and expression. The passport photo is made to the official rules.",
    },
  ],
};

export function getPageFaqs(slug: CategorySlug, locale: Locale): FAQItem[] {
  if (slug === "business-portraits") return businessFaqs[locale];
  if (slug === "wedding") return weddingFaqs[locale];
  if (slug === "studio") return studioFaqs[locale];
  return [];
}

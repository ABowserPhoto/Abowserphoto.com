import type { FAQItem, CategorySlug } from "../content";
import { BUSINESS_PORTRAIT_PRICE_FROM, formatStudioLine, HAGEN_STUDIO, SOLINGEN_STUDIO } from "../site";
import type { Locale } from "./config";

export type PageSection = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

const hagen = formatStudioLine(HAGEN_STUDIO);
const solingen = formatStudioLine(SOLINGEN_STUDIO);

function priceSentence(locale: Locale) {
  if (BUSINESS_PORTRAIT_PRICE_FROM) {
    return locale === "de"
      ? `Das Honorar für Business-Porträts beginnt bei ${BUSINESS_PORTRAIT_PRICE_FROM}. Den genauen Umfang, also Personen, Ort und Anzahl der finalen Bilder, legen wir vor dem Termin fest.`
      : `Business portraits start at ${BUSINESS_PORTRAIT_PRICE_FROM}. We confirm people, location, and the number of final images before the session.`;
  }

  return locale === "de"
    ? "Das Honorar richtet sich nach Personenzahl, Ort und Umfang. Einen öffentlichen Startpreis gibt es noch nicht, deshalb gilt bis auf Weiteres: Preis auf Anfrage."
    : "The fee depends on the number of people, the location, and the scope. A public starting price is not set yet, so the fee is on request.";
}

const businessSections: Record<Locale, PageSection[]> = {
  de: [
    {
      id: "executive-headshots",
      eyebrow: "Führung",
      title: "Executive-Headshots",
      paragraphs: [
        "Executive-Headshots sind für Geschäftsführung, Partner und Menschen, die ein Unternehmen nach außen vertreten. Das Bild soll auf der Website, in einer Präsentation und bei LinkedIn dieselbe Person zeigen: ruhig, klar und ohne austauschbare Studio-Geste.",
        `Die Sitzungen finden im Studio Hagen (${hagen}) oder im Studio Solingen (${solingen}) statt. Wer das eigene Büro als Hintergrund will, bucht das Shooting vor Ort. Vor der Aufnahme klären wir Ausschnitt, Kleidung und wo das Porträt erscheinen soll.`,
      ],
    },
    {
      id: "teamfotos",
      eyebrow: "Unternehmen",
      title: "Mitarbeiterfotos und Teamfotos",
      paragraphs: [
        "Mitarbeiterfotos und Teamfotos halten ein Unternehmen in einer gemeinsamen Bildlinie. Gleiches Licht, gleicher Ausschnitt, gleicher Ton, damit die Teamseite nicht wie eine Sammlung einzelner Schnappschüsse wirkt. Firmenfotos dieser Art eignen sich für die Website, Angebote und Presse.",
        "An einem Bürotag fotografiere ich nacheinander, mit kurzer Anleitung zu Haltung und Blick. Die Termine bleiben kurz, damit der Arbeitstag weiterläuft. Die Anzahl der Personen stimmen wir nach Teamgröße und Zeitfenster ab.",
      ],
    },
    {
      id: "linkedin",
      eyebrow: "Profil",
      title: "LinkedIn-Profilbild und Personal Branding",
      paragraphs: [
        "Ein LinkedIn-Profilbild muss im kleinen Ausschnitt funktionieren und auf der eigenen Website trotzdem nach derselben Person aussehen. Dafür fotografiere ich Corporate Headshots, die eine persönliche Marke tragen, ohne laut zu werden.",
        "Das ist die richtige Form für Berater, Sprecher und Spezialisten. Wir wählen einen Ausschnitt, der als Profilbild trägt, und eine zweite, ruhigere Variante für Vorträge, Presse und die Über-mich-Seite.",
      ],
    },
    {
      id: "vor-ort",
      eyebrow: "Beim Kunden",
      title: "Business-Fotoshooting vor Ort",
      paragraphs: [
        "Wenn das Team nicht ins Studio kommt, baue ich das Licht im Büro auf. Hagen, Solingen und weitere Orte in Nordrhein-Westfalen sind dafür eingeplant. Ein kompakter Aufbau, neutrale oder eigene Räume, und eine Serie, die danach wie aus einem Guss aussieht.",
        "Vor Ort brauche ich ein kurzes Zeitfenster und einen Raum mit etwas Tiefe. Den Ablauf und die Lieferzeit sprechen wir vor dem Termin ab, damit die Bilder zum Launch oder zum neuen Auftritt passen.",
      ],
    },
    {
      id: "honorar",
      eyebrow: "Ablauf",
      title: "Honorar und Ablauf",
      paragraphs: [
        priceSentence("de"),
        "Nach einem kurzen Briefing setzen wir Licht und Hintergrund. Ich leite Haltung und Ausdruck an. Sie erhalten eine eng ausgewählte Serie, keine ungefilterte Menge. Nutzung für Website, LinkedIn und die übliche Unternehmenskommunikation ist der Ausgangspunkt; eine weitergehende Lizenz klären wir, wenn die Bilder in Kampagnen oder Anzeigen gehen.",
      ],
    },
  ],
  en: [
    {
      id: "executive-headshots",
      eyebrow: "Leadership",
      title: "Executive headshots",
      paragraphs: [
        "Executive headshots are for founders, partners, and the people who represent a company. The portrait should read as the same person on the website, in a deck, and on LinkedIn: calm, clear, and free of a generic studio pose.",
        `Sessions take place at the Hagen studio (${hagen}) or the Solingen studio (${solingen}). If the office itself should be in the frame, the sitting happens on site. Before we start, we agree the crop, the clothing, and where the portrait will be used.`,
      ],
    },
    {
      id: "teamfotos",
      eyebrow: "Company",
      title: "Staff portraits and team photographs",
      paragraphs: [
        "Staff and team photographs give a company one visual line. The same light, the same crop, the same tone, so a team page does not look like a folder of unrelated snapshots. These company photographs work on the website, in proposals, and in press kits.",
        "On an office day I photograph people one after another, with brief direction for posture and gaze. Each sitting stays short so the working day can continue. We set the number of portraits around the size of the team and the time available.",
      ],
    },
    {
      id: "linkedin",
      eyebrow: "Profile",
      title: "LinkedIn profile pictures and personal branding",
      paragraphs: [
        "A LinkedIn profile picture has to work at a small size and still match the portrait on your own website. I photograph corporate headshots that carry a personal brand without turning the volume up.",
        "This is the right form for consultants, speakers, and specialists. We choose one crop that holds as a profile picture and a second, quieter frame for talks, press, and an about page.",
      ],
    },
    {
      id: "vor-ort",
      eyebrow: "On location",
      title: "Business portraits at your office",
      paragraphs: [
        "When the team cannot come to the studio, I set the light up in the office. Hagen, Solingen, and other locations in North Rhine-Westphalia are part of that work. A compact setup, a neutral or your own room, and a series that looks like one session afterwards.",
        "On site I need a short window and a room with a little depth. We agree the running order and the delivery date before the session, so the photographs are ready for a launch or a new company presence.",
      ],
    },
    {
      id: "honorar",
      eyebrow: "The sitting",
      title: "Fee and how a session runs",
      paragraphs: [
        priceSentence("en"),
        "After a short briefing we set light and background. I direct posture and expression. You receive a tight edit, not an unfiltered dump. Use on the website, on LinkedIn, and in ordinary company communication is the starting point. A wider licence is agreed when the photographs go into campaigns or advertising.",
      ],
    },
  ],
};

const weddingSections: Record<Locale, PageSection[]> = {
  de: [
    {
      id: "standesamt",
      eyebrow: "Trauung",
      title: "Standesamt-Fotograf in Solingen und Hagen",
      paragraphs: [
        "Viele Paare heiraten zuerst standesamtlich, oft in Solingen oder Hagen, und feiern später. Für diese Stunde fotografiere ich als Standesamt-Fotograf ruhig und nah am Ablauf: Ankunft, der Raum, die Trauung, die Menschen danach. Nichts wird für die Kamera nachgestellt.",
        `Wenn das Standesamt in Solingen oder das Standesamt in Hagen der ganze Termin ist, bleibt der Umfang überschaubar. Wenn danach ein Essen oder ein Spaziergang folgt, erweitern wir die Reportage. Die Studios liegen in der ${hagen} und in der ${solingen}; die Trauung selbst fotografiere ich dort, wo Sie heiraten.`,
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
        `When the ceremony in Solingen or Hagen is the whole booking, the coverage stays compact. When a meal or a walk follows, we extend the reportage. The studios are at ${hagen} and ${solingen}; the ceremony itself is photographed where you marry.`,
        "A civil ceremony is its own part of the wedding coverage, not a footnote. A symbolic ceremony and a full day stay in the same visual language.",
      ],
    },
  ],
};

const businessFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Wo entstehen die Business-Porträts?",
      answer: `Im Studio Hagen, ${hagen}, im Studio Solingen, ${solingen}, oder bei Ihnen im Büro in Nordrhein-Westfalen.`,
    },
    {
      question: "Für wen sind die Porträts gedacht?",
      answer:
        "Für Geschäftsführung, Teams und Menschen mit einer eigenen Marke: Businessfotos, Mitarbeiterfotos, Firmenfotos und LinkedIn-Profilbilder.",
    },
    {
      question: "Was kostet ein Business-Porträt?",
      answer: priceSentence("de"),
    },
    {
      question: "Wie läuft das Shooting ab?",
      answer:
        "Wir klären Nutzung und Stimmung, dann Licht und Hintergrund. Ich leite Haltung und Ausdruck an. Sie bekommen eine enge Auswahl finaler Bilder.",
    },
    {
      question: "Können wir ein ganzes Team an einem Tag fotografieren?",
      answer:
        "Ja. Die Termine liegen nacheinander, jedes Porträt bleibt kurz. Wie viele Personen an einem Tag passen, hängt vom Zeitfenster ab und wird vorher festgelegt.",
    },
  ],
  en: [
    {
      question: "Where do you photograph business portraits?",
      answer: `At the Hagen studio, ${hagen}, at the Solingen studio, ${solingen}, or at your office in North Rhine-Westphalia.`,
    },
    {
      question: "Who are the portraits for?",
      answer:
        "For leadership, teams, and people with their own brand. The work is business photographs, staff photographs, and LinkedIn portraits.",
    },
    {
      question: "What does a business portrait cost?",
      answer: priceSentence("en"),
    },
    {
      question: "How does a session run?",
      answer:
        "We agree use and tone, then light and background. I direct posture and expression. You receive a tight edit of final photographs.",
    },
    {
      question: "Can a whole team be photographed in one day?",
      answer:
        "Yes. Sittings run one after another, and each portrait stays short. How many people fit depends on the window of time and is agreed beforehand.",
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
  if (slug === "business-portraits") return businessSections[locale];
  if (slug === "wedding") return weddingSections[locale];
  return [];
}

export function getPageFaqs(slug: CategorySlug, locale: Locale): FAQItem[] {
  if (slug === "business-portraits") return businessFaqs[locale];
  if (slug === "wedding") return weddingFaqs[locale];
  return [];
}

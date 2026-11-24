import type { FAQItem, CategorySlug } from "../content";
import { appointmentOnlyLabel } from "../contact";
import { serviceSurfaceCopy, surfaceFor } from "../serviceSurface";
import { printsPath, solingenStudioPath } from "../routes";
import { formatStudioLine, HAGEN_STUDIO, SOLINGEN_STUDIO, studioSittingPriceAnswer } from "../site";
import { portalCategoryUrl } from "../subdomains";
import { withLocale, type Locale } from "./config";
import { absoluteUrl } from "./seo";

function solingenHref(locale: Locale) {
  return absoluteUrl(withLocale(solingenStudioPath(locale), locale));
}

function filmHref(locale: Locale) {
  return portalCategoryUrl("cinematography", { locale });
}

export type PageSection = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  links?: { href: string; label: string }[];
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
        `Wenn das Standesamt in Solingen oder das Standesamt in Hagen der ganze Termin ist, bleibt der Umfang überschaubar. Wenn danach ein Essen oder ein Spaziergang folgt, erweitern wir die Reportage. Die Trauung fotografiere ich dort, wo Sie heiraten, nicht im Studio. Porträts nach der Trauung können auch im Studio entstehen.`,
        "Die standesamtliche Trauung ist ein eigener Teil der Hochzeitsfotografie, mit derselben ruhigen Bildsprache wie die freie Trauung und der ganze Tag.",
      ],
    },
    {
      id: "hochzeitsvideo",
      eyebrow: "Film",
      title: "Hochzeitsvideo aus derselben Reportage",
      paragraphs: [
        "Fotos und Film gehören für viele Paare zusammen. Auf Wunsch entsteht am selben Tag ein Hochzeitsfilm, mit derselben ruhigen Bildsprache wie die Fotos.",
        "Foto und Film planen wir in einem Gespräch, und Sie erhalten ein gemeinsames Angebot.",
      ],
      links: [
        {
          href: filmHref("de"),
          label: "Zur Filmproduktion",
        },
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
        `When the ceremony in Solingen or Hagen is the whole booking, the coverage stays compact. When a meal or a walk follows, we extend the reportage. The ceremony is photographed where you marry, not in the studio. Portraits after the ceremony can also be made in the studio.`,
        "A civil ceremony is its own part of the wedding coverage, not a footnote. A symbolic ceremony and a full day stay in the same visual language.",
      ],
    },
    {
      id: "wedding-film",
      eyebrow: "Film",
      title: "A wedding film from the same reportage",
      paragraphs: [
        "Photographs and film belong together for many couples. A wedding film from the same day can be added, in the same calm visual language as the photographs.",
        "We plan the photographs and the film in one conversation, and you receive one quote.",
      ],
      links: [
        {
          href: filmHref("en"),
          label: "Film production",
        },
      ],
    },
  ],
};

const businessFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Wo entstehen die Business-Porträts?",
      answer: `In der Regel im Studio Hagen, ${hagen}, etwa 40 m². Das Studio Solingen, ${solingen}, hat etwa 100 m² und nimmt größere Produktionen, Projekte und Teams auf, die im Studio Hagen zu groß wären. Für ein Shooting schreiben Sie bitte vorher, damit ein Termin liegt. Das Studio kann auch gemietet werden. Sitzungen im Büro in Nordrhein-Westfalen bleiben möglich.`,
      linkHref: solingenHref("de"),
      linkLabel: "Fotostudio Solingen",
    },
    {
      question: "Für wen sind die Porträts gedacht?",
      answer:
        "Für Geschäftsführung, Teams und Menschen mit einer eigenen Marke: Businessfotos, Mitarbeiterfotos, Firmenfotos und LinkedIn-Profilbilder.",
    },
    {
      question: "Was kostet ein Business-Porträt?",
      answer:
        "Das Honorar richtet sich nach Personenzahl, Ort und Umfang. Für die Preise fordern Sie ein Angebot über das Kontaktformular, per E-Mail oder per WhatsApp an.",
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
      answer: `Usually at the Hagen studio, ${hagen}, about 40 m². The Solingen studio, ${solingen}, is about 100 m² and can handle larger productions, projects and teams that would be too big for the Hagen studio. To book a shoot, please contact us to schedule an appointment before coming. The studio can also be rented. Sessions at your office in North Rhine-Westphalia are still possible.`,
      linkHref: solingenHref("en"),
      linkLabel: "Solingen studio",
    },
    {
      question: "Who are the portraits for?",
      answer:
        "For leadership, teams, and people with their own brand. The work is business photographs, staff photographs, and LinkedIn portraits.",
    },
    {
      question: "What does a business portrait cost?",
      answer:
        "The fee depends on the number of people, the location, and the scope. For pricing, request a quote by contact form, email or WhatsApp.",
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
    {
      question: "Was kostet die Hochzeitsfotografie?",
      answer:
        "Das Honorar richtet sich nach Dauer, Ort und Umfang: nur das Standesamt, die freie Trauung, der ganze Tag, und ob ein Hochzeitsvideo dazukommt. Für die Preise fordern Sie ein Angebot über das Kontaktformular, per E-Mail oder per WhatsApp an.",
    },
    {
      question: "Wie läuft der Tag ab?",
      answer:
        "Vorher sprechen wir über den Ablauf, die Orte und wer dabei ist. Am Tag folge ich Ihrem Plan, von der Vorbereitung über die Trauung bis zur Feier. Nichts wird für die Kamera nachgestellt. Danach bekommen Sie eine enge Auswahl.",
    },
    {
      question: "Fotografieren Sie am Standesamt Hagen und am Standesamt Solingen?",
      answer:
        "Ja. Das Standesamt Hagen und das Standesamt Solingen gehören zur regelmäßigen Arbeit, ebenso Trauungen in der Umgebung, an dem Ort, den Sie gewählt haben. Die Zeremonie wird dort fotografiert, nicht ins Studio verlegt.",
    },
    {
      question: "Bieten Sie auch Hochzeitsvideos an?",
      answer:
        "Ja. Das Hochzeitsvideo entsteht am selben Tag wie die Fotos und wird in der Filmproduktion geschnitten, mit derselben ruhigen Haltung. Beides kann in einem Gespräch geplant werden.",
      linkHref: filmHref("de"),
      linkLabel: "Zur Filmproduktion",
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
    {
      question: "What does wedding photography cost?",
      answer:
        "The fee follows the length, the place, and the scope: the registry office only, a symbolic ceremony, the full day, and whether a wedding film is included. For pricing, request a quote by contact form, email or WhatsApp.",
    },
    {
      question: "How does the day run?",
      answer:
        "Beforehand we talk through the order of the day, the places, and who will be there. On the day I follow your plan, from getting ready through the ceremony to the celebration. Nothing is restaged for the camera. Afterwards you receive a tight edit.",
    },
    {
      question: "Do you photograph at the registry office in Hagen and in Solingen?",
      answer:
        "Yes. The registry office in Hagen and the registry office in Solingen are regular parts of the work, as are ceremonies nearby, at the place you have chosen. The ceremony is photographed there, not moved into the studio.",
    },
    {
      question: "Do you also make wedding films?",
      answer:
        "Yes. The wedding film is made on the same day as the photographs and is edited with the film production, in the same calm register. Both can be planned in one conversation.",
      linkHref: filmHref("en"),
      linkLabel: "Film production",
    },
  ],
};

const commercialSections: Record<Locale, PageSection[]> = {
  de: [
    {
      id: "ki-bildwelten",
      eyebrow: "KI-Bildwelten",
      title: "KI-Bildwelten, klar gekennzeichnet",
      paragraphs: [
        "Für Marken, Hotels und Restaurants entstehen neben den fotografierten Bildern auch KI-Bildwelten. Jedes KI-erzeugte Bild ist als KI-Bildwelt gekennzeichnet.",
        "Ob Kampagnenmotiv, Hotelwand oder Social-Media-Serie: KI-Bildwelten ergänzen Ihre Fotos dort, wo eine Fotografie an Grenzen stößt. Jedes KI-Bild ist klar gekennzeichnet.",
      ],
      links: [{ href: withLocale(printsPath("de"), "de"), label: "Wandbilder & Metalldrucke" }],
    },
  ],
  en: [
    {
      id: "ai-image-worlds",
      eyebrow: "AI image worlds",
      title: "AI image worlds, clearly labelled",
      paragraphs: [
        "For brands, hotels, and restaurants, photographed work can sit beside AI image worlds. Every AI-generated picture is labelled as an AI image world.",
        "For a campaign picture, a hotel wall or a social series: AI image worlds extend your photographs where a camera reaches its limit. Every AI picture is clearly labelled.",
      ],
      links: [{ href: withLocale(printsPath("en"), "en"), label: "Wall art and metal prints" }],
    },
  ],
};

export function getPageFaqs(slug: CategorySlug, locale: Locale, host?: string | null): FAQItem[] {
  return serviceSurfaceCopy(slug, locale, host)?.faqs ?? [];
}

export function getPageSections(slug: CategorySlug, locale: Locale, host?: string | null): PageSection[] {
  if (slug === "wedding" && surfaceFor(slug, host) === "niche") return weddingSections[locale];
  if (slug === "commercial") return commercialSections[locale];
  return [];
}

const studioFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Wo entstehen Bewerbungsfotos und Passbilder?",
      answer: `Im Studio Hagen, ${hagen}, etwa 40 m². Studio Hagen bietet Bewerbungsfotos und Passbilder.`,
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
      answer: `At the Hagen studio, ${hagen}, about 40 m². Studio Hagen offers application and passport photos.`,
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

const realEstateFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Wie schnell bekomme ich die Bilder?",
      answer: "Den Lieferzeitpunkt legen wir im Angebot fest.",
    },
    {
      question: "Passen die Dateien für die Portale?",
      answer: "Ja, Exporte für ImmoScout24, Immowelt, Ihre Website und Social Media.",
    },
  ],
  en: [
    {
      question: "How quickly do I get the pictures?",
      answer: "The delivery date is set in the quote.",
    },
    {
      question: "Will the files work on the portals?",
      answer: "Yes. Exports for ImmoScout24, Immowelt, your website, and social media.",
    },
  ],
};

const foodFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Können Sie in unserer Küche fotografieren?",
      answer: "Ja. Termine sind vor Ort oder im Studio möglich.",
    },
    {
      question: "Gibt es Unterstützung beim Styling?",
      answer: "Ja. Styling und die Planung der Requisiten können dazugehören.",
    },
  ],
  en: [
    {
      question: "Can you shoot in our kitchen?",
      answer: "Yes, sessions can be run on location or in a controlled studio setup.",
    },
    {
      question: "Do you provide styling support?",
      answer: "Yes, styling direction and prop planning can be included.",
    },
  ],
};

const filmFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Liefern Sie auch Hochformat?",
      answer: "Ja. Hochformat, Quadrat und Querformat sind möglich.",
    },
    {
      question: "Ist der Schnitt dabei?",
      answer: "Ja. Schnitt und Color Grading gehören zur Produktion.",
    },
  ],
  en: [
    {
      question: "Do you deliver vertical edits?",
      answer: "Yes, vertical, square, and widescreen edits are all supported.",
    },
    {
      question: "Is editing included?",
      answer: "Yes. The edit and the grade are part of the production.",
    },
  ],
};

const socialFaqs: Record<Locale, FAQItem[]> = {
  de: [
    {
      question: "Welche Kanäle betreuen Sie?",
      answer: "Instagram, TikTok, LinkedIn und Facebook.",
    },
    {
      question: "Schreiben Sie Texte und Hashtags?",
      answer: "Ja. Zu betreuten Beiträgen gehören Text und Hashtags.",
    },
  ],
  en: [
    {
      question: "Which platforms do you manage?",
      answer: "Instagram, TikTok, LinkedIn, and Facebook management are available.",
    },
    {
      question: "Do you provide captions and hashtags?",
      answer: "Yes, every managed post includes tailored copy and hashtag support.",
    },
  ],
};

import {
  categoryContentMap,
  sharedAbout,
  type CategoryContent,
  type CategorySlug,
  type ServiceItem,
} from "../content";
import type { Locale } from "./config";
import { getDictionarySync } from "./getDictionary";

const germanSharedAbout = {
  title: "Über mich",
  description: `Ich bin Aaron Bowser, visueller Storyteller und professioneller Immobilienfotograf mit Sitz in Hagen, Nordrhein-Westfalen. Meine Arbeit umfasst Hochzeit, Commercial, Editorial und Immobilienfotografie – stets mit filmischer Bildsprache und authentischer Emotion.

Ob ich einen einmaligen Moment festhalte, eine persönliche Marke forme oder ein Immobilienexposé aufwerte: Jedes Projekt wird mit Intention, Handwerk und dem Anspruch angegangen, Bilder zu schaffen, die zeitlos und wahrhaftig wirken.

Bei Interior- und Immobilienaufnahmen helfe ich Maklern, Entwicklern und Eigentümern, Interessenten in Käufer zu verwandeln. Von gemütlichen Wohnungen bis zu modernen Gewerbeflächen zeige ich Charakter, Licht und Potenzial jedes Raums. Mit präziser Lichtführung, sorgfältiger Nachbearbeitung und einem klaren Client-Erlebnis liefern wir verkaufsstarke, marktreife Bilder – schnell und zuverlässig.`,
};

const germanCategoryCopy: Partial<
  Record<
    CategorySlug,
    {
      navLabel: string;
      title: string;
      subtitle: string;
      aboutText: string;
      services?: Array<{ title: string; description: string }>;
    }
  >
> = {
  "real-estate": {
    navLabel: "Immobilien",
    title: "Immobilienfotografie",
    subtitle:
      "Immobilienbilder, die Exposés aufwerten und Kaufinteresse beschleunigen.",
    aboutText:
      "Meine Immobilienarbeit fokussiert Raum, Licht und Perspektive – damit jede Immobilie einladend, präzise und premium wirkt.",
    services: [
      {
        title: "Innenaufnahmen",
        description:
          "Wir zeigen Raumfluss, Tageslicht und architektonische Details – hell, einladend und so, dass sich Käufer das Leben vor Ort vorstellen können.",
      },
      {
        title: "Außenaufnahmen",
        description:
          "Maximale Außenwirkung durch Architektur, Landschaft und Umgebung – mit präzisen Winkeln und optimalem Licht.",
      },
      {
        title: "Twilight Sessions",
        description: "Golden Hour und Abendstimmungen für starke Hero-Bilder im Exposé.",
      },
      {
        title: "Makler-Branding",
        description: "Porträts und Branding für Agenturen und Vertriebsteams.",
      },
      {
        title: "Drohnenfotografie",
        description: "Luftaufnahmen für Lage, Grundstück und Umfeld.",
      },
      {
        title: "360°-Virtuelle Touren",
        description: "Immersive Rundgänge, die Interessenten digital durch die Immobilie führen.",
      },
      {
        title: "Highlight-Videos",
        description: "Kurze, filmische Videos für Portale und Social Media.",
      },
      {
        title: "Digitales Homestaging",
        description:
          "Leere Räume werden mit realistischem digitalem Mobiliar zum einladenden Zuhause.",
      },
    ],
  },
  commercial: {
    navLabel: "Commercial",
    title: "Commercial & Editorial",
    subtitle:
      "Mit Studio in Solingen und Basis in Hagen, NRW – Düsseldorf, Köln und Umgebung. High-End Commercial- und Creative-Fotografie für Models, Marken und Kampagnen.",
    aboutText:
      "Meine Commercial-Arbeit verbindet Editorial-Storytelling mit Modeästhetik – cinematic, präzise und publikationsreif.",
  },
  wedding: {
    navLabel: "Hochzeit",
    title: "Hochzeitsfotografie",
    subtitle: "Zeitloses Storytelling für intime Momente und große Feiern.",
    aboutText:
      "Ich fotografiere Hochzeiten cinematic und ehrlich – natürliche Emotionen und durchdachte Details von Anfang bis Ende.",
  },
  food: {
    navLabel: "Food",
    title: "Food-Fotografie",
    subtitle: "Geschmacksstarke Bilder für Restaurants, Marken und Produkte.",
    aboutText:
      "Food-Fotografie mit Fokus auf Textur, Licht und Appetite Appeal für Print und Digital.",
  },
  "business-portraits": {
    navLabel: "Business-Porträts",
    title: "Business-Porträts",
    subtitle: "Professionelle Headshots und Branding-Porträts für moderne Teams.",
    aboutText:
      "Klar, selbstbewusst und markenkonform – Porträts, die Leadership und Persönlichkeit zeigen.",
  },
  cinematography: {
    navLabel: "Film & Video",
    title: "Filmproduktion",
    subtitle: "Bewegtbild für Marken, Events und visuelle Kampagnen.",
    aboutText:
      "Von Brand Films bis Social Reels: Motion mit klarer Erzählung und starker Bildsprache.",
  },
  "social-media-management": {
    navLabel: "Social Media",
    title: "Social-Media-Management",
    subtitle: "Strategie, Publishing und Optimierung für konsistenten Content.",
    aboutText:
      "Kreation und Strategie für Marken, die regelmäßig und messbar wachsen wollen.",
  },
};

function localizeServices(
  services: ServiceItem[],
  overrides?: Array<{ title: string; description: string }>
): ServiceItem[] {
  if (!overrides?.length) return services;
  return services.map((service, index) => {
    const override = overrides[index];
    if (!override) return service;
    return {
      ...service,
      title: override.title,
      description: override.description,
    };
  });
}

export function getLocalizedCategory(slug: CategorySlug, locale: Locale): CategoryContent {
  const base = categoryContentMap[slug];
  const dict = getDictionarySync(locale);
  if (locale !== "de") {
    return {
      ...base,
      navLabel: dict.home.niches[slug as keyof typeof dict.home.niches] ?? base.navLabel,
    };
  }

  const copy = germanCategoryCopy[slug];
  if (!copy) return base;

  return {
    ...base,
    navLabel: copy.navLabel,
    title: copy.title,
    subtitle: copy.subtitle,
    aboutText: copy.aboutText,
    services: localizeServices(base.services, copy.services),
  };
}

export function getLocalizedSharedAbout(locale: Locale) {
  if (locale === "de") return germanSharedAbout;
  return sharedAbout;
}

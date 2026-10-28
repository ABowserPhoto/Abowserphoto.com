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
  description: `Ich bin Aaron Bowser, Fotograf für Business-Porträts, Hochzeiten, Commercial und Immobilien in Nordrhein-Westfalen. Das Hauptstudio in Hagen hat etwa 40 m²; dort arbeite ich täglich. Das Studio Solingen, etwa 100 m², ist für größere Produktionen und nur nach Termin. Die Arbeit umfasst Hochzeit, Commercial, Editorial und Immobilienfotografie, mit filmischer Bildsprache und authentischer Emotion.

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
    title: "Immobilienfotografie NRW",
    subtitle:
      "Immobilienbilder für Exposés in Nordrhein-Westfalen, mit Studios in Hagen und Solingen.",
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
    title: "Commercial-Fotografie in Hagen & Solingen",
    subtitle:
      "Fashion, Beauty, Produkt und Editorial für Marken. Größere Produktionen im Studio Solingen, nur nach Termin, sonst im Studio Hagen oder vor Ort in Nordrhein-Westfalen.",
    aboutText:
      "Meine Commercial-Arbeit verbindet Editorial-Storytelling mit einer klaren Modeästhetik: cinematic, präzise und publikationsreif. Das Hauptstudio in Hagen hat etwa 40 m²; Aaron arbeitet dort täglich. Größere Produktionen und Sets kommen ins Studio Solingen, etwa 100 m², nur nach Termin. Das Studio kann auch gemietet werden.",
    services: [
      {
        title: "Porträts und Model-Portfolios",
        description:
          "Ein gewöhnliches Kopfbild trägt eine künstlerische Identität selten. Ich fotografiere individuelle Porträts und editorial angelegte Serien, die Ihre Bandbreite zeigen. Ob der Einstieg in die Modelbranche oder der Aufbau einer eigenen Bildmarke: Wir entwickeln ein Portfolio, das Agenturen und Artdirectors ernst nehmen.",
      },
      {
        title: "Fashion-Fotografie",
        description:
          "Von Lookbooks bis zur Kampagne fotografiere ich Mode so, dass Schnitt, Bewegung und Haltung sichtbar werden. Die Bilder sind für Marken und Designer gemacht, die in einem vollen Markt erkennbar bleiben wollen.",
      },
      {
        title: "Beauty",
        description:
          "Beauty lebt von Licht und von Details. Ich fotografiere klare Beauty- und Makroaufnahmen für Kosmetik, Pflege und Make-up, in denen Textur, Farbe und Technik lesbar bleiben.",
      },
      {
        title: "Produktfotografie",
        description:
          "Das Produktbild ist oft der erste Kontakt. Ich fotografiere präzise Produktbilder, von klaren Aufnahmen für den Shop bis zu inszenierten Sets, die die Marke auf der Website und in der Kampagne tragen.",
      },
      {
        title: "Editorial",
        description:
          "Editorial-Fotografie erzählt mehr als ein einzelnes schönes Bild. Wir entwickeln konzeptionelle, magazinreife Serien für Publikationen, Markengeschichten und Kampagnen mit einer filmischen Haltung.",
      },
    ],
  },
  wedding: {
    navLabel: "Hochzeit",
    title: "Hochzeitsfotograf Hagen & Solingen",
    subtitle:
      "Reportage für die freie Trauung, den ganzen Tag und das Standesamt in Solingen und Hagen.",
    aboutText:
      "Ich fotografiere Hochzeiten in Hagen, Solingen und in Nordrhein-Westfalen, cinematic und ehrlich. Natürliche Emotion und die Details, die zu den Menschen im Raum gehören, vom Standesamt bis zum Ende des Tages.",
    services: [
      {
        title: "Ganztägige Reportage",
        description: "Begleitung von der Vorbereitung bis zur Feier, dokumentarisch und mit filmischer Bildsprache.",
      },
      {
        title: "Standesamt",
        description:
          "Ruhige Reportage der standesamtlichen Trauung in Solingen, Hagen und der Umgebung. Kurze Wege, keine gestellte Zeremonie, Bilder vom Ablauf und von den Menschen.",
      },
      {
        title: "Paarshooting vor der Hochzeit",
        description: "Porträts vor dem Tag, angelegt an Ihre Geschichte und an die Orte, die Ihnen gehören.",
      },
      {
        title: "Album",
        description: "Ein gedrucktes Album mit einer klaren Abfolge, nicht mit einer losen Bildersammlung.",
      },
    ],
  },
  food: {
    navLabel: "Food",
    title: "Food-Fotografie in NRW",
    subtitle: "Bilder für Restaurants, Speisekarten und Produkte, aus den Studios in Hagen und Solingen oder vor Ort.",
    aboutText:
      "Food-Fotografie mit Blick auf Textur, Licht und Appetit, für Karte, Packung und Bildschirm.",
    services: [
      {
        title: "Speisekarten",
        description: "Bilder, die auf der gedruckten Karte und auf der Website gleich lesbar bleiben.",
      },
      {
        title: "Inszenierte Produktsets",
        description: "Aufbauten für Kampagnen und Verpackungen, mit klarer Farbe und ruhiger Fläche.",
      },
      {
        title: "Serien für Social Media",
        description: "Wiederkehrende, kurze Sets für Kanäle, die regelmäßig neues Bildmaterial brauchen.",
      },
    ],
  },
  "business-portraits": {
    navLabel: "Business-Porträts",
    title: "Business-Porträts in Hagen & Solingen",
    subtitle:
      "Executive-Headshots, Mitarbeiterfotos und LinkedIn-Profilbilder für Unternehmen in Hagen, Solingen und Nordrhein-Westfalen.",
    aboutText:
      "Ich bin Aaron Bowser und fotografiere Business-Porträts, Hochzeiten und Commercial. Das Hauptstudio liegt in Hagen, Eckeseyer Str. 133, auf etwa 40 m². Dort arbeite ich täglich, und Porträt- sowie Business-Sitzungen finden in der Regel hier statt. Das Studio Solingen, Merscheider Str. 112, hat etwa 100 m² und ist für größere Produktionen gedacht, zum Beispiel Teams und aufwendigere Sets, nur nach Termin. Es kann auch gemietet werden. Studio Solingen – mehr erfahren; die eigene Seite folgt.\n\nFür Unternehmen geht es um Bilder, die auf der Website, bei LinkedIn und in der Presse dieselbe ruhige Haltung haben: klares Licht, ein Gesicht, das man ernst nimmt, und eine Bildsprache, die zum Haus passt. Vor der Aufnahme klären wir, wo die Porträts erscheinen und wen sie zeigen sollen. Im Shooting leite ich Haltung und Ausdruck an.",
    services: [
      {
        title: "Executive-Headshots",
        description:
          "Porträts für Geschäftsführung und Partner. Licht, Haltung und Ausdruck werden so geführt, dass dieselbe Person auf der Website, in der Präsentation und bei LinkedIn klar lesbar ist.",
      },
      {
        title: "Mitarbeiterfotos",
        description:
          "Einzelporträts der Mitarbeitenden mit gleichem Licht, gleichem Ausschnitt und gleichem Ton – damit die Teamseite wie aus einer Sitzung wirkt.",
      },
      {
        title: "Teamfotos",
        description:
          "Gruppen- und Teamaufnahmen für Website, Angebote und Presse – fotografiert, wenn das Team beisammen ist, im Studio oder im Büro.",
      },
      {
        title: "LinkedIn-Profilbilder",
        description:
          "Corporate Headshots, die als LinkedIn-Profilbild funktionieren und auf der eigenen Website trotzdem nach derselben Person aussehen – für Berater, Sprecher und Spezialisten.",
      },
      {
        title: "Business-Porträts im Büro",
        description:
          "Wenn das Team nicht ins Studio kommt, wird das Licht im Büro aufgebaut – in Hagen, Solingen und Nordrhein-Westfalen. Eine Serie, die danach wie aus einem Guss aussieht.",
      },
    ],
  },
  studio: {
    navLabel: "Bewerbungsfotos",
    title: "Bewerbungsfotos und Passbilder in Hagen",
    subtitle: "Bewerbungsfotos und biometrische Passbilder im Studio Hagen, Eckeseyer Str. 133.",
    aboutText:
      "Ich bin Aaron Bowser. Bewerbungsfotos und Passbilder entstehen im Studio Hagen, Eckeseyer Str. 133, auf etwa 40 m². Dort arbeite ich täglich, und diese Termine werden hier gebucht.\n\nEin Bewerbungsfoto und ein Passbild sind zwei verschiedene Bilder. Für die Bewerbung klären wir, wo das Foto erscheinen soll, danach leite ich Haltung und Ausdruck an. Das Passbild folgt den aktuellen biometrischen Vorgaben: frontal, mit neutralem Ausdruck, vor einem einfarbigen Hintergrund. Beides kann in einem Termin entstehen.",
    services: [
      {
        title: "Bewerbungsfotos",
        description:
          "Porträts für Bewerbung, Lebenslauf und Firmenprofil. Licht, Hintergrund und Ausdruck richten sich danach, wo das Bild verwendet wird.",
      },
      {
        title: "Passbilder",
        description:
          "Biometrische Aufnahmen für Reisepass, Personalausweis und Visum. Das Porträt ist frontal, der Ausdruck neutral, der Hintergrund einfarbig, nach den aktuellen amtlichen Vorgaben.",
      },
      {
        title: "LinkedIn- und Xing-Porträts",
        description:
          "Ein Porträt aus demselben Termin, das als Profilbild funktioniert, damit die Person in der Bewerbung und im Profil dieselbe bleibt.",
      },
    ],
  },
  cinematography: {
    navLabel: "Film & Video",
    title: "Filmproduktion",
    subtitle: "Bewegtbild für Marken, Events und Kampagnen, aus Hagen und Solingen.",
    aboutText:
      "Von Brand Films bis zu kurzen Social-Filmen: Bewegung mit klarer Erzählung und einer ruhigen Bildsprache.",
    services: [
      {
        title: "Brand Films",
        description: "Filme für Markenauftritt und Launch, mit einer Erzählung, die zum Unternehmen passt.",
      },
      {
        title: "Eventfilme",
        description: "Kurze Highlights und eine dokumentarische Begleitung von Veranstaltungen.",
      },
      {
        title: "Social Reels",
        description: "Kurze, filmische Schnitte für die Formate, in denen die Marke täglich sichtbar ist.",
      },
    ],
  },
  "social-media-management": {
    navLabel: "Social Media",
    title: "Social-Media-Management",
    subtitle: "Planung, Veröffentlichung und Pflege für Marken mit einem festen visuellen Auftritt.",
    aboutText:
      "Kreation und Planung für Marken, die regelmäßig veröffentlichen und den Auftritt messen wollen.",
    services: [
      {
        title: "Redaktionspläne",
        description: "Ein monatlicher Plan, der zu Zielgruppe und Auftrag passt.",
      },
      {
        title: "Kanäle führen",
        description: "Veröffentlichen, Texte schreiben und die Kommentare im Blick behalten.",
      },
      {
        title: "Auswertung",
        description: "Ein Bericht, der zeigt, was getragen hat und was als Nächstes angepasst wird.",
      },
    ],
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

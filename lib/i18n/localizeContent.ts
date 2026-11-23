import { appointmentOnlyLabel, HAGEN_ADDRESS } from "../contact";
import { applicationPhotoPriceLine, passportPhotoPriceLine } from "../site";
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
};

const germanCategoryCopy: Partial<
  Record<
    CategorySlug,
    {
      navLabel: string;
      title: string;
      subtitle: string;
      aboutText: string;
      services?: Array<{ title: string; description: string; badge?: string }>;
    }
  >
> = {
  "real-estate": {
    navLabel: "Immobilien",
    title: "Immobilienfotografie NRW",
    subtitle:
      "Immobilienbilder für Exposés in Nordrhein-Westfalen, mit Studios in Hagen und Solingen.",
    aboutText: `Für Makler in Hagen, Solingen und ganz NRW. Ein Termin, klare Pakete, Fotos innerhalb von 24 Stunden.

Ich bin Aaron Bowser, Immobilienfotograf aus Hagen, und fotografiere Wohnungen, Häuser und Gewerbeflächen in Hagen, Solingen und ganz NRW. Mir geht es um Raum, Licht und Perspektive: Bilder, die eine Immobilie einladend und zugleich ehrlich zeigen, so wie Interessenten sie bei der Besichtigung erleben.

Ich arbeite für Makler, Bauträger, Verwalter und Eigentümer. Neben Innen- und Außenaufnahmen gehören Twilight-Aufnahmen, Drohnenfotos, Drohnenvideo, 360°-Rundgänge, kurze Filme und gekennzeichnetes virtuelles Homestaging dazu. Drohnenfotos und Drohnenvideo sind ein optionales Extra: Die Drohnenfotos werden auf das Fotopaket angerechnet, die Drohnenaufnahmen fließen in das Video ein. Pakete und Preise stehen im Kundenkonto.`,
    services: [
      {
        title: "Foto",
        description:
          "Exposé-Fotos im Umfang des Fotopakets, das Sie im Kundenkonto wählen, mit HDR-Bearbeitung und gekennzeichneten virtuellen Einrichtungen. Die Fotos sind innerhalb von 24 Stunden da.",
      },
      {
        title: "Foto + Reel",
        description:
          "Alles aus „Foto“ plus ein Reel im Hochformat von 30–45 Sekunden (Raumtour, Musik, Untertitel). Fotos innerhalb von 24 Stunden, das Reel innerhalb von 48–72 Stunden.",
      },
      {
        title: "Showcase",
        description:
          "Foto und Reel, dazu ein Objekt- oder Maklervideo von 60–90 Sekunden und eine eigene Objektseite mit Fotos, Video, Grundriss und Kontakt. Drohnenfotos und Drohnenvideo können dazugebucht werden.",
      },
      {
        title: "Extras",
        description:
          "Drohnenfotos und Drohnenvideo · 360°-Rundgang · Maklervideo · weitere virtuelle Einrichtung · Twilight-Aufnahmen. Drohnenfotos werden auf das Fotopaket angerechnet. Drohnenaufnahmen fließen in das Video ein.",
      },
      {
        title: "Digitales Homestaging",
        description:
          "Virtuell eingerichtete Bilder kennzeichnen wir sichtbar im Bild („Virtuell eingerichtet“). Wir verändern keine Bausubstanz: Wände, Fenster, Ausblicke oder Mängel werden weder hinzugefügt noch entfernt.",
        badge: "Virtuell eingerichtet",
      },
      {
        title: "360°-Rundgang",
        description: "Ein Extra, nicht Teil von Foto. Ein Rundgang, wenn das Objekt ihn braucht.",
      },
    ],
  },
  commercial: {
    navLabel: "Commercial",
    title: "Commercial-Fotografie in Hagen & Solingen",
    subtitle:
      `Fashion, Beauty, Produkt und Editorial für Marken. Größere Produktionen im Studio Solingen, ${appointmentOnlyLabel("de", { sentence: false })}, sonst im Studio Hagen oder vor Ort in Nordrhein-Westfalen.`,
    aboutText: `Ich bin Aaron Bowser und fotografiere Fashion, Beauty, Produkte, Editorials und Model-Portfolios für Marken, Designer und Agenturen in NRW. Meine Commercial-Fotografie verbindet Editorial-Storytelling mit einer klaren Modeästhetik: filmisch, präzise und publikationsreif.

Kleinere Produktionen entstehen in meinem Studio in Hagen, etwa 40 m², wo ich täglich arbeite. Für größere Sets und Kampagnen steht das Studio Solingen mit etwa 100 m² nach Vereinbarung bereit; es kann auch für eigene Produktionen gemietet werden. Auf Wunsch fotografiere ich auch vor Ort.`,
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
    aboutText: `Ich bin Aaron Bowser, Hochzeitsfotograf aus Hagen, und begleite Paare in Hagen, Solingen und ganz NRW. Ob Standesamt, freie Trauung oder der ganze Tag: Ich fotografiere ruhig, nah und ehrlich, mit filmischer Bildsprache und einem Blick für die echten Momente und die Details, die zu Ihnen gehören.

Vor der Hochzeit lernen wir uns kennen, auf Wunsch auch beim Paarshooting. Am Ende steht eine Geschichte eures Tages, gern als gedrucktes Album. Ein Hochzeitsvideo kann denselben Tag begleiten; es entsteht eigenständig in der Filmproduktion.`,
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
      {
        title: "Hochzeitsvideo",
        description:
          "Ein Film vom selben Tag wie die Fotos: Standesamt, freie Trauung oder der ganze Tag. Der Schnitt bleibt ruhig und entsteht mit der Filmproduktion.",
      },
    ],
  },
  food: {
    navLabel: "Food",
    title: "Food-Fotografie in NRW",
    subtitle: "Bilder für Restaurants, Speisekarten und Produkte, aus den Studios in Hagen und Solingen oder vor Ort.",
    aboutText: `Ich bin Aaron Bowser, Food-Fotograf aus Hagen, und fotografiere für Restaurants, Cafés, Lebensmittelmarken und Produzenten in Hagen, Solingen und ganz NRW. Mich interessieren Textur, Licht und Atmosphäre – Bilder, bei denen man Lust bekommt, sofort zu probieren.

Vom Styling bis zur finalen Farbbearbeitung entstehen Food-Fotos für Speisekarte, Verpackung, Website und Social Media, im Studio in Hagen oder direkt bei Ihnen vor Ort in der Küche.`,
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
    aboutText: `Ich bin Aaron Bowser und fotografiere Business-Porträts, Mitarbeiterfotos, Teamfotos und LinkedIn-Profilbilder für Unternehmen und Selbstständige in Hagen, Solingen und NRW. Mein Studio in Hagen (${HAGEN_ADDRESS.street}, etwa 40 m²) ist mein täglicher Arbeitsort; dort finden Porträtsitzungen in der Regel statt. Für größere Teams und aufwendigere Sets nutze ich das Studio Solingen, etwa 100 m², nach Vereinbarung – oder ich baue das Licht direkt in Ihrem Büro auf.

Vor dem Shooting klären wir, wo die Porträts erscheinen und wen sie zeigen sollen. Während der Sitzung leite ich Haltung und Ausdruck an, damit Website, LinkedIn und Presse dieselbe ruhige, stimmige Bildsprache tragen.`,
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
    navLabel: "Studio Hagen",
    title: "Bewerbungsfotos und Passbilder in Hagen",
    subtitle: `Bewerbungsfotos und biometrische Passbilder im Studio Hagen, ${HAGEN_ADDRESS.street}. Ein Bewerbungsfoto kostet ${applicationPhotoPriceLine("de")}. Ein biometrisches Passfoto kostet ${passportPhotoPriceLine()}.`,
    aboutText: `Ich bin Aaron Bowser. Bewerbungsfotos und biometrische Passbilder mache ich in meinem Studio in Hagen, ${HAGEN_ADDRESS.street}, auf etwa 40 m². Hier arbeite ich jeden Tag, und hier werden diese Termine gebucht.

Für Ihr Bewerbungsfoto klären wir zuerst, wo es erscheinen soll – Lebenslauf, LinkedIn oder Xing –, dann leite ich Haltung und Ausdruck an, damit Sie natürlich und sympathisch wirken. Das Passbild folgt den aktuellen biometrischen Vorgaben für Reisepass, Personalausweis und Visum. Beides geht in einem Termin.

Ein Bewerbungsfoto kostet ${applicationPhotoPriceLine("de")}. Ein biometrisches Passfoto kostet ${passportPhotoPriceLine()}.`,
    services: [
      {
        title: "Bewerbungsfotos",
        description: `Ein Bewerbungsfoto kostet ${applicationPhotoPriceLine("de")}. Porträts für Bewerbung, Lebenslauf und Firmenprofil. Licht, Hintergrund und Ausdruck richten sich danach, wo das Bild verwendet wird.`,
      },
      {
        title: "Passbilder",
        description: `Ein biometrisches Passfoto kostet ${passportPhotoPriceLine()}. Aufnahmen für Reisepass, Personalausweis und Visum. Das Porträt ist frontal, der Ausdruck neutral, der Hintergrund einfarbig, nach den aktuellen amtlichen Vorgaben.`,
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
    aboutText: `Ich bin Aaron Bowser und produziere Imagefilme, Brand Films, Eventfilme und Social Reels für Unternehmen und Marken in Hagen, Solingen und NRW. Mir geht es um eine klare Erzählung, bewusstes Timing, ruhige Kamerabewegungen und ein sorgfältiges Color Grading – damit jeder Film filmisch wirkt und im Marketing wirklich funktioniert.

Gedreht wird bei Ihnen vor Ort, auf Ihrer Veranstaltung oder für größere Sets im Studio Solingen mit etwa 100 m² nach Vereinbarung.`,
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
    aboutText: `Ich bin Aaron Bowser und betreue Social-Media-Kanäle für Unternehmen und Marken in Hagen, Solingen und NRW. Ich verbinde eigene Foto- und Videoproduktion mit Strategie: Redaktionsplan, Veröffentlichung, Texte, Community-Pflege und eine Auswertung, die zeigt, was funktioniert.

So bleibt Ihr Auftritt auf Instagram, LinkedIn und Co. regelmäßig, visuell stimmig und messbar – ohne dass Sie sich jede Woche selbst darum kümmern müssen.`,
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
  overrides?: Array<{ title: string; description: string; badge?: string }>
): ServiceItem[] {
  if (!overrides?.length) return services;
  return services.map((service, index) => {
    const override = overrides[index];
    if (!override) return service;
    return {
      ...service,
      title: override.title,
      description: override.description,
      badge: override.badge ?? service.badge,
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

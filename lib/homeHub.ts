import type { CategorySlug } from "./content";
import type { Locale } from "./i18n/config";

export type HubTile = {
  slug: CategorySlug;
  title: string;
  text: string;
  image: string;
  featured?: boolean;
};

const TILES: Record<Locale, { featured: HubTile[]; middle: HubTile[]; afterStudios: HubTile[]; text: { slug: CategorySlug; title: string }[] }> = {
  de: {
    featured: [
      {
        slug: "wedding",
        title: "Hochzeit",
        text: "Standesamt, freie Trauung oder der ganze Tag, als ruhige, ehrliche Reportage. Auf Wunsch mit Hochzeitsfilm vom selben Tag.",
        image: "/wedding/portfolio/hochzeitsfoto-mariam-1.webp",
        featured: true,
      },
      {
        slug: "real-estate",
        title: "Immobilien",
        text: "Exposé-Fotos, Walk Thru Video und Drohnenaufnahmen für Makler in NRW.",
        image: "/real-estate/hero/immobilienfotografie-nrw-hero.webp",
        featured: true,
      },
    ],
    middle: [
      {
        slug: "cinematography",
        title: "Film & Video",
        text: "Imagefilme, Hochzeitsfilme und Social-Media-Reels, von Konzept bis Schnitt.",
        image: "/og/og-film.jpg",
      },
      {
        slug: "commercial",
        title: "Commercial",
        text: "Fashion, Beauty, Produkt und Editorial für Marken.",
        image: "/commercial/hero/commercial-fotografie-hero.webp",
      },
    ],
    afterStudios: [
      {
        slug: "social-media-management",
        title: "Social Media",
        text: "Redaktionsplan, Content und Betreuung Ihrer Kanäle, mit eigenen Fotos und Videos.",
        image: "/social-media-management/hero/1_social-media-hero-instagram-frame.webp",
      },
    ],
    text: [
      { slug: "business-portraits", title: "Business-Porträts" },
      { slug: "food", title: "Food-Fotografie" },
    ],
  },
  en: {
    featured: [
      {
        slug: "wedding",
        title: "Wedding",
        text: "Registry office, a symbolic ceremony or the full day, as a calm, honest reportage. A wedding film from the same day if you want it.",
        image: "/wedding/portfolio/hochzeitsfoto-mariam-1.webp",
        featured: true,
      },
      {
        slug: "real-estate",
        title: "Real estate",
        text: "Listing photos, Walk Thru Video and drone footage for agents in NRW.",
        image: "/real-estate/hero/immobilienfotografie-nrw-hero.webp",
        featured: true,
      },
    ],
    middle: [
      {
        slug: "cinematography",
        title: "Film & video",
        text: "Brand films, wedding films and social reels, from concept to edit.",
        image: "/og/og-film.jpg",
      },
      {
        slug: "commercial",
        title: "Commercial",
        text: "Fashion, beauty, product and editorial for brands.",
        image: "/commercial/hero/commercial-fotografie-hero.webp",
      },
    ],
    afterStudios: [
      {
        slug: "social-media-management",
        title: "Social media",
        text: "A content plan, the pictures and care of your channels, with our own photographs and videos.",
        image: "/social-media-management/hero/1_social-media-hero-instagram-frame.webp",
      },
    ],
    text: [
      { slug: "business-portraits", title: "Business portraits" },
      { slug: "food", title: "Food photography" },
    ],
  },
};

export function homeHubGroups(locale: Locale) {
  return TILES[locale];
}

export function homeStudioLine(locale: Locale) {
  if (locale === "de") {
    return {
      hagen: "Hagen: Bewerbungsfotos 29 €, Passbilder 15 €.",
      solingen: "Solingen: Studiomiete 54 €/Std.",
    };
  }
  return {
    hagen: "Hagen: application photos €29, passport photos €15.",
    solingen: "Solingen: studio rental €54/h.",
  };
}

export function homeAboutCopy(locale: Locale) {
  if (locale === "de") {
    return {
      title: "Über Aaron",
      body: "Aaron Bowser fotografiert und filmt in Hagen und Solingen. Marken, Makler und Menschen bekommen einen Ansprechpartner, vom ersten Bild bis zum fertigen Film.",
      awardsLabel: "Auszeichnungen",
      portraitAlt: "Porträt von Aaron Bowser",
    };
  }
  return {
    title: "About Aaron",
    body: "Aaron Bowser photographs and films in Hagen and Solingen. Brands, agents, and people work with one contact, from the first picture to the finished film.",
    awardsLabel: "Awards",
    portraitAlt: "Portrait of Aaron Bowser",
  };
}

export function homePackageCopy(locale: Locale) {
  if (locale === "de") {
    return {
      title: "Ein Ansprechpartner für den ganzen Auftritt",
      body: "Wer ein Produkt oder eine Leistung verkauft, hat bei Aaron einen Ansprechpartner: Produktfotos, Social-Media-Inhalte, Commercial-Bilder, Business-Porträts, Unternehmensstandorte, Werbefilm und Lifestyle-Bilder. Ein komplettes Paket für Marketing und Branding.",
      videoAlt: "Standbild für den kommenden Film von Aaron Bowser Photography",
    };
  }
  return {
    title: "One contact for the whole presence",
    body: "Anyone selling a product or a service has one contact in Aaron: product shots, social content, commercial images, business portraits, company locations, commercial video, and lifestyle images. A complete marketing and branding package.",
    videoAlt: "Poster for the forthcoming film from Aaron Bowser Photography",
  };
}

import type { CategorySlug } from "./content";
import type { Locale } from "./i18n/config";

export type HubTile = {
  slug: CategorySlug;
  title: string;
  text: string;
  image: string;
  /** Large tiles at the top of the landing text box. */
  featured?: boolean;
};

/**
 * Landing order. Business portraits and food stay at the end of the box,
 * after the other services.
 */
const TILES: Record<Locale, HubTile[]> = {
  de: [
    {
      slug: "wedding",
      title: "Hochzeit",
      text: "Reportage für Standesamt, freie Trauung und den ganzen Tag.",
      image: "/wedding/portfolio/hochzeitsfoto-mariam-1.webp",
      featured: true,
    },
    {
      slug: "real-estate",
      title: "Immobilien",
      text: "Fotopaket, Walk Thru Video, Agent Branding Video, Premium Home und Luxury Makler.",
      image: "/real-estate/hero/immobilienfotografie-nrw-hero.webp",
      featured: true,
    },
    {
      slug: "commercial",
      title: "Commercial",
      text: "Fashion, Beauty, Produkt und Editorial für Marken.",
      image: "/commercial/hero/commercial-fotografie-hero.webp",
    },
    {
      slug: "cinematography",
      title: "Film",
      text: "Imagefilme, Brand Films, Hochzeitsvideos und Social Reels.",
      image: "/og/og-film.jpg",
    },
    {
      slug: "social-media-management",
      title: "Social Media",
      text: "Plan, Veröffentlichung und Pflege für einen festen Auftritt.",
      image: "/social-media-management/hero/1_social-media-hero-instagram-frame.webp",
    },
    {
      slug: "studio",
      title: "Studio Hagen",
      text: "Bewerbungsfotos und Passbilder im Studio Hagen.",
      image: "/og/og-studio.jpg",
    },
    {
      slug: "business-portraits",
      title: "Business-Porträts",
      text: "Teams, Profile und Businessfotos im Studio oder bei Ihnen.",
      image: "/business-portraits/hero/businessportrait-hero-frau-flieder-blazer.webp",
    },
    {
      slug: "food",
      title: "Food",
      text: "Für Restaurants, Speisekarten und Produkte, im Studio oder vor Ort.",
      image: "/food/hero/food-hero-1-desktop.jpg",
    },
  ],
  en: [
    {
      slug: "wedding",
      title: "Wedding",
      text: "Reportage for the registry office, a symbolic ceremony, and the full day.",
      image: "/wedding/portfolio/hochzeitsfoto-mariam-1.webp",
      featured: true,
    },
    {
      slug: "real-estate",
      title: "Real estate",
      text: "Photo package, Walk Thru Video, Agent Branding Video, Premium Home, and Luxury Makler.",
      image: "/real-estate/hero/immobilienfotografie-nrw-hero.webp",
      featured: true,
    },
    {
      slug: "commercial",
      title: "Commercial",
      text: "Fashion, beauty, product, and editorial for brands.",
      image: "/commercial/hero/commercial-fotografie-hero.webp",
    },
    {
      slug: "cinematography",
      title: "Film",
      text: "Brand films, wedding films, and social reels.",
      image: "/og/og-film.jpg",
    },
    {
      slug: "social-media-management",
      title: "Social media",
      text: "Planning, publishing, and care for a steady presence.",
      image: "/social-media-management/hero/1_social-media-hero-instagram-frame.webp",
    },
    {
      slug: "studio",
      title: "Studio Hagen",
      text: "Application photos and passport photos at the Hagen studio.",
      image: "/og/og-studio.jpg",
    },
    {
      slug: "business-portraits",
      title: "Business portraits",
      text: "Teams, profiles, and business photographs at the studio or at your office.",
      image: "/business-portraits/hero/businessportrait-hero-frau-flieder-blazer.webp",
    },
    {
      slug: "food",
      title: "Food",
      text: "For restaurants, menus, and products, in the studio or on location.",
      image: "/food/hero/food-hero-1-desktop.jpg",
    },
  ],
};

export function homeHubTiles(locale: Locale) {
  return TILES[locale];
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

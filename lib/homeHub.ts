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
      hagen: "Im Studio Hagen: Bewerbungsfotos (29 €) und biometrische Passbilder (15 €), Mo–Sa 10–20 Uhr, So 09–12 Uhr.",
      solingen: "Solingen: Studiomiete 54 €/Std. (mind. 2 Std.), Halbtag 189 €, Tag 329 €, inkl. 19 % MwSt.",
    };
  }
  return {
    hagen: "Hagen studio: application photos (€29) and biometric passport photos (€15), Mon–Sat 10–20, Sun 09–12.",
    solingen: "Solingen: studio rental €54/h (2 hour minimum), half day €189, full day €329, including 19% VAT.",
  };
}

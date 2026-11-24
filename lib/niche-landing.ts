/**
 * Document title, meta description, and H1 for the five niche hosts that
 * would otherwise repeat the matching www category page.
 * Applied only when the request host is that niche. The www pages keep the
 * dictionary title and the localized category heading.
 */
import { HAGEN_ADDRESS, SOLINGEN_ADDRESS, formatAddressLine } from "./contact";
import type { CategorySlug } from "./content";
import type { Locale } from "./i18n/config";
import { nicheHostForHostname } from "./subdomains";

const hagen = formatAddressLine(HAGEN_ADDRESS);
const solingen = formatAddressLine(SOLINGEN_ADDRESS);

export const NICHE_LANDING_SLUGS = [
  "commercial",
  "real-estate",
  "wedding",
  "food",
  "business-portraits",
] as const satisfies readonly CategorySlug[];

export type NicheLandingSlug = (typeof NICHE_LANDING_SLUGS)[number];

export type NicheLandingCopy = {
  /** Full document title. Not passed through the brand template. */
  title: string;
  description: string;
  h1: string;
  /** Line under the H1 on this host only. The www page keeps its own subtitle. */
  lead?: string;
};

export const NICHE_LANDING_COPY: Record<NicheLandingSlug, Record<Locale, NicheLandingCopy>> = {
  commercial: {
    de: {
      title: "Werbefotograf Hagen | Produktfotografie NRW",
      description: `Werbe- und Produktfotografie für Marken: Lookbook, Beauty und Packshot. Studios ${hagen} und ${solingen}.`,
      h1: "Werbe- und Produktfotografie in Hagen",
    },
    en: {
      title: "Advertising Photographer Hagen | Product NRW",
      description: `Advertising and product photography for brands: lookbook, beauty, packshot. Studios at ${HAGEN_ADDRESS.street}, Hagen and ${SOLINGEN_ADDRESS.street}, Solingen.`,
      h1: "Advertising and Product Photography in Hagen",
    },
  },
  "real-estate": {
    de: {
      title: "Immobilienfotograf Hagen | Exposé-Fotos NRW",
      description: `Immobilienfotos für Makler in Hagen und NRW: Innen, Außen, Dämmerung, Drohne. Studios ${HAGEN_ADDRESS.street} und ${SOLINGEN_ADDRESS.street}.`,
      h1: "Immobilienfotograf für Makler in NRW",
      lead: "Immobilienfotos, die Besichtigungen bringen",
    },
    en: {
      title: "Property Photographer Hagen | Listing Photos",
      description: `Property photography for agents in Hagen and NRW: interiors, exteriors, twilight, and drone. Studios at ${HAGEN_ADDRESS.street} and ${SOLINGEN_ADDRESS.street}.`,
      h1: "Property Photographer for Agents in NRW",
      lead: "Property photos that bring viewings",
    },
  },
  wedding: {
    de: {
      title: "Hochzeitsfotograf Hagen | Reportage in NRW",
      description: `Hochzeitsfotograf für Hagen, Solingen und NRW: Standesamt, freie Trauung, ganzer Tag. Ruhige Reportage aus dem Studio ${hagen}.`,
      h1: "Hochzeitsfotograf für Hagen und NRW",
    },
    en: {
      title: "Wedding Photographer Hagen | NRW Reportage",
      description: `Wedding photographer for Hagen, Solingen and NRW: registry, symbolic ceremony, full day. Calm reportage from ${hagen}.`,
      h1: "Wedding Photographer for Hagen and NRW",
    },
  },
  food: {
    de: {
      title: "Food-Fotograf Hagen | Speisen und Produkte",
      description: `Food-Fotografie für Restaurants und Marken: Speisekarte, Verpackung, Kampagne. Studios ${HAGEN_ADDRESS.street}, Hagen, und ${SOLINGEN_ADDRESS.street}, Solingen.`,
      h1: "Food-Fotografie für Restaurants und Marken",
    },
    en: {
      title: "Food Photographer Hagen | Menus and Products",
      description: `Food photography for restaurants and brands: menus, packaging, campaigns. Studios at ${HAGEN_ADDRESS.street}, Hagen and ${SOLINGEN_ADDRESS.street}, Solingen.`,
      h1: "Food Photography for Restaurants and Brands",
    },
  },
  "business-portraits": {
    de: {
      title: "Mitarbeiterfotos Hagen | Business-Porträts",
      description: `Business-Porträts und Mitarbeiterfotos für Teams und Profile. Hagen, ${HAGEN_ADDRESS.street}, ${HAGEN_ADDRESS.postalCode}; größere Teams in Solingen, ${SOLINGEN_ADDRESS.street}, ${SOLINGEN_ADDRESS.postalCode}.`,
      h1: "Mitarbeiterfotos und Business-Porträts",
    },
    en: {
      title: "Staff Photos Hagen | Business Headshots",
      description: `Business portraits and staff photos for teams and profiles. Hagen studio, ${HAGEN_ADDRESS.street}, ${HAGEN_ADDRESS.postalCode}; larger teams in Solingen, ${SOLINGEN_ADDRESS.street}, ${SOLINGEN_ADDRESS.postalCode}.`,
      h1: "Staff Photos and Business Portraits",
    },
  },
};

export function isNicheLandingSlug(slug: string): slug is NicheLandingSlug {
  return (NICHE_LANDING_SLUGS as readonly string[]).includes(slug);
}

/**
 * Copy for this category when the request is on its own niche host.
 * Returns null on www and on any other host, including the other niches.
 */
export function nicheDocumentCopy(
  slug: CategorySlug,
  locale: Locale,
  host?: string | null
): NicheLandingCopy | null {
  if (!host || !isNicheLandingSlug(slug)) return null;
  const niche = nicheHostForHostname(host);
  if (niche?.slug !== slug) return null;
  return NICHE_LANDING_COPY[slug][locale];
}

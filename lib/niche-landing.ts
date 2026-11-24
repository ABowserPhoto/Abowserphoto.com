/**
 * Document title, meta description, and H1 for niche hosts.
 * The words come from `serviceSurfaceCopy` so the niche page and its
 * metadata stay on the same text. www uses the other surface.
 */
import type { CategorySlug } from "./content";
import type { Locale } from "./i18n/config";
import { serviceSurfaceCopy } from "./serviceSurface";
import { nicheHostForHostname, PORTAL_CATEGORY_SUBDOMAIN } from "./subdomains";

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

function landingFrom(slug: NicheLandingSlug, locale: Locale): NicheLandingCopy {
  const host = `${PORTAL_CATEGORY_SUBDOMAIN[slug]}.abowserphoto.com`;
  const copy = serviceSurfaceCopy(slug, locale, host);
  return {
    title: copy?.title ?? "",
    description: copy?.description ?? "",
    h1: copy?.h1 ?? "",
    lead: copy?.subline,
  };
}

export const NICHE_LANDING_COPY: Record<NicheLandingSlug, Record<Locale, NicheLandingCopy>> = {
  commercial: { de: landingFrom("commercial", "de"), en: landingFrom("commercial", "en") },
  "real-estate": { de: landingFrom("real-estate", "de"), en: landingFrom("real-estate", "en") },
  wedding: { de: landingFrom("wedding", "de"), en: landingFrom("wedding", "en") },
  food: { de: landingFrom("food", "de"), en: landingFrom("food", "en") },
  "business-portraits": {
    de: landingFrom("business-portraits", "de"),
    en: landingFrom("business-portraits", "en"),
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

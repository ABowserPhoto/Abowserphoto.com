import type { CategorySlug } from "./content";
import type { Locale } from "./i18n/config";

export const CATEGORY_SEGMENTS: Record<CategorySlug, Record<Locale, string>> = {
  wedding: { en: "wedding", de: "hochzeitsfotograf" },
  "real-estate": { en: "real-estate", de: "immobilienfotografie" },
  "business-portraits": { en: "business-portraits", de: "business-portraits" },
  studio: { en: "application-photos", de: "bewerbungsfotos" },
  food: { en: "food", de: "food-fotografie" },
  cinematography: { en: "cinematography", de: "filmproduktion" },
  "social-media-management": { en: "social-media-management", de: "social-media" },
  commercial: { en: "commercial", de: "commercial-fotografie" },
};

/** Extra public names that should land on the studio page. */
const STUDIO_ALIASES = new Set(["passbilder", "passfotos", "passport-photos"]);

const segmentToCategory = new Map<string, CategorySlug>();

for (const [slug, segments] of Object.entries(CATEGORY_SEGMENTS) as Array<
  [CategorySlug, Record<Locale, string>]
>) {
  segmentToCategory.set(segments.en, slug);
  segmentToCategory.set(segments.de, slug);
}

export function resolveCategorySegment(segment: string): CategorySlug | null {
  return segmentToCategory.get(segment) ?? (STUDIO_ALIASES.has(segment) ? "studio" : null);
}

export function categorySegment(slug: CategorySlug, locale: Locale) {
  return CATEGORY_SEGMENTS[slug][locale];
}

export function categoryPath(slug: CategorySlug, locale: Locale) {
  return `/${categorySegment(slug, locale)}`;
}

/** Public Solingen studio page. German and English use different slugs. */
export const SOLINGEN_STUDIO_SEGMENTS: Record<Locale, string> = {
  de: "fotostudio-solingen",
  en: "photo-studio-solingen",
};

const solingenStudioSegments = new Set<string>(Object.values(SOLINGEN_STUDIO_SEGMENTS));

export function isSolingenStudioSegment(segment: string) {
  return solingenStudioSegments.has(segment);
}

export function solingenStudioPath(locale: Locale) {
  return `/${SOLINGEN_STUDIO_SEGMENTS[locale]}`;
}

/** Rewrite a locale-less path so the first segment matches the locale's public slug. */
export function localizePublicPath(pathname: string, locale: Locale) {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 0) return "/";

  if (isSolingenStudioSegment(parts[0] ?? "")) {
    parts[0] = SOLINGEN_STUDIO_SEGMENTS[locale];
    return `/${parts.join("/")}`;
  }

  const category = resolveCategorySegment(parts[0]);
  if (!category) return clean === "/" ? "/" : `/${parts.join("/")}`;

  parts[0] = categorySegment(category, locale);
  return `/${parts.join("/")}`;
}

export const LEGAL_PATHS = ["/impressum", "/datenschutz", "/cookie-richtlinie"] as const;

export type LegalPath = (typeof LEGAL_PATHS)[number];

/** Indexable marketing and legal routes, without the locale prefix. */
export function indexablePaths(locale: Locale) {
  const categories = (Object.keys(CATEGORY_SEGMENTS) as CategorySlug[])
    .filter((slug) => slug !== "studio")
    .map((slug) => categoryPath(slug, locale));

  return [
    "/",
    ...categories,
    `${categoryPath("commercial", locale)}/portfolio`,
    solingenStudioPath(locale),
    ...LEGAL_PATHS,
  ];
}

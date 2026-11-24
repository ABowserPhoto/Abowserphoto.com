import { categoryContentMap, type CategorySlug } from "./content";
import type { Locale } from "./i18n/config";
import { withLocale } from "./i18n/config";
import { solingenStudioPath } from "./routes";
import { portalCategoryUrl } from "./subdomains";

export type ServiceNavLink = {
  id: string;
  label: string;
  href: string;
  themeColor: string;
  quiet?: boolean;
};

const ORDER: Array<{
  id: string;
  slug?: CategorySlug;
  quiet?: boolean;
  label: Record<Locale, string>;
  href: (locale: Locale, host?: string | null) => string;
  themeColor: string;
}> = [
  {
    id: "wedding",
    slug: "wedding",
    label: { de: "Hochzeit", en: "Wedding" },
    href: (locale, host) => portalCategoryUrl("wedding", { host, locale }),
    themeColor: categoryContentMap.wedding.themeColor,
  },
  {
    id: "real-estate",
    slug: "real-estate",
    label: { de: "Immobilien", en: "Real Estate" },
    href: (locale, host) => portalCategoryUrl("real-estate", { host, locale }),
    themeColor: categoryContentMap["real-estate"].themeColor,
  },
  {
    id: "cinematography",
    slug: "cinematography",
    label: { de: "Film & Video", en: "Film & Video" },
    href: (locale, host) => portalCategoryUrl("cinematography", { host, locale }),
    themeColor: categoryContentMap.cinematography.themeColor,
  },
  {
    id: "commercial",
    slug: "commercial",
    label: { de: "Commercial", en: "Commercial" },
    href: (locale) => withLocale("/commercial-fotografie", locale).replace("/commercial-fotografie", locale === "de" ? "/commercial-fotografie" : "/commercial"),
    themeColor: categoryContentMap.commercial.themeColor,
  },
  {
    id: "social-media-management",
    slug: "social-media-management",
    label: { de: "Social Media", en: "Social Media" },
    href: (locale, host) => portalCategoryUrl("social-media-management", { host, locale }),
    themeColor: categoryContentMap["social-media-management"].themeColor,
  },
  {
    id: "solingen",
    label: { de: "Fotostudio mieten Solingen", en: "Studio Rental Solingen" },
    href: (locale) => withLocale(solingenStudioPath(locale), locale),
    themeColor: "#322B2B",
  },
  {
    id: "studio",
    slug: "studio",
    label: { de: "Bewerbungsfotos & Passbilder", en: "Application & Passport Photos" },
    href: (locale, host) => portalCategoryUrl("studio", { host, locale }),
    themeColor: categoryContentMap.studio.themeColor,
  },
  {
    id: "business-portraits",
    slug: "business-portraits",
    quiet: true,
    label: { de: "Business-Porträts", en: "Business portraits" },
    href: (locale, host) => portalCategoryUrl("business-portraits", { host, locale }),
    themeColor: categoryContentMap["business-portraits"].themeColor,
  },
  {
    id: "food",
    slug: "food",
    quiet: true,
    label: { de: "Food-Fotografie", en: "Food photography" },
    href: (locale, host) => portalCategoryUrl("food", { host, locale }),
    themeColor: categoryContentMap.food.themeColor,
  },
];

function commercialHref(locale: Locale) {
  return withLocale(locale === "de" ? "/commercial-fotografie" : "/commercial", locale);
}

export function servicePageLinks(locale: Locale, _labels?: unknown, host?: string | null): ServiceNavLink[] {
  return ORDER.map((item) => ({
    id: item.id,
    label: item.label[locale],
    href: item.id === "commercial" ? commercialHref(locale) : item.href(locale, host),
    themeColor: item.themeColor,
    quiet: item.quiet,
  }));
}

export function servicePageHref(slug: CategorySlug, locale: Locale, host?: string | null) {
  const item = ORDER.find((entry) => entry.slug === slug);
  if (!item) return withLocale("/", locale);
  if (item.id === "commercial") return commercialHref(locale);
  return item.href(locale, host);
}

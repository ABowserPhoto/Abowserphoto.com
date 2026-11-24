import { categoryContentMap, type CategorySlug } from "./content";
import type { Locale } from "./i18n/config";
import { withLocale } from "./i18n/config";
import { categoryPath } from "./routes";
import { nicheHostForHostname, PORTAL_CATEGORY_ORDER, portalCategoryUrl } from "./subdomains";

/**
 * Public URL for a service.
 * On a niche host every link stays on that host system.
 * On the main site, application photos stay on studio.* and the other
 * services stay on the localized www path.
 */
export function servicePageHref(slug: CategorySlug, locale: Locale, host?: string | null) {
  const onNiche = Boolean(host && nicheHostForHostname(host));
  if (onNiche || slug === "studio") {
    return portalCategoryUrl(slug, { host, locale });
  }
  return withLocale(categoryPath(slug, locale), locale);
}

export function servicePageLinks(
  locale: Locale,
  labels: Partial<Record<CategorySlug, string>>,
  host?: string | null
) {
  return PORTAL_CATEGORY_ORDER.map((slug) => ({
    slug,
    label: labels[slug] ?? categoryContentMap[slug].navLabel,
    href: servicePageHref(slug, locale, host),
    themeColor: categoryContentMap[slug].themeColor,
  }));
}

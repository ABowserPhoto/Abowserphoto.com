import type { MetadataRoute } from "next";
import { locales, withLocale, type Locale } from "../lib/i18n/config";
import { absoluteUrl } from "../lib/i18n/seo";
import { indexablePaths } from "../lib/routes";
import { nicheOrigin, PORTAL_CATEGORY_SUBDOMAIN } from "../lib/subdomains";

function localizedUrl(locale: Locale, index: number) {
  return absoluteUrl(withLocale(indexablePaths(locale)[index], locale));
}

function studioLanding(locale: Locale) {
  return `${nicheOrigin(PORTAL_CATEGORY_SUBDOMAIN.studio)}/${locale}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = locales.flatMap((locale) =>
    indexablePaths(locale).map((pathname, index) => ({
      url: absoluteUrl(withLocale(pathname, locale)),
      lastModified: new Date(),
      alternates: {
        languages: {
          de: localizedUrl("de", index),
          en: localizedUrl("en", index),
          "x-default": localizedUrl("en", index),
        },
      },
    }))
  );

  const studioDe = studioLanding("de");
  const studioEn = studioLanding("en");
  const studioAlternates = {
    languages: {
      de: studioDe,
      en: studioEn,
      "x-default": studioDe,
    },
  };

  return [
    ...pages,
    { url: studioDe, lastModified: new Date(), alternates: studioAlternates },
    { url: studioEn, lastModified: new Date(), alternates: studioAlternates },
  ];
}

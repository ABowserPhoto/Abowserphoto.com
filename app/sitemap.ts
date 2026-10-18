import type { MetadataRoute } from "next";
import { locales, withLocale, type Locale } from "../lib/i18n/config";
import { absoluteUrl } from "../lib/i18n/seo";
import { indexablePaths } from "../lib/routes";

function localizedUrl(locale: Locale, index: number) {
  return absoluteUrl(withLocale(indexablePaths(locale)[index], locale));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
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
}

import type { Metadata } from "next";
import type { CategorySlug } from "../content";
import { categoryPath } from "../routes";
import {
  BRAND_NAME,
  BUSINESS_PORTRAITS_OG_ALT,
  BUSINESS_PORTRAITS_OG_IMAGE_HEIGHT,
  BUSINESS_PORTRAITS_OG_IMAGE_PATH,
  BUSINESS_PORTRAITS_OG_IMAGE_WIDTH,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  SITE_URL,
} from "../site";
import type { Locale } from "./config";
import { withLocale } from "./config";
import { getDictionarySync } from "./getDictionary";

export function getMetadataBase() {
  return new URL(SITE_URL);
}

export function absoluteUrl(pathname: string) {
  if (pathname === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

const ogImage = {
  url: OG_IMAGE_PATH,
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt: OG_IMAGE_ALT,
};

function languageAlternates(pathnameFor: (locale: Locale) => string) {
  return {
    en: absoluteUrl(pathnameFor("en")),
    de: absoluteUrl(pathnameFor("de")),
    "x-default": absoluteUrl(pathnameFor("en")),
  };
}

function openGraphFor(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  images: NonNullable<Metadata["openGraph"]>["images"] = [ogImage]
): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: BRAND_NAME,
    url: absoluteUrl(path),
    title,
    description,
    locale: locale === "de" ? "de_DE" : "en_US",
    alternateLocale: locale === "de" ? ["en_US"] : ["de_DE"],
    images,
  };
}

export function buildRootMetadata(): Metadata {
  const en = getDictionarySync("en");
  return {
    metadataBase: getMetadataBase(),
    title: {
      default: en.brand,
      template: `%s | ${en.brand}`,
    },
    description: en.seo.home.description,
    openGraph: {
      type: "website",
      siteName: en.brand,
      locale: "en_US",
      alternateLocale: ["de_DE"],
      images: [ogImage],
    },
  };
}

/**
 * Root layout metadata uses `title.template` (`%s | Brand`). A plain string
 * title is interpolated into that template. Pass `exact` when the dictionary
 * title is already the full document title so the brand is not appended twice.
 */
function resolveDocumentTitle(title: string, brand: string, exact: boolean): {
  title: Metadata["title"];
  openGraphTitle: string;
} {
  if (exact) {
    return { title: { absolute: title }, openGraphTitle: title };
  }
  return { title, openGraphTitle: `${title} | ${brand}` };
}

export function buildHomeMetadata(locale: Locale): Metadata {
  const dict = getDictionarySync(locale);
  const path = withLocale("/", locale);
  const { title, openGraphTitle } = resolveDocumentTitle(dict.seo.home.title, dict.brand, true);
  return {
    title,
    description: dict.seo.home.description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: languageAlternates((entry) => withLocale("/", entry)),
    },
    openGraph: openGraphFor(locale, path, openGraphTitle, dict.seo.home.description),
  };
}

export function buildCategoryMetadata(locale: Locale, slug: CategorySlug): Metadata {
  const dict = getDictionarySync(locale);
  const seo = dict.seo[slug];
  const path = withLocale(categoryPath(slug, locale), locale);
  const images =
    slug === "business-portraits"
      ? [
          {
            url: BUSINESS_PORTRAITS_OG_IMAGE_PATH,
            width: BUSINESS_PORTRAITS_OG_IMAGE_WIDTH,
            height: BUSINESS_PORTRAITS_OG_IMAGE_HEIGHT,
            alt: BUSINESS_PORTRAITS_OG_ALT[locale],
          },
        ]
      : [ogImage];
  const { title, openGraphTitle } = resolveDocumentTitle(
    seo.title,
    dict.brand,
    slug === "real-estate"
  );
  return {
    title,
    description: seo.description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: languageAlternates((entry) => withLocale(categoryPath(slug, entry), entry)),
    },
    openGraph: openGraphFor(locale, path, openGraphTitle, seo.description, images),
  };
}

export function buildSimplePageMetadata(
  locale: Locale,
  key: "account" | "commercial-portfolio" | "book"
): Metadata {
  const dict = getDictionarySync(locale);
  const seo = dict.seo[key];
  const path =
    key === "commercial-portfolio"
      ? withLocale(categoryPath("commercial", locale) + "/portfolio", locale)
      : withLocale(key === "book" ? "/book" : "/account", locale);

  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: languageAlternates((entry) =>
        key === "commercial-portfolio"
          ? withLocale(`${categoryPath("commercial", entry)}/portfolio`, entry)
          : withLocale(key === "book" ? "/book" : "/account", entry)
      ),
    },
    openGraph: openGraphFor(locale, path, `${seo.title} | ${dict.brand}`, seo.description),
  };

  if (key === "account" || key === "book") {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export function buildLegalMetadata(
  locale: Locale,
  key: "impressum" | "datenschutz" | "cookie-richtlinie"
): Metadata {
  const dict = getDictionarySync(locale);
  const seo = dict.seo[key];
  const path = withLocale(`/${key}`, locale);
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: languageAlternates((entry) => withLocale(`/${key}`, entry)),
    },
    openGraph: openGraphFor(locale, path, `${seo.title} | ${dict.brand}`, seo.description),
  };
}

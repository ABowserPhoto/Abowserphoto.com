import type { Metadata } from "next";
import type { CategorySlug } from "../content";
import { categoryPath, solingenStudioPath } from "../routes";
import { nicheHostForHostname, nicheOrigin, PORTAL_CATEGORY_SUBDOMAIN } from "../subdomains";
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

/**
 * Niche category pages canonicalize to the host that served them.
 * `origin` is null on the main site, which keeps the existing www URL.
 */
function urlOnOrigin(pathname: string, origin: string | null) {
  if (!origin) return absoluteUrl(pathname);
  if (pathname === "/") return `${origin}/`;
  return `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function languageAlternatesOn(pathnameFor: (locale: Locale) => string, origin: string | null) {
  // Niche hosts (origin set) are German by default. The main site stays English.
  const xDefault: Locale = origin ? "de" : "en";
  return {
    en: urlOnOrigin(pathnameFor("en"), origin),
    de: urlOnOrigin(pathnameFor("de"), origin),
    "x-default": urlOnOrigin(pathnameFor(xDefault), origin),
  };
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

const COMPLETE_DOCUMENT_TITLES = new Set<CategorySlug>([
  "real-estate",
  "wedding",
  "business-portraits",
  "studio",
  "food",
  "cinematography",
  "commercial",
]);

export function buildCategoryMetadata(
  locale: Locale,
  slug: CategorySlug,
  requestHost?: string | null
): Metadata {
  const dict = getDictionarySync(locale);
  const seo = dict.seo[slug];
  // On the matching niche host the public URL is `/de` or `/en`. The category
  // folder is only the internal rewrite target. Other hosts keep the www path.
  // Application photos are canonical on studio.* even when the www URL is opened.
  const niche = requestHost ? nicheHostForHostname(requestHost) : null;
  const onMatchingNiche = niche?.slug === slug;
  const origin = onMatchingNiche
    ? nicheOrigin(niche.subdomain, requestHost)
    : slug === "studio"
      ? nicheOrigin(PORTAL_CATEGORY_SUBDOMAIN.studio)
      : null;
  const pathFor = (entry: Locale) =>
    origin ? `/${entry}` : withLocale(categoryPath(slug, entry), entry);
  const path = pathFor(locale);
  const canonical = urlOnOrigin(path, origin);
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
    COMPLETE_DOCUMENT_TITLES.has(slug)
  );
  const metadata: Metadata = {
    title,
    description: seo.description,
    alternates: {
      canonical,
      languages: languageAlternatesOn(pathFor, origin),
    },
    openGraph: {
      ...openGraphFor(locale, path, openGraphTitle, seo.description, images),
      url: canonical,
    },
  };

  // The www URL is only a pointer. The indexable page is the studio host.
  if (slug === "studio" && !onMatchingNiche) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export function buildSolingenStudioMetadata(locale: Locale): Metadata {
  const dict = getDictionarySync(locale);
  const seo = dict.seo.solingen;
  const path = withLocale(solingenStudioPath(locale), locale);
  const { title, openGraphTitle } = resolveDocumentTitle(seo.title, dict.brand, true);
  return {
    title,
    description: seo.description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: languageAlternates((entry) => withLocale(solingenStudioPath(entry), entry)),
    },
    openGraph: openGraphFor(locale, path, openGraphTitle, seo.description),
  };
}

export function buildSimplePageMetadata(
  locale: Locale,
  key: "account" | "commercial-portfolio" | "book",
  requestHost?: string | null
): Metadata {
  const dict = getDictionarySync(locale);
  const seo = dict.seo[key];
  const pathFor = (entry: Locale) =>
    key === "commercial-portfolio"
      ? withLocale(`${categoryPath("commercial", entry)}/portfolio`, entry)
      : withLocale(key === "book" ? "/book" : "/account", entry);
  const path = pathFor(locale);
  // The portfolio belongs to the commercial niche. On that host its canonical
  // is the subdomain URL. Account and booking stay on the main site.
  const niche = requestHost ? nicheHostForHostname(requestHost) : null;
  const origin =
    key === "commercial-portfolio" && niche?.slug === "commercial"
      ? nicheOrigin(niche.subdomain, requestHost)
      : null;
  const canonical = urlOnOrigin(path, origin);

  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: languageAlternatesOn(pathFor, origin),
    },
    openGraph: {
      ...openGraphFor(locale, path, `${seo.title} | ${dict.brand}`, seo.description),
      url: canonical,
    },
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

import type { Metadata } from "next";
import type { CategorySlug } from "../content";
import type { OfferPageKind } from "../offerPages";
import { offerPageCopy } from "../offerPages";
import { categoryPath, eventsPath, printsPath, solingenStudioPath } from "../routes";
import { nicheDocumentCopy } from "../niche-landing";
import { serviceSurfaceCopy } from "../serviceSurface";
import { nicheHostForHostname, nicheOrigin, PORTAL_CATEGORY_SUBDOMAIN } from "../subdomains";
import {
  BRAND_NAME,
  NICHE_OG_IMAGES,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  SITE_URL,
} from "../site";
import { requestOrigin } from "../passwordReset";
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
  // German is the default market on every host.
  return {
    en: urlOnOrigin(pathnameFor("en"), origin),
    de: urlOnOrigin(pathnameFor("de"), origin),
    "x-default": urlOnOrigin(pathnameFor("de"), origin),
  };
}

const ogImage = {
  url: OG_IMAGE_PATH,
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt: OG_IMAGE_ALT,
};

function categoryShareImage(locale: Locale, slug: CategorySlug) {
  const image = NICHE_OG_IMAGES[slug];
  return {
    url: absoluteUrl(image.path),
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: image.alt[locale],
  };
}

function twitterImage(image: {
  url: string;
  width?: number;
  height?: number;
  alt: string;
}): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    images: [image],
  };
}

function languageAlternates(pathnameFor: (locale: Locale) => string) {
  return {
    en: absoluteUrl(pathnameFor("en")),
    de: absoluteUrl(pathnameFor("de")),
    "x-default": absoluteUrl(pathnameFor("de")),
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
  "social-media-management",
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
  const image = categoryShareImage(locale, slug);
  const images = [image];
  // The five public niches use their own title and description on their host.
  // www, and every other host, keep the dictionary copy.
  const landing = nicheDocumentCopy(slug, locale, requestHost);
  const surface = serviceSurfaceCopy(slug, locale, requestHost);
  const documentTitle = surface?.title ?? landing?.title ?? seo.title;
  const description = surface?.description ?? landing?.description ?? seo.description;
  const { title, openGraphTitle } = resolveDocumentTitle(
    documentTitle,
    dict.brand,
    Boolean(surface) || Boolean(landing) || COMPLETE_DOCUMENT_TITLES.has(slug)
  );
  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternatesOn(pathFor, origin),
    },
    openGraph: {
      ...openGraphFor(locale, path, openGraphTitle, description, images),
      url: canonical,
    },
    twitter: twitterImage(image),
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

export function buildOfferMetadata(locale: Locale, kind: OfferPageKind): Metadata {
  const copy = offerPageCopy(kind, locale);
  const pathFor = (entry: Locale) =>
    withLocale(kind === "prints" ? printsPath(entry) : eventsPath(entry), entry);
  const path = pathFor(locale);
  const description =
    locale === "de"
      ? kind === "prints"
        ? "Wandbilder und Metalldrucke aus Ihren Fotos oder gekennzeichneten KI-Bildwelten, für Zuhause, Hotel, Restaurant und Büro. Jetzt Angebot anfragen."
        : "Mini-Sessions und Aktionen von Aaron Bowser Photography in Hagen und Solingen. Jetzt auf die Warteliste setzen."
      : kind === "prints"
        ? "Wall art and metal prints from your photos or labelled AI image worlds, for home, hotel, restaurant and office. Request a quote."
        : "Mini sessions and offers from Aaron Bowser Photography in Hagen and Solingen. Join the waiting list.";
  return {
    title: { absolute: copy.title },
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: languageAlternates(pathFor),
    },
    openGraph: openGraphFor(locale, path, copy.title, description),
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
  const image = key === "commercial-portfolio" ? categoryShareImage(locale, "commercial") : ogImage;

  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: languageAlternatesOn(pathFor, origin),
    },
    openGraph: {
      ...openGraphFor(locale, path, `${seo.title} | ${dict.brand}`, seo.description, [image]),
      url: canonical,
    },
    twitter: twitterImage(image),
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

type PasswordFlow = "forgot-password" | "reset-password";

function passwordFlowCopy(locale: Locale, flow: PasswordFlow) {
  const auth = getDictionarySync(locale).auth;
  switch (flow) {
    case "forgot-password":
      return { title: auth.forgotPasswordTitle, description: auth.forgotPasswordIntro };
    case "reset-password":
      return { title: auth.resetPasswordTitle, description: auth.resetPasswordIntro };
    default: {
      const unreachable: never = flow;
      return unreachable;
    }
  }
}

/** Noindex. Canonical stays on the host that served the page. */
export function buildPasswordFlowMetadata(
  locale: Locale,
  flow: PasswordFlow,
  requestHost?: string | null
): Metadata {
  const copy = passwordFlowCopy(locale, flow);
  const path = withLocale(`/${flow}`, locale);
  const host = requestHost?.split(",")[0]?.trim();
  const canonical = host ? `${requestOrigin(host)}${path}` : absoluteUrl(path);
  return {
    title: copy.title,
    description: copy.description,
    robots: { index: false, follow: false },
    alternates: { canonical },
  };
}

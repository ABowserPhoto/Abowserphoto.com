import type { Metadata } from "next";
import type { CategorySlug } from "../content";
import type { Locale } from "./config";
import { getDictionarySync } from "./getDictionary";
import { withLocale } from "./config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aaronbowser-photography.com";

export function getMetadataBase() {
  return new URL(SITE_URL);
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
    },
  };
}

export function buildHomeMetadata(locale: Locale): Metadata {
  const dict = getDictionarySync(locale);
  const path = withLocale("/", locale);
  return {
    title: dict.seo.home.title,
    description: dict.seo.home.description,
    alternates: {
      canonical: path,
      languages: {
        en: withLocale("/", "en"),
        de: withLocale("/", "de"),
        "x-default": withLocale("/", "en"),
      },
    },
    openGraph: {
      title: `${dict.seo.home.title} | ${dict.brand}`,
      description: dict.seo.home.description,
      url: path,
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}

export function buildCategoryMetadata(locale: Locale, slug: CategorySlug): Metadata {
  const dict = getDictionarySync(locale);
  const seo = dict.seo[slug as keyof typeof dict.seo] ?? dict.seo.home;
  const path = withLocale(`/${slug}`, locale);
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: path,
      languages: {
        en: withLocale(`/${slug}`, "en"),
        de: withLocale(`/${slug}`, "de"),
        "x-default": withLocale(`/${slug}`, "en"),
      },
    },
    openGraph: {
      title: `${seo.title} | ${dict.brand}`,
      description: seo.description,
      url: path,
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}

export function buildSimplePageMetadata(
  locale: Locale,
  key: "account" | "commercial-portfolio"
): Metadata {
  const dict = getDictionarySync(locale);
  const seo = dict.seo[key];
  const path =
    key === "commercial-portfolio"
      ? withLocale("/commercial/portfolio", locale)
      : withLocale("/account", locale);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: path,
      languages: {
        en:
          key === "commercial-portfolio"
            ? withLocale("/commercial/portfolio", "en")
            : withLocale("/account", "en"),
        de:
          key === "commercial-portfolio"
            ? withLocale("/commercial/portfolio", "de")
            : withLocale("/account", "de"),
        "x-default":
          key === "commercial-portfolio"
            ? withLocale("/commercial/portfolio", "en")
            : withLocale("/account", "en"),
      },
    },
  };
}

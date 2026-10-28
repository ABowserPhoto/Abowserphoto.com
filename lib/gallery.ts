import fs from "fs";
import path from "path";
import { categoryContentMap, type CategorySlug } from "./content";
import { businessPortraitGallery } from "./galleries/businessPortraits";
import type { Locale } from "./i18n/config";
import imageAlts from "./image-alts.json";

export type GalleryImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const altMap = imageAlts as Record<string, { de: string; en: string }>;

export function getImageAlt(src: string, locale: Locale) {
  const entry = altMap[src];
  if (entry?.[locale]) return entry[locale];
  return locale === "de"
    ? "Fotografie von Aaron Bowser Photography."
    : "Photograph by Aaron Bowser Photography.";
}

function readImageFiles(directoryPath: string, publicPrefix: string, locale: Locale): GalleryImage[] {
  try {
    return fs
      .readdirSync(directoryPath)
      .filter((file) => !file.startsWith(".") && !file.endsWith(".json"))
      .sort((a, b) => a.localeCompare(b, "de"))
      .map((file) => {
        const src = `${publicPrefix}/${file}`;
        return { src, alt: getImageAlt(src, locale) };
      });
  } catch {
    return [];
  }
}

export function readPortfolio(slug: CategorySlug, locale: Locale): GalleryImage[] {
  if (slug === "business-portraits" || slug === "studio") {
    return businessPortraitGallery.flatMap((item) => {
      const src = `/business-portraits/portfolio/${item.file}`;
      const absolute = path.join(process.cwd(), "public", "business-portraits", "portfolio", item.file);
      if (!fs.existsSync(absolute)) return [];
      return [{ src, alt: item.alt[locale], width: item.width, height: item.height }];
    });
  }

  return readImageFiles(
    path.join(process.cwd(), "public", slug, "portfolio"),
    `/${slug}/portfolio`,
    locale
  );
}

export type HeroMediaItem = {
  url: string;
  type: "image" | "video";
  alt: string;
};

/** Reads a public media folder the same way category hero sliders do. */
function readMediaDirectory(directoryPath: string, publicPrefix: string, locale: Locale): HeroMediaItem[] {
  try {
    return fs
      .readdirSync(directoryPath)
      .filter((file) => !file.startsWith("."))
      .sort((a, b) => a.localeCompare(b, "de"))
      .map((file) => {
        const extension = path.extname(file).toLowerCase();
        const type =
          extension === ".mp4" || extension === ".mov" || extension === ".webm" ? "video" : "image";
        const src = `${publicPrefix}/${file}`;
        return {
          url: src,
          type: type as "image" | "video",
          alt: type === "image" ? getImageAlt(src, locale) : "",
        };
      });
  } catch {
    return [];
  }
}

/** Reads a `public/<folder>/hero` directory the same way category sliders do. */
function readHeroDirectory(folder: string, locale: Locale): HeroMediaItem[] {
  return readMediaDirectory(path.join(process.cwd(), "public", folder, "hero"), `/${folder}/hero`, locale);
}

export function readHeroMedia(slug: CategorySlug, locale: Locale) {
  const folder = slug === "studio" ? "business-portraits" : slug;
  return readHeroDirectory(folder, locale);
}

/** First film in `public/home/hero`, in the same filename order as category heroes. */
export function readHomeIntroVideo(locale: Locale): string | null {
  return readHeroDirectory("home", locale).find((item) => item.type === "video")?.url ?? null;
}

/** Up to three portraits from `public/home/images`, in the same filename order. */
export function readHomeBaseImages(locale: Locale): string[] {
  return readMediaDirectory(path.join(process.cwd(), "public", "home", "images"), "/home/images", locale)
    .filter((item) => item.type === "image")
    .slice(0, 3)
    .map((item) => item.url);
}

export type PortalHeroSet = {
  images: string[];
  videoUrl: string | null;
};

const TRIPTYCH_CATEGORIES = new Set<CategorySlug>([
  "commercial",
  "business-portraits",
  "social-media-management",
  "wedding",
  "studio",
]);

/**
 * Hero media for the homepage hover layouts.
 * A three-up category with fewer than three hero stills is filled from its portfolio folder.
 */
export function readPortalHeroSets(locale: Locale): Record<CategorySlug, PortalHeroSet> {
  const entries = (Object.keys(categoryContentMap) as CategorySlug[]).map((slug) => {
    const media = readHeroDirectory(slug, locale);
    const images = media
      .filter((item) => item.type === "image" && !item.url.toLowerCase().includes("signet"))
      .map((item) => item.url);
    const videoUrl = media.find((item) => item.type === "video")?.url ?? null;

    if (TRIPTYCH_CATEGORIES.has(slug) && images.length < 3) {
      for (const image of readPortfolio(slug, locale)) {
        if (images.length >= 3) break;
        if (!images.includes(image.src)) images.push(image.src);
      }
    }

    return [slug, { images, videoUrl }] as const;
  });

  return Object.fromEntries(entries) as Record<CategorySlug, PortalHeroSet>;
}

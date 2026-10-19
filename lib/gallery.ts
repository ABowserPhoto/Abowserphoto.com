import fs from "fs";
import path from "path";
import type { CategorySlug } from "./content";
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
  if (slug === "business-portraits") {
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

export function readHeroMedia(slug: CategorySlug, locale: Locale) {
  const directoryPath = path.join(process.cwd(), "public", slug, "hero");

  try {
    return fs
      .readdirSync(directoryPath)
      .filter((file) => !file.startsWith("."))
      .sort((a, b) => a.localeCompare(b, "de"))
      .map((file) => {
        const extension = path.extname(file).toLowerCase();
        const type =
          extension === ".mp4" || extension === ".mov" || extension === ".webm" ? "video" : "image";
        const src = `/${slug}/hero/${file}`;
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

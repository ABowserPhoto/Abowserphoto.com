import fs from "fs";
import path from "path";
import { imageSize } from "image-size";

export type CmsMediaItem = {
  url: string;
  type: "image" | "video";
};

export type ImageDimensions = {
  width: number;
  height: number;
};

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);

function getMediaType(extension: string): "image" | "video" | null {
  const normalized = extension.toLowerCase();
  if (VIDEO_EXTENSIONS.has(normalized)) return "video";
  if (IMAGE_EXTENSIONS.has(normalized)) return "image";
  return null;
}

function readFirstMediaInDirectory(directoryPath: string, publicUrlPrefix: string): CmsMediaItem | null {
  try {
    const files = fs.readdirSync(directoryPath).filter((file) => !file.startsWith("."));

    for (const file of files) {
      const type = getMediaType(path.extname(file));
      if (type) {
        return {
          url: `${publicUrlPrefix}/${file}`,
          type,
        };
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getLogoUrl(): string | null {
  const logoDirectory = path.join(process.cwd(), "public", "logo");

  try {
    const files = fs.readdirSync(logoDirectory).filter((file) => !file.startsWith("."));

    for (const file of files) {
      const type = getMediaType(path.extname(file));
      if (type === "image") {
        return `/logo/${file}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getAboutImageUrl(): string | null {
  const aboutDirectory = path.join(process.cwd(), "public", "about");

  try {
    const files = fs.readdirSync(aboutDirectory).filter((file) => !file.startsWith("."));

    for (const file of files) {
      const type = getMediaType(path.extname(file));
      if (type === "image") {
        return `/about/${file}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

// Reads the pixel dimensions of an image under /public so layout can size
// boxes to match each image's real aspect ratio (e.g. service image cards).
export function getImageDimensions(publicUrl: string): ImageDimensions | null {
  const absolutePath = path.join(process.cwd(), "public", publicUrl.replace(/^\//, ""));

  try {
    const { width, height } = imageSize(fs.readFileSync(absolutePath));
    if (!width || !height) return null;
    return { width, height };
  } catch {
    return null;
  }
}

export function getCategoryHero(category: string): CmsMediaItem | null {
  const heroDirectory = path.join(process.cwd(), "public", category, "hero");
  return readFirstMediaInDirectory(heroDirectory, `/${category}/hero`);
}

export function getCategoryHeroes(categories: string[]): Record<string, CmsMediaItem | null> {
  return Object.fromEntries(categories.map((category) => [category, getCategoryHero(category)]));
}

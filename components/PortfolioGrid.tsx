"use client";

import Image from "next/image";
import { useState } from "react";

export type PortfolioImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

/** 1000×1250 headshots are 4:5; the other portraits are 2:3. */
function isFourFive(image: PortfolioImage) {
  if (!image.width || !image.height) return false;
  return Math.abs(image.width / image.height - 0.8) < 0.02;
}

type PortfolioGridProps = {
  images: PortfolioImage[];
  title: string;
  themeColor: string;
  onImageClick?: (image: PortfolioImage) => void;
  /** Eyebrow label above the count (e.g. "Selected Work" vs "Full Portfolio"). */
  label?: string;
  /** Localized count line, already including the number. */
  countLabel: string;
  /** Grid tile aspect bias. Defaults to portrait for people/editorial work. */
  orientation?: "portrait" | "landscape";
};

// Tall tiles for people / editorial photography.
const portraitSpanClasses = [
  "col-span-1 row-span-4", // standard portrait
  "col-span-1 row-span-4", // standard portrait
  "col-span-2 row-span-8", // rare large portrait
  "col-span-1 row-span-4", // standard portrait
  "col-span-1 row-span-4", // standard portrait
  "col-span-1 row-span-4", // standard portrait
  "col-span-1 row-span-8", // rare extra-large portrait
  "col-span-1 row-span-4", // standard portrait
];

// 4-column repeating pattern for architectural / real-estate photography.
// Highlights are col-span-2 row-span-2 (exactly 2×2 of a 1×1 cell). Combined with
// aspect-[3/2] on each tile, every image locks to a consistent 3×2 proportion.
const landscapeSpanClasses = [
  "col-span-1 row-span-1", // standard
  "col-span-1 row-span-1", // standard
  "col-span-2 row-span-2", // highlight (fills right side)
  "col-span-1 row-span-1", // standard (under first)
  "col-span-1 row-span-1", // standard (under second)
  "col-span-2 row-span-2", // highlight (fills left side)
  "col-span-1 row-span-1", // standard
  "col-span-1 row-span-1", // standard
  "col-span-1 row-span-1", // standard
  "col-span-1 row-span-1", // standard
];

export default function PortfolioGrid({
  images,
  title,
  themeColor,
  onImageClick,
  label = "Full Portfolio",
  countLabel,
  orientation = "portrait",
}: PortfolioGridProps) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const displayImages = images;

  const isLandscape = orientation === "landscape";
  const activeClasses = isLandscape ? landscapeSpanClasses : portraitSpanClasses;

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative z-0 w-full border-t border-[#1a1a1a] bg-black py-14" aria-label={title}>
      <div className="mb-6 px-4 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">{label}</p>
        <span className="mt-1 block text-sm font-medium text-[#F4F1ED]/85">{countLabel}</span>
      </div>
      <div
        className={
          isLandscape
            ? "grid grid-cols-1 grid-flow-dense gap-[5px] md:grid-cols-2 lg:grid-cols-4"
            : "grid grid-cols-4 grid-flow-dense auto-rows-[minmax(100px,auto)] gap-[5px] sm:grid-cols-5 lg:grid-cols-6"
        }
      >
        {displayImages.map((image, index) => {
          const fourFive = !isLandscape && isFourFive(image);
          return (
          <div
            key={image.src}
            className={`${
              fourFive ? "col-span-1 self-start" : activeClasses[index % activeClasses.length]
            } group relative min-h-[100px] overflow-hidden rounded-none border border-[#1f1f1f] bg-[#202020] shadow-sm transition-[opacity,border-color] duration-300 ${
              isLandscape ? "aspect-[3/2]" : ""
            } ${hoveredImage && hoveredImage !== image.src ? "opacity-50" : ""}`}
            style={{ borderColor: index === 0 ? `${themeColor}55` : undefined }}
            onMouseEnter={() => setHoveredImage(image.src)}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => onImageClick?.(image)}
          >
            {fourFive && image.width && image.height ? (
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 639px) 25vw, (max-width: 1023px) 20vw, 16vw"
                className="h-auto w-full object-cover object-center transition duration-300 group-hover:brightness-110"
              />
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={
                  isLandscape
                    ? "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    : "(max-width: 639px) 50vw, (max-width: 1023px) 40vw, 33vw"
                }
                className={`rounded-none object-cover transition duration-300 group-hover:brightness-110 ${
                  isLandscape ? "object-center" : "object-top"
                }`}
              />
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

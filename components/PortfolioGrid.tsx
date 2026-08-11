"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type PortfolioGridProps = {
  images: string[];
  title: string;
  themeColor: string;
  onImageClick?: (image: string) => void;
  /** Eyebrow label above the count (e.g. "Selected Work" vs "Full Portfolio"). */
  label?: string;
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
  orientation = "portrait",
}: PortfolioGridProps) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [displayImages, setDisplayImages] = useState(images);
  const [isMounted, setIsMounted] = useState(false);

  const isLandscape = orientation === "landscape";
  const activeClasses = isLandscape ? landscapeSpanClasses : portraitSpanClasses;

  // Shuffle images only (never the span classes) after mount to avoid hydration mismatch.
  useEffect(() => {
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDisplayImages(shuffled);
    setIsMounted(true);
  }, [images]);

  if (images.length === 0) {
    return null;
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative z-0 w-full border-t border-[#1a1a1a] bg-black py-14">
      <div className="mb-6 px-4 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">{label}</p>
        <span className="mt-1 block text-sm font-medium text-[#F4F1ED]/85">
          {displayImages.length} showcase images
        </span>
      </div>
      <div
        className={
          isLandscape
            ? "grid grid-cols-1 grid-flow-dense gap-[5px] md:grid-cols-2 lg:grid-cols-4"
            : "grid grid-cols-4 grid-flow-dense auto-rows-[minmax(100px,auto)] gap-[5px] sm:grid-cols-5 lg:grid-cols-6"
        }
      >
        {displayImages.map((image, index) => (
          <motion.div
            key={image}
            className={`${activeClasses[index % activeClasses.length]} group relative min-h-[100px] overflow-hidden rounded-none border border-[#1f1f1f] bg-[#202020] shadow-sm transition-[opacity,border-color,box-shadow,filter] duration-300 ${
              isLandscape ? "aspect-[3/2]" : ""
            } ${hoveredImage && hoveredImage !== image ? "opacity-50" : "opacity-100"}`}
            style={{ borderColor: index === 0 ? `${themeColor}55` : undefined }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              zIndex: 20,
              borderColor: "#f4f1ed66",
              boxShadow: "0 0 0 1px rgba(244,241,237,0.3)",
            }}
            onHoverStart={() => setHoveredImage(image)}
            onHoverEnd={() => setHoveredImage(null)}
            onClick={() => onImageClick?.(image)}
          >
            <Image
              src={image}
              alt={`${title} portfolio ${index + 1}`}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}

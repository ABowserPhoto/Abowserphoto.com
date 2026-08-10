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
};

// Fixed repeating pattern of portrait-oriented spans applied by index (mod
// length). Standard tiles are tall rectangles; large tiles are rare feature
// portraits. No landscape (wide/short) spans are used.
const SPAN_CLASSES = [
  "col-span-1 row-span-4", // standard portrait
  "col-span-1 row-span-4", // standard portrait
  "col-span-2 row-span-8", // rare large portrait
  "col-span-1 row-span-4", // standard portrait
  "col-span-1 row-span-4", // standard portrait
  "col-span-1 row-span-4", // standard portrait
  "col-span-1 row-span-8", // rare extra-large portrait
  "col-span-1 row-span-4", // standard portrait
];

export default function PortfolioGrid({
  images,
  title,
  themeColor,
  onImageClick,
  label = "Full Portfolio",
}: PortfolioGridProps) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const [shuffledImages, setShuffledImages] = useState(images);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledImages(shuffled);
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
          {shuffledImages.length} showcase images
        </span>
      </div>
      <div className="grid grid-cols-4 grid-flow-dense auto-rows-[minmax(100px,auto)] gap-[5px] sm:grid-cols-5 lg:grid-cols-6">
        {shuffledImages.map((image, index) => (
          <motion.div
            key={image}
            className={`${SPAN_CLASSES[index % SPAN_CLASSES.length]} group relative min-h-[100px] overflow-hidden rounded-none border border-[#1f1f1f] bg-[#202020] shadow-sm transition-[opacity,border-color,box-shadow,filter] duration-300 ${
              hoveredImage && hoveredImage !== image ? "opacity-50" : "opacity-100"
            }`}
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
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 40vw, 33vw"
              className="rounded-none object-cover object-top transition duration-300 group-hover:brightness-110"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

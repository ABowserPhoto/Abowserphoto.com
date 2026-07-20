"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type HeroMediaItem = {
  url: string;
  type: "image" | "video";
};

type HeroSliderProps = {
  media: HeroMediaItem[];
  title: string;
  subtitle: string;
  intervalMs?: number;
};

export default function HeroSlider({ media, title, subtitle, intervalMs = 10000 }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (media.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % media.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [media.length, intervalMs]);

  const activeMedia = media[activeIndex];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {media.length === 0 ? (
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#111111] to-[#1a1a1a]" />
      ) : (
        <AnimatePresence>
          <motion.div
            key={`${activeMedia.url}-${activeIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {activeMedia.type === "image" ? (
              <Image
                src={activeMedia.url}
                alt={`${title} hero`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <video
                src={activeMedia.url}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 pt-16 text-center sm:px-10">
        <div className="max-w-4xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#F4F1ED]/70">
            Aaron Bowser Photography
          </p>
          <h1 className="mt-5 text-4xl font-light leading-tight tracking-tight text-[#F4F1ED] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#F4F1ED]/85 sm:text-base lg:text-lg">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}

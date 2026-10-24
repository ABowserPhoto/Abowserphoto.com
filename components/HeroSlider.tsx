"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type HeroMediaItem = {
  url: string;
  type: "image" | "video";
  alt?: string;
};

type HeroSliderProps = {
  media: HeroMediaItem[];
  title: string;
  subtitle: string;
  intervalMs?: number;
  /** Left when the subject sits on the right of the frame. */
  align?: "left" | "center";
};

export default function HeroSlider({
  media,
  title,
  subtitle,
  intervalMs = 10000,
  align = "center",
}: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (media.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % media.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [media.length, intervalMs]);

  const activeMedia = media[activeIndex];

  if (align === "left") {
    const image = activeMedia?.type === "image" ? activeMedia : media.find((item) => item.type === "image");
    return (
      <section className="relative w-full bg-black pt-20">
        <div className="relative mx-auto w-full max-w-[min(100%,calc((100svh-5rem)*16/9))]">
          <div className="relative aspect-video w-full">
            {image ? (
              <Image
                src={image.url}
                alt={image.alt || title}
                fill
                priority
                sizes="100vw"
                className="object-contain object-center"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-black via-[#111111] to-[#1a1a1a]" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 via-[22%] to-transparent to-[46%]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[46%] items-center px-8 text-left md:flex lg:px-12">
              <HeroCopy title={title} subtitle={subtitle} align="left" />
            </div>
          </div>
        </div>
        <div className="px-6 pb-10 pt-6 text-left md:hidden">
          <HeroCopy title={title} subtitle={subtitle} align="left" compact />
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen min-h-screen w-full overflow-hidden bg-black">
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
                alt={activeMedia.alt || title}
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
        <HeroCopy title={title} subtitle={subtitle} align="center" />
      </div>
    </section>
  );
}

function HeroCopy({
  title,
  subtitle,
  align,
  compact = false,
}: {
  title: string;
  subtitle: string;
  align: "left" | "center";
  compact?: boolean;
}) {
  return (
    <div className={align === "left" ? "max-w-full" : "max-w-4xl"}>
      <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#F4F1ED]/70">
        Aaron Bowser Photography
      </p>
      <h1
        className={
          compact
            ? "mt-3 text-3xl font-light leading-tight tracking-tight text-[#F4F1ED]"
            : "mt-5 text-4xl font-light leading-tight tracking-tight text-[#F4F1ED] sm:text-5xl lg:text-6xl"
        }
      >
        {title}
      </h1>
      <p
        className={
          align === "left"
            ? "mt-4 max-w-full text-sm leading-relaxed text-[#F4F1ED]/85 sm:text-base"
            : "mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#F4F1ED]/85 sm:text-base lg:text-lg"
        }
      >
        {subtitle}
      </p>
    </div>
  );
}

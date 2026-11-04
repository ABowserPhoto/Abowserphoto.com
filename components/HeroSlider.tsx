"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type HeroMediaItem = {
  url: string;
  mobileUrl?: string;
  mobileAlt?: string;
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
    return (
      <section className="relative w-full bg-black pt-20">
        <div className="relative mx-auto w-full md:max-w-[min(100%,calc((100svh-5rem)*16/9))]">
          <div className="relative aspect-[4/5] w-full md:aspect-video">
            {media.length === 0 ? (
              <div className="absolute inset-0 bg-gradient-to-br from-black via-[#111111] to-[#1a1a1a]" />
            ) : (
              <AnimatePresence>
                <motion.div
                  key={`${activeMedia.url}-${activeIndex}`}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  {activeMedia.type === "image" ? (
                    <ArtDirectedHeroImage item={activeMedia} title={title} priority={activeIndex === 0} />
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

            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 via-[16%] to-transparent to-[40%] md:bg-gradient-to-r md:from-black/60 md:via-black/30 md:via-[30%] md:to-transparent md:to-[58%]"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[40%] items-center px-6 text-left sm:px-8 md:inset-y-0 md:left-0 md:h-auto md:w-1/2 md:px-10 lg:px-14">
              <HeroCopy title={title} subtitle={subtitle} align="left" />
            </div>
          </div>
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

function ArtDirectedHeroImage({
  item,
  title,
  priority,
}: {
  item: HeroMediaItem;
  title: string;
  priority: boolean;
}) {
  return (
    <>
      <Image
        src={item.url}
        alt={item.alt || title}
        fill
        priority={priority}
        sizes="100vw"
        className={
          item.mobileUrl ? "hidden object-cover object-center md:block" : "object-cover object-center"
        }
      />
      {item.mobileUrl ? (
        <Image
          src={item.mobileUrl}
          alt={item.mobileAlt || item.alt || title}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-center md:hidden"
        />
      ) : null}
    </>
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
          align === "left"
            ? "mt-3 text-3xl font-light leading-tight tracking-tight text-[#F4F1ED] md:mt-5 md:text-5xl lg:text-6xl"
            : compact
              ? "mt-3 text-3xl font-light leading-tight tracking-tight text-[#F4F1ED]"
              : "mt-5 text-4xl font-light leading-tight tracking-tight text-[#F4F1ED] sm:text-5xl lg:text-6xl"
        }
      >
        {title}
      </h1>
      <p
        className={
          align === "left"
            ? "mt-3 max-w-xl text-sm leading-relaxed text-[#F4F1ED]/90 md:mt-4 md:text-base"
            : "mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#F4F1ED]/85 sm:text-base lg:text-lg"
        }
      >
        {subtitle}
      </p>
    </div>
  );
}

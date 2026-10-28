"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Major_Mono_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PortalHeroSet } from "../lib/gallery";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import { categoryPath } from "../lib/routes";
import LanguageSwitcher from "./LanguageSwitcher";

const majorMono = Major_Mono_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/** First letters (lowercase a / b) are this many times the other letters. */
const HERO_CAP_SCALE = 1.65;
/**
 * Major Mono Display advance width (740 / 1000 upem). Lowercase and uppercase
 * glyphs share this 0.74em advance, so the 60% column width does not change
 * when the hero uses the lowercase forms.
 */
const MAJOR_MONO_ADVANCE_EM = 0.74;
const HERO_TRACKING_EM = 0.04;

/** Font size that makes one hero word about 60% of its column (the column is the container). */
function heroNameFontSize(letterCount: number) {
  const widthEm =
    (HERO_CAP_SCALE + letterCount - 1) * MAJOR_MONO_ADVANCE_EM + HERO_TRACKING_EM * (letterCount - 1);
  return `calc(60cqw / ${widthEm})`;
}

const PORTAL_CATEGORIES = [
  "commercial",
  "real-estate",
  "wedding",
  "food",
  "business-portraits",
  "cinematography",
  "social-media-management",
  "studio",
] as const;

type PortalCategory = (typeof PORTAL_CATEGORIES)[number];

type HoverLayout = "triptych" | "landscape-image" | "landscape-video";

const HOVER_LAYOUT: Record<PortalCategory, HoverLayout> = {
  commercial: "triptych",
  "business-portraits": "triptych",
  "social-media-management": "triptych",
  wedding: "triptych",
  studio: "triptych",
  food: "landscape-image",
  "real-estate": "landscape-image",
  cinematography: "landscape-video",
};

const HOVER_COLOR: Record<PortalCategory, string> = {
  commercial: "hover:bg-amber-500/60",
  "real-estate": "hover:bg-orange-600/60",
  wedding: "hover:bg-red-700/60",
  food: "hover:bg-blue-600/60",
  "business-portraits": "hover:bg-lime-600/60",
  cinematography: "hover:bg-teal-600/60",
  "social-media-management": "hover:bg-purple-600/60",
  studio: "hover:bg-stone-500/60",
};

/** Staggered so the links arrive in a mixed order after the names settle. */
const randomDelays = [0.4, 0.1, 0.5, 0.2, 0.6, 0.3, 0.7, 0.45];

const NAME_EASE = [0.16, 1, 0.3, 1] as const;
const HOVER_FADE = { duration: 0.8, ease: "easeInOut" as const };

/** 120% of a column: 1.2 × (33.333vw − 10.66px). */
const CENTER_LOGO_CLASS =
  "h-auto max-h-[35vh] w-[calc(40vw-12.8px)] max-w-none object-contain brightness-0 invert drop-shadow-lg";

const NAME_CLASS = `${majorMono.className} mx-auto w-fit whitespace-nowrap text-center normal-case leading-none tracking-[0.04em] text-[#F4F1ED]`;

/** Was 2.5s. 1.25× so the name slide-in takes 25% longer. Link timing below stays locked to this. */
const NAME_ENTRANCE_S = 2.5 * 1.25;

type HomePortalProps = {
  logoUrl: string | null;
  /** Portrait film from `public/home/hero`, or null when that folder has no video. */
  introVideoUrl: string | null;
  /** Up to three portraits from `public/home/images`. */
  baseImages: string[];
  portalHeroes: Record<string, PortalHeroSet>;
  locale: Locale;
  dictionary: Dictionary;
};

type Panel = {
  key: PortalCategory;
  index: number;
  label: string;
  href: string;
  hoverColor: string;
  seoTitle: string;
  seoLabel: string;
};

function StageImage({ src, sizes }: { src: string; sizes: string }) {
  const position = "object-cover object-top";

  if (src.startsWith("http")) {
    return (
      // Remote heroes are not in the image optimizer allowlist.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className={`absolute inset-0 h-full w-full ${position}`} />
    );
  }

  return <Image src={src} alt="" fill sizes={sizes} className={position} />;
}

function BackgroundFrames({
  images,
  videoUrl,
  layout,
}: {
  images: string[];
  videoUrl: string | null;
  layout: HoverLayout;
}) {
  if (layout === "landscape-video" && videoUrl) {
    return (
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }

  const frames = layout === "triptych" ? images.slice(0, 3) : images.slice(0, 1);
  const frameClass = layout === "triptych" ? "relative h-full w-1/3" : "relative h-full w-full";
  const sizes = layout === "triptych" ? "34vw" : "100vw";

  return (
    <div className="flex h-full w-full">
      {frames.map((src) => (
        <div key={src} className={frameClass}>
          <StageImage src={src} sizes={sizes} />
        </div>
      ))}
    </div>
  );
}

export default function HomePortal({
  logoUrl,
  introVideoUrl,
  baseImages,
  portalHeroes,
  locale,
  dictionary,
}: HomePortalProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const [linksReady, setLinksReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const videoOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const aaronX = useTransform(scrollYProgress, [0, 1], ["0vw", "-100vw"]);
  const bowserX = useTransform(scrollYProgress, [0, 1], ["0vw", "100vw"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const baseOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const brandingOpacity = useTransform(scrollYProgress, [0.25, 0.9], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.25, 0.9], [-50, 0]);

  const panels = useMemo<Panel[]>(
    () =>
      PORTAL_CATEGORIES.map((key, index) => ({
        key,
        index,
        label: dictionary.home.niches[key],
        href: withLocale(categoryPath(key, locale), locale),
        hoverColor: HOVER_COLOR[key],
        seoTitle: dictionary.seo[key].title,
        seoLabel: `${dictionary.home.niches[key]} — ${dictionary.nav.services}`,
      })),
    [dictionary, locale]
  );

  useEffect(() => {
    if (reduceMotion === null) return;
    const timeoutId = window.setTimeout(() => setLinksReady(true), reduceMotion ? 0 : NAME_ENTRANCE_S * 1000);
    return () => window.clearTimeout(timeoutId);
  }, [reduceMotion]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value > 0.45;
    setHoverEnabled((current) => (current === next ? current : next));

    const video = videoRef.current;
    if (!video) return;
    if (value > 0.98) {
      if (!video.paused) video.pause();
    } else if (video.paused) {
      void video.play().catch(() => undefined);
    }
  });

  const activeKey = activeIndex === null ? null : PORTAL_CATEGORIES[activeIndex];
  const hoveredKey = hoverEnabled ? activeKey : null;
  const hoveredHero = hoveredKey ? portalHeroes[hoveredKey] : null;
  const nameEntrance = { duration: reduceMotion ? 0 : NAME_ENTRANCE_S, ease: NAME_EASE };

  return (
    <main ref={trackRef} className="relative h-[200vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div className="absolute inset-0 flex" style={{ opacity: baseOpacity }}>
          <BackgroundFrames images={baseImages} videoUrl={null} layout="triptych" />
        </motion.div>

        <AnimatePresence>
          {hoveredKey && hoveredHero ? (
            <motion.div
              key={hoveredKey}
              className="absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={HOVER_FADE}
            >
              <BackgroundFrames
                images={hoveredHero.images}
                videoUrl={hoveredHero.videoUrl}
                layout={HOVER_LAYOUT[hoveredKey]}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.video
          ref={videoRef}
          src={introVideoUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          style={{ opacity: videoOpacity }}
          className="pointer-events-none absolute top-0 left-0 z-20 block h-[100dvh] w-full bg-black object-cover md:left-1/3 md:w-1/3"
        />
      </div>

      <div className="@container pointer-events-none absolute inset-y-0 left-0 z-30 flex w-1/3 items-center justify-center">
        <motion.div className="w-full" initial={{ x: "-100vw" }} animate={{ x: 0 }} transition={nameEntrance}>
          <motion.p
            className={NAME_CLASS}
            aria-hidden
            style={{ x: aaronX, opacity: nameOpacity, fontSize: heroNameFontSize(5) }}
          >
            <span style={{ fontSize: `${HERO_CAP_SCALE}em` }}>a</span>{"aron"}
          </motion.p>
        </motion.div>
      </div>
      <div className="@container pointer-events-none absolute inset-y-0 right-0 z-30 flex w-1/3 items-center justify-center">
        <motion.div className="w-full" initial={{ x: "100vw" }} animate={{ x: 0 }} transition={nameEntrance}>
          <motion.p
            className={NAME_CLASS}
            aria-hidden
            style={{ x: bowserX, opacity: nameOpacity, fontSize: heroNameFontSize(6) }}
          >
            <span style={{ fontSize: `${HERO_CAP_SCALE}em` }}>b</span>{"owser"}
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom padding on desktop keeps the large signature clear of the bottom menu. */}
      <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-start px-4 pt-20 md:justify-center md:pb-32 md:pt-0">
        {logoUrl ? (
          <motion.div style={{ opacity: brandingOpacity }}>
            {logoUrl.toLowerCase().endsWith(".svg") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={dictionary.home.logoLabel} className={CENTER_LOGO_CLASS} />
            ) : (
              <Image
                src={logoUrl}
                alt={dictionary.home.logoLabel}
                width={505}
                height={462}
                sizes="40vw"
                priority
                className={CENTER_LOGO_CLASS}
              />
            )}
          </motion.div>
        ) : null}
        <motion.h1
          style={{ opacity: brandingOpacity, y: titleY }}
          className="mt-4 text-center text-xl font-bold uppercase tracking-widest text-white/80 drop-shadow-lg lg:text-2xl"
        >
          {dictionary.home.headline}
        </motion.h1>
      </div>

      <nav
        className="absolute bottom-6 left-4 z-50 flex w-max max-w-[90vw] flex-col gap-3 md:bottom-12 md:left-1/2 md:-translate-x-1/2 md:flex-row md:flex-wrap md:justify-center"
        aria-label={dictionary.nav.services}
        onMouseLeave={() => setActiveIndex(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setActiveIndex(null);
        }}
      >
        {panels.map((panel) => (
          <motion.div
            key={panel.key}
            className={linksReady ? undefined : "pointer-events-none"}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : NAME_ENTRANCE_S + (randomDelays[panel.index] ?? 0),
              duration: reduceMotion ? 0 : 0.55,
              ease: NAME_EASE,
            }}
          >
            <Link
              href={panel.href}
              title={panel.seoTitle}
              aria-label={panel.seoLabel}
              aria-current={panel.index === activeIndex ? "true" : undefined}
              onMouseEnter={() => setActiveIndex(panel.index)}
              onFocus={() => setActiveIndex(panel.index)}
              className={`block w-fit rounded-xl border border-white/20 bg-black/40 px-6 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md transition-all duration-300 sm:text-base ${panel.hoverColor} ${
                activeIndex === null || panel.index === activeIndex
                  ? "opacity-100"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <span className="drop-shadow-md">{panel.label}</span>
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex items-start justify-end gap-4 px-4 py-4 sm:px-6 sm:py-5">
        <LanguageSwitcher className="pointer-events-auto flex shrink-0 items-center gap-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F4F1ED]" />
      </div>
      </div>
    </main>
  );
}

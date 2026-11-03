"use client";

import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Major_Mono_Display } from "next/font/google";
import Image from "next/image";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import type { MotionValue } from "framer-motion";
import type { PortalHeroSet } from "../lib/gallery";
import type { Locale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import { type PortalCategorySlug, portalCategoryUrl } from "../lib/subdomains";
import LanguageSwitcher from "./LanguageSwitcher";
import SiteFooter from "./SiteFooter";
import CustomCursor from "./ui/CustomCursor";

const majorMono = Major_Mono_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/** First letters (uppercase A / B) are this many times the lowercase letters that follow. */
const HERO_CAP_SCALE = 1.65;
/**
 * Major Mono Display advance width (740 / 1000 upem). Lowercase and uppercase
 * glyphs share this 0.74em advance, so mixing an uppercase initial with
 * lowercase letters does not change the column share.
 */
const MAJOR_MONO_ADVANCE_EM = 0.74;
const HERO_TRACKING_EM = 0.04;

/** Font size that makes one hero word about 30% of its column, half the previous scale. */
function heroNameFontSize(letterCount: number) {
  const widthEm =
    (HERO_CAP_SCALE + letterCount - 1) * MAJOR_MONO_ADVANCE_EM + HERO_TRACKING_EM * (letterCount - 1);
  return `calc(30cqw / ${widthEm})`;
}

const PORTAL_CATEGORIES = [
  "commercial",
  "real-estate",
  "wedding",
  "food",
  "business-portraits",
  "cinematography",
  "social-media-management",
] as const satisfies readonly PortalCategorySlug[];

type HoverLayout = "triptych" | "landscape-image" | "landscape-video";

const HOVER_LAYOUT: Record<PortalCategorySlug, HoverLayout> = {
  commercial: "triptych",
  "business-portraits": "triptych",
  "social-media-management": "triptych",
  wedding: "triptych",
  studio: "triptych",
  food: "landscape-image",
  "real-estate": "landscape-image",
  cinematography: "landscape-video",
};

/** Staggered so the links arrive in a mixed order after the names settle. */
const randomDelays = [0.4, 0.1, 0.5, 0.2, 0.6, 0.3, 0.7, 0.45];

const NAME_EASE = [0.16, 1, 0.3, 1] as const;
const HOVER_FADE = { duration: 0.8, ease: "easeInOut" as const };

/** 120% of a column: 1.2 × (33.333vw − 10.66px). Tone (white or black) is applied by the parent. */
const CENTER_LOGO_CLASS =
  "h-auto max-h-[35vh] w-[calc(40vw-12.8px)] max-w-none object-contain drop-shadow-lg";

const STORY_TEXT = "CHOOSE YOUR VISUAL STORY";
const GLYPHS = ["X", "#", "8", "%"] as const;

/** Linear map from `start`→`end` into `from`→`to`, held outside that window. */
function segment(progress: number, start: number, end: number, from: number, to: number) {
  if (progress <= start) return from;
  if (progress >= end) return to;
  return from + ((progress - start) / (end - start)) * (to - from);
}

function scrambledText(text: string, progress: number) {
  const clamped = Math.min(1, Math.max(0, progress));
  const revealCount = clamped >= 1 ? text.length : Math.floor(clamped * text.length);
  let result = "";
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index] ?? "";
    if (character === " ") result += " ";
    else if (index < revealCount) result += character;
    else result += GLYPHS[index % GLYPHS.length];
  }
  return result;
}

function ScrambleText({ progress, text }: { progress: MotionValue<number>; text: string }) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(text);

  useMotionValueEvent(progress, "change", (current) => {
    setValue(reduceMotion ? text : scrambledText(text, current));
  });

  useEffect(() => {
    setValue(reduceMotion ? text : scrambledText(text, progress.get()));
  }, [progress, reduceMotion, text]);

  return <span aria-hidden="true">{value}</span>;
}

const NAME_CLASS = `${majorMono.className} mx-auto w-fit whitespace-nowrap text-center normal-case leading-none tracking-[0.04em] text-[#F4F1ED]`;

/** Was 2.5s. 1.25× so the name slide-in takes 25% longer. Link timing below stays locked to this. */
const NAME_ENTRANCE_S = 2.5 * 1.25;

type HomePortalProps = {
  children: ReactNode;
  logoUrl: string | null;
  /** Portrait film from `public/home/hero`, or null when that folder has no video. */
  introVideoUrl: string | null;
  /** Up to three portraits from `public/home/images`. */
  baseImages: string[];
  /** Up to three light portraits from `public/home/light-theme`. */
  lightImages: string[];
  portalHeroes: Record<string, PortalHeroSet>;
  locale: Locale;
  dictionary: Dictionary;
  /** Request host for building absolute niche URLs on the server. */
  publicHost?: string;
};

type Panel = {
  key: PortalCategorySlug;
  index: number;
  label: string;
  href: string;
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

/** Scroll index for the menu hop. -1 before 0.5; last link from 0.75 onward. */
function hopIndexFor(progress: number, count: number) {
  if (count <= 0 || progress < 0.5) return -1;
  const span = Math.min(1, (progress - 0.5) / 0.25);
  return Math.round(span * (count - 1));
}

/** Horizontal center of the link, at the top edge, so the shape can rest above the label. */
function linkAnchor(link: HTMLElement, nav: HTMLElement) {
  const linkBox = link.getBoundingClientRect();
  const navBox = nav.getBoundingClientRect();
  return {
    x: linkBox.left - navBox.left + linkBox.width / 2,
    y: linkBox.top - navBox.top,
  };
}

function MenuLine({
  hopIndex,
  color,
  navRef,
  linkRefs,
}: {
  hopIndex: number;
  color: MotionValue<string>;
  navRef: RefObject<HTMLElement | null>;
  linkRefs: RefObject<(HTMLAnchorElement | null)[]>;
}) {
  const reduceMotion = useReducedMotion();
  const position = useAnimation();
  const placed = useRef(false);

  useLayoutEffect(() => {
    let frame = 0;
    let cancelled = false;

    const place = (allowSlide: boolean) => {
      const nav = navRef.current;
      const link = hopIndex >= 0 ? linkRefs.current[hopIndex] : null;
      if (!nav || !link) {
        if (hopIndex < 0) {
          placed.current = false;
          void position.start({ opacity: 0, transition: { duration: 0.12 } });
        }
        return false;
      }

      const next = linkAnchor(link, nav);
      if (!placed.current || reduceMotion || !allowSlide) {
        position.set({ x: next.x, y: next.y, opacity: 1 });
      } else {
        void position.start({
          x: next.x,
          y: next.y,
          opacity: 1,
          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        });
      }
      placed.current = true;
      return true;
    };

    if (!place(true)) frame = requestAnimationFrame(() => {
      if (!cancelled) place(true);
    });

    const onResize = () => {
      place(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [hopIndex, linkRefs, navRef, position, reduceMotion]);

  return (
    <motion.div
      aria-hidden
      animate={position}
      initial={{ opacity: 0 }}
      className="pointer-events-none absolute top-0 left-0 z-10"
    >
      <motion.span
        className="absolute bottom-2 left-0 h-8 w-[1px] -translate-x-1/2"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}

export default function HomePortal({
  children,
  logoUrl,
  introVideoUrl,
  baseImages,
  lightImages,
  portalHeroes,
  locale,
  dictionary,
  publicHost = "",
}: HomePortalProps) {
  const [clientHost, setClientHost] = useState(publicHost);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientHost(window.location.host);
    }
  }, []);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hopIndex, setHopIndex] = useState(-1);
  const [linksReady, setLinksReady] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [glassOpen, setGlassOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const linkRefCallbacks = useRef<Array<(node: HTMLAnchorElement | null) => void>>([]);
  const refForLink = (index: number) => {
    const existing = linkRefCallbacks.current[index];
    if (existing) return existing;
    const callback = (node: HTMLAnchorElement | null) => {
      linkRefs.current[index] = node;
    };
    linkRefCallbacks.current[index] = callback;
    return callback;
  };
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // Function maps stay on this track. Array maps are promoted to the document
  // scroll timeline and drift when anything else adds page height.
  // 0–0.5 keeps the earlier dark-sequence ratios: film 0–0.4, logo 0.4–0.7, text 0.7–1.
  const videoOpacity = useTransform(scrollYProgress, (value) => segment(value, 0, 0.2, 1, 0));
  const aaronX = useTransform(scrollYProgress, (value) => `${segment(value, 0, 0.2, 0, -100)}vw`);
  const bowserX = useTransform(scrollYProgress, (value) => `${segment(value, 0, 0.2, 0, 100)}vw`);
  const nameOpacity = useTransform(scrollYProgress, (value) => segment(value, 0, 0.2, 1, 0));
  const baseOpacity = useTransform(scrollYProgress, (value) => segment(value, 0, 0.2, 0, 1));
  const logoOpacity = useTransform(scrollYProgress, (value) => segment(value, 0.2, 0.35, 0, 1));
  const textProgress = useTransform(scrollYProgress, (value) => segment(value, 0.35, 0.5, 0, 1));
  const titleOpacity = useTransform(scrollYProgress, (value) => segment(value, 0.35, 0.39, 0, 1));
  const lightOpacity = useTransform(scrollYProgress, (value) => segment(value, 0.75, 0.85, 0, 1));
  const glassOpacity = useTransform(scrollYProgress, (value) => segment(value, 0.85, 1, 0, 1));
  const glassY = useTransform(scrollYProgress, (value) => segment(value, 0.85, 1, 48, 0));
  const cursorColor = useTransform(scrollYProgress, (value) => {
    const mix = segment(value, 0.75, 0.85, 0, 1);
    const channel = Math.round(255 * (1 - mix));
    return `rgb(${channel}, ${channel}, ${channel})`;
  });
  // Same 0.75–0.85 white → #1F2937 map as an array transform. The function
  // form stays on this track instead of the document scroll timeline.
  const uiColor = useTransform(scrollYProgress, (value) => {
    const mix = segment(value, 0.75, 0.85, 0, 1);
    const channel = (from: number, to: number) => Math.round(from + (to - from) * mix);
    return `rgb(${channel(255, 0x1f)}, ${channel(255, 0x29)}, ${channel(255, 0x37)})`;
  });

  const panels = useMemo<Panel[]>(
    () =>
      PORTAL_CATEGORIES.map((key, index) => ({
        key,
        index,
        label: dictionary.home.niches[key],
        href: portalCategoryUrl(key, { host: clientHost || publicHost, locale }),
        seoTitle: dictionary.seo[key].title,
        seoLabel: `${dictionary.home.niches[key]} — ${dictionary.nav.services}`,
      })),
    [clientHost, dictionary, locale, publicHost]
  );

  useEffect(() => {
    if (reduceMotion === null) return;
    const timeoutId = window.setTimeout(() => setLinksReady(true), reduceMotion ? 0 : NAME_ENTRANCE_S * 1000);
    return () => window.clearTimeout(timeoutId);
  }, [reduceMotion]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileMenuOpen]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const nextHop = hopIndexFor(value, PORTAL_CATEGORIES.length);
    setHopIndex((current) => (current === nextHop ? current : nextHop));
    const lit = value >= 0.8;
    setLightTheme((current) => (current === lit ? current : lit));
    const open = value > 0.86;
    setGlassOpen((current) => (current === open ? current : open));

    const video = videoRef.current;
    if (!video) return;
    if (value >= 0.2) {
      if (!video.paused) video.pause();
    } else if (video.paused) {
      void video.play().catch(() => undefined);
    }
  });

  const hoveredKey = hoveredIndex === null ? null : PORTAL_CATEGORIES[hoveredIndex];
  const hoveredHero = hoveredKey ? portalHeroes[hoveredKey] : null;
  const nameEntrance = { duration: reduceMotion ? 0 : NAME_ENTRANCE_S, ease: NAME_EASE };

  return (
    <>
    <CustomCursor color={cursorColor} />
    <main ref={trackRef} className="relative h-[400vh] cursor-none bg-black [&_*]:cursor-none">
      <div className="sticky top-0 h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div className="absolute inset-0 flex" style={{ opacity: baseOpacity }}>
          <BackgroundFrames images={baseImages} videoUrl={null} layout="triptych" />
        </motion.div>

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

        <motion.div
          className="pointer-events-none absolute inset-0 z-[25] bg-white"
          style={{ opacity: lightOpacity }}
          aria-hidden
        >
          <BackgroundFrames images={lightImages} videoUrl={null} layout="triptych" />
        </motion.div>

        <AnimatePresence>
          {hoveredKey && hoveredHero ? (
            <motion.div
              key={hoveredKey}
              className="pointer-events-none absolute inset-0 z-[26]"
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
      </div>

      <div className="@container pointer-events-none absolute inset-y-0 left-0 z-30 flex w-1/3 items-center justify-center">
        <motion.div className="w-full" initial={{ x: "-100vw" }} animate={{ x: 0 }} transition={nameEntrance}>
          <motion.p
            className={NAME_CLASS}
            aria-hidden
            style={{ x: aaronX, opacity: nameOpacity, fontSize: heroNameFontSize(5) }}
          >
            <span style={{ fontSize: `${HERO_CAP_SCALE}em` }}>A</span>{"aron"}
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
            <span style={{ fontSize: `${HERO_CAP_SCALE}em` }}>B</span>{"owser"}
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom padding on desktop keeps the large signature clear of the bottom menu. */}
      <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-start px-4 pt-20 md:justify-center md:pb-32 md:pt-0">
        {logoUrl ? (
          <motion.div
            style={{ opacity: logoOpacity }}
            className={lightTheme ? "brightness-0" : "brightness-0 invert"}
          >
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
        <motion.p
          style={{ opacity: titleOpacity }}
          className={`mt-6 max-w-[min(90vw,42rem)] text-center text-xl font-bold uppercase tracking-widest lg:text-2xl ${
            lightTheme ? "text-[#322B2B]" : "text-white/85"
          }`}
        >
          <span className="sr-only">{STORY_TEXT}</span>
          <ScrambleText progress={textProgress} text={STORY_TEXT} />
        </motion.p>
      </div>

      <motion.div
        className="absolute left-1/2 top-[5vh] z-[45] h-[90vh] w-[min(92vw,46rem)] -translate-x-1/2 overflow-y-auto rounded-2xl border border-white/20 bg-white/30 p-8 shadow-xl backdrop-blur-md"
        style={{ opacity: glassOpacity, y: glassY, pointerEvents: glassOpen ? "auto" : "none" }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isFooterVisible ? (
          <motion.div
            key="home-footer"
            className="absolute inset-x-0 bottom-0 z-[55] max-h-[70vh] overflow-y-auto bg-[#F4F1ED] pb-28"
            initial={{ y: reduceMotion ? 0 : "100%" }}
            animate={{ y: 0 }}
            exit={{ y: reduceMotion ? 0 : "100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <SiteFooter locale={locale} dictionary={dictionary} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="absolute bottom-6 left-4 z-[70] flex w-max max-w-[90vw] flex-col items-start gap-3 md:bottom-12 md:left-1/2 md:-translate-x-1/2 md:items-center">
      <motion.button
        type="button"
        className="block md:hidden"
        style={{ color: uiColor }}
        aria-expanded={isMobileMenuOpen}
        aria-label={dictionary.nav.menu}
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <span className="flex flex-col gap-1.5" aria-hidden>
          <span className="block h-px w-7 bg-current" />
          <span className="block h-px w-7 bg-current" />
          <span className="block h-px w-7 bg-current" />
        </span>
      </motion.button>
      <motion.nav
        ref={navRef}
        className="relative hidden flex-col gap-3 md:flex md:flex-row md:flex-wrap md:justify-center md:gap-0"
        style={{ color: uiColor }}
        aria-label={dictionary.nav.services}
      >
        <MenuLine hopIndex={hopIndex} color={uiColor} navRef={navRef} linkRefs={linkRefs} />
        {panels.map((panel) => (
          <Fragment key={panel.key}>
            <motion.div
              className={linksReady ? undefined : "pointer-events-none"}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : NAME_ENTRANCE_S + (randomDelays[panel.index] ?? 0),
                duration: reduceMotion ? 0 : 0.55,
                ease: NAME_EASE,
              }}
            >
              <a
                ref={refForLink(panel.index)}
                href={panel.href}
                title={panel.seoTitle}
                aria-label={panel.seoLabel}
                aria-current={hopIndex === panel.index ? "true" : undefined}
                onMouseEnter={() => setHoveredIndex(panel.index)}
                onMouseLeave={(event) => {
                  const next = event.relatedTarget;
                  if (next instanceof Node && event.currentTarget.closest("nav")?.contains(next)) return;
                  setHoveredIndex(null);
                }}
                className={`block w-fit text-left text-sm font-medium uppercase tracking-[0.18em] transition-opacity duration-300 sm:text-base ${
                  hoveredIndex === null || hoveredIndex === panel.index
                    ? "opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {panel.label}
              </a>
            </motion.div>
            {panel.index < panels.length - 1 ? (
              <span aria-hidden className="mx-4 h-4 w-[1px] self-center bg-current opacity-40" />
            ) : null}
          </Fragment>
        ))}
      </motion.nav>
      <button
        type="button"
        onClick={() => setIsFooterVisible(!isFooterVisible)}
        aria-expanded={isFooterVisible}
        className={`text-xs uppercase tracking-widest opacity-50 hover:opacity-100 ${
          lightTheme ? "text-black" : "text-white"
        }`}
      >
        Info & Legal
      </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
          >
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label={dictionary.nav.close}
              className="absolute top-6 right-6 text-white"
            >
              <span aria-hidden className="block text-3xl leading-none">
                ×
              </span>
            </button>
            <nav aria-label={dictionary.nav.services} className="flex flex-col items-center">
              {panels.map((panel) => (
                <a
                  key={panel.key}
                  href={panel.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mb-8 text-3xl font-light text-white"
                >
                  {panel.label}
                </a>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex items-start justify-end gap-4 px-4 py-4 sm:px-6 sm:py-5">
        <LanguageSwitcher
          className={`pointer-events-auto flex shrink-0 items-center gap-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
            lightTheme ? "text-[#322B2B]" : "text-[#F4F1ED]"
          }`}
        />
      </div>
      </div>
    </main>
    </>
  );
}

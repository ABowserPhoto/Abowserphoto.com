"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { CmsMediaItem } from "../lib/cms";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import { STUDIOS } from "../lib/site";
import LanguageSwitcher from "./LanguageSwitcher";
import SiteLogo from "./SiteLogo";

type NicheKey =
  | "default"
  | "wedding"
  | "real-estate"
  | "business-portraits"
  | "food"
  | "cinematography"
  | "social-media-management"
  | "commercial";

type NicheConfig = {
  key: Exclude<NicheKey, "default">;
  label: string;
  href: string;
  color: string;
  seoTitle: string;
  seoLabel: string;
};

const DEFAULT_CATEGORY: Exclude<NicheKey, "default"> = "commercial";

const nicheColors: Record<Exclude<NicheKey, "default">, string> = {
  wedding: "#ABD3D9",
  food: "#E2A121",
  "real-estate": "#E18400",
  "business-portraits": "#446E8B",
  cinematography: "#27AAE1",
  "social-media-management": "#818B68",
  commercial: "#FFB70F",
};

function buildNicheItems(locale: Locale, dictionary: Dictionary): NicheConfig[] {
  const niches = dictionary.home.niches;
  return (Object.keys(nicheColors) as Array<Exclude<NicheKey, "default">>).map((key) => ({
    key,
    label: niches[key],
    href: withLocale(`/${key}`, locale),
    color: nicheColors[key],
    seoTitle: dictionary.seo[key]?.title ?? niches[key],
    seoLabel: `${niches[key]} — ${dictionary.nav.services}`,
  }));
}

function getNicheByKey(items: NicheConfig[], key: NicheKey) {
  if (key === "default") return null;
  return items.find((item) => item.key === key) ?? null;
}

function getRequiredNiche(items: NicheConfig[], key: Exclude<NicheKey, "default">) {
  const item = items.find((entry) => entry.key === key);
  if (!item) {
    throw new Error(`Missing niche configuration for ${key}`);
  }
  return item;
}

function resolveBackgroundMedia(
  activeKey: NicheKey,
  categoryHeroes: Record<string, CmsMediaItem | null>
): CmsMediaItem | null {
  if (activeKey === "default") {
    return categoryHeroes[DEFAULT_CATEGORY] ?? null;
  }

  return categoryHeroes[activeKey] ?? categoryHeroes[DEFAULT_CATEGORY] ?? null;
}

function getVideoMimeType(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase();
  if (extension === "webm") return "video/webm";
  if (extension === "mov") return "video/quicktime";
  return "video/mp4";
}

type HeroBackgroundProps = {
  media: CmsMediaItem | null;
};

function HeroBackground({ media }: HeroBackgroundProps) {
  if (!media) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#141414]" />
    );
  }

  if (media.type === "video") {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={media.url} type={getVideoMimeType(media.url)} />
      </video>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Image src={media.url} alt="" fill priority sizes="100vw" className="object-cover" />
    </div>
  );
}

type PortalLinkProps = {
  item: NicheConfig;
  activeKey: NicheKey;
  onActivate: (key: NicheKey) => void;
};

function PortalLink({ item, activeKey, onActivate }: PortalLinkProps) {
  const active = activeKey === item.key;

  return (
    <Link
      href={item.href}
      onMouseEnter={() => onActivate(item.key)}
      onFocus={() => onActivate(item.key)}
      onTouchStart={() => onActivate(item.key)}
      title={item.seoTitle}
      aria-label={item.seoLabel}
      className="rounded-md px-2 py-1 text-2xl font-semibold tracking-tight text-[#F4F1ED] transition-all duration-300 sm:text-3xl"
      style={active ? { color: item.color, textShadow: `0 0 16px ${item.color}88` } : undefined}
    >
      {item.label}
    </Link>
  );
}

type HomePortalProps = {
  categoryHeroes: Record<string, CmsMediaItem | null>;
  logoUrl: string | null;
  locale: Locale;
  dictionary: Dictionary;
};

export default function HomePortal({
  categoryHeroes,
  logoUrl,
  locale,
  dictionary,
}: HomePortalProps) {
  const [activeKey, setActiveKey] = useState<NicheKey>("default");
  const nicheItems = useMemo(() => buildNicheItems(locale, dictionary), [locale, dictionary]);
  const activeNiche = useMemo(() => getNicheByKey(nicheItems, activeKey), [activeKey, nicheItems]);
  const backgroundMedia = useMemo(
    () => resolveBackgroundMedia(activeKey, categoryHeroes),
    [activeKey, categoryHeroes]
  );
  const commercialItem = getRequiredNiche(nicheItems, "commercial");
  const businessPortraitsItem = getRequiredNiche(nicheItems, "business-portraits");
  const realEstateItem = getRequiredNiche(nicheItems, "real-estate");
  const foodItem = getRequiredNiche(nicheItems, "food");
  const weddingItem = getRequiredNiche(nicheItems, "wedding");
  const cinematographyItem = getRequiredNiche(nicheItems, "cinematography");
  const socialMediaManagementItem = getRequiredNiche(nicheItems, "social-media-management");
  const commercialHref = withLocale("/commercial", locale);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#000000]">
      <section className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={backgroundMedia?.url ?? "fallback"}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <HeroBackground media={backgroundMedia} />
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{
            background:
              activeNiche?.color !== undefined
                ? `linear-gradient(to top, rgba(2,6,23,0.9) 10%, ${activeNiche.color}33 65%, rgba(2,6,23,0.45) 100%)`
                : "linear-gradient(to top, rgba(2,6,23,0.92) 12%, rgba(2,6,23,0.45) 100%)",
          }}
        />
      </section>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          className="flex w-full max-w-xl flex-col rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onMouseLeave={() => setActiveKey("default")}
        >
          <div className="flex items-start justify-between gap-3">
            <SiteLogo
              logoUrl={logoUrl}
              href={withLocale("/", locale)}
              className="flex items-center gap-2.5 text-[#F4F1ED]"
              imageClassName="h-8 w-8 object-contain brightness-0 invert"
              label={dictionary.home.logoLabel}
              labelClassName="text-xs uppercase tracking-[0.3em] text-[#F4F1ED]/70"
            />
            <LanguageSwitcher className="flex shrink-0 items-center gap-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F4F1ED]" />
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-[#F4F1ED] sm:text-4xl">
            {dictionary.home.headline}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/85 sm:text-base">
            {dictionary.home.subhead}
          </p>
          <address className="mt-4 space-y-1 not-italic text-[11px] leading-relaxed tracking-wide text-[#F4F1ED]/75">
            {STUDIOS.map((studio) => (
              <span key={studio.id} className="block">
                {locale === "de" ? studio.nameDe : studio.nameEn}
                {" · "}
                {studio.street}, {studio.postalCode} {studio.city}
              </span>
            ))}
          </address>

          <nav className="mt-7 flex flex-col gap-2 sm:gap-1.5">
            <PortalLink item={commercialItem} activeKey={activeKey} onActivate={setActiveKey} />
            <div className="mt-2 flex flex-wrap gap-2 pb-2">
              {dictionary.home.commercialTags.map((label) => (
                <Link
                  key={label}
                  href={commercialHref}
                  onMouseEnter={() => setActiveKey("commercial")}
                  onFocus={() => setActiveKey("commercial")}
                  onTouchStart={() => setActiveKey("commercial")}
                  title={`${label} — ${dictionary.seo.commercial.title}`}
                  aria-label={`${label} — ${dictionary.seo.commercial.title}`}
                  className="rounded-full border border-[#F4F1ED]/25 px-3 py-1 text-xs font-medium text-[#F4F1ED] transition-all duration-300"
                  style={
                    activeKey === "commercial"
                      ? { borderColor: "#FFB70F", color: "#FFB70F" }
                      : undefined
                  }
                >
                  {label}
                </Link>
              ))}
            </div>

            <PortalLink item={businessPortraitsItem} activeKey={activeKey} onActivate={setActiveKey} />
            <PortalLink item={realEstateItem} activeKey={activeKey} onActivate={setActiveKey} />
            <PortalLink item={weddingItem} activeKey={activeKey} onActivate={setActiveKey} />
            <PortalLink item={foodItem} activeKey={activeKey} onActivate={setActiveKey} />

            <div className="my-3 h-px w-full bg-white/20" aria-hidden="true" />

            <PortalLink item={cinematographyItem} activeKey={activeKey} onActivate={setActiveKey} />

            <div className="my-3 h-px w-full bg-white/20" aria-hidden="true" />

            <PortalLink
              item={socialMediaManagementItem}
              activeKey={activeKey}
              onActivate={setActiveKey}
            />
          </nav>
        </motion.div>
      </section>
    </main>
  );
}

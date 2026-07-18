"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

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
  image: string;
  seoTitle: string;
  seoLabel: string;
};

const DESKTOP_SHOWREEL_VIDEO =
  "https://cdn.coverr.co/videos/coverr-film-camera-shooting-1579/1080p.mp4";

const nicheItems: NicheConfig[] = [
  {
    key: "wedding",
    label: "Wedding",
    href: "/wedding",
    color: "#ABD3D9",
    seoTitle: "Wedding Photography Services",
    seoLabel: "View wedding photography services",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80",
  },
  {
    key: "food",
    label: "Food",
    href: "/food",
    color: "#E2A121",
    seoTitle: "Food Photography Services",
    seoLabel: "View food photography services",
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1920&q=80",
  },
  {
    key: "real-estate",
    label: "Real Estate",
    href: "/real-estate",
    color: "#E18400",
    seoTitle: "Real Estate Photography Services",
    seoLabel: "View real estate photography services",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
  },
  {
    key: "business-portraits",
    label: "Business Portraits",
    href: "/business-portraits",
    color: "#446E8B",
    seoTitle: "Business Portrait Photography Services",
    seoLabel: "View business portrait photography services",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1920&q=80",
  },
  {
    key: "cinematography",
    label: "Cinematography",
    href: "/cinematography",
    color: "#27AAE1",
    seoTitle: "Cinematography and Motion Services",
    seoLabel: "View cinematography and motion services",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1920&q=80",
  },
  {
    key: "social-media-management",
    label: "Social Media Management",
    href: "/social-media-management",
    color: "#818B68",
    seoTitle: "Social Media Management Services",
    seoLabel: "View social media management services",
    image:
      "https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=1920&q=80",
  },
  {
    key: "commercial",
    label: "Commercial",
    href: "/commercial",
    color: "#FFB70F",
    seoTitle: "Commercial and Editorial Photography Services",
    seoLabel: "View commercial and editorial photography services",
    image:
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1920&q=80",
  },
];

function getNicheByKey(key: NicheKey) {
  if (key === "default") return null;
  return nicheItems.find((item) => item.key === key) ?? null;
}

function getRequiredNiche(key: Exclude<NicheKey, "default">) {
  const item = nicheItems.find((entry) => entry.key === key);
  if (!item) {
    throw new Error(`Missing niche configuration for ${key}`);
  }
  return item;
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

export default function HomePage() {
  const [activeKey, setActiveKey] = useState<NicheKey>("default");
  const activeNiche = useMemo(() => getNicheByKey(activeKey), [activeKey]);
  const commercialItem = getRequiredNiche("commercial");
  const businessPortraitsItem = getRequiredNiche("business-portraits");
  const realEstateItem = getRequiredNiche("real-estate");
  const foodItem = getRequiredNiche("food");
  const weddingItem = getRequiredNiche("wedding");
  const cinematographyItem = getRequiredNiche("cinematography");
  const socialMediaManagementItem = getRequiredNiche("social-media-management");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#000000]">
      <section className="absolute inset-0">
        <div className="absolute inset-0 hidden md:block">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            poster={nicheItems[0].image}
          >
            <source src={DESKTOP_SHOWREEL_VIDEO} type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0 md:hidden bg-gradient-to-br from-black via-[#0a0a0a] to-[#141414]" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeNiche?.key ?? "default"}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              backgroundImage: activeNiche ? `url(${activeNiche.image})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
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
          <p className="text-xs uppercase tracking-[0.3em] text-[#F4F1ED]/70">A. Bowser Photography</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-[#F4F1ED] sm:text-4xl">
            Choose Your Visual Story
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/85 sm:text-base">
            Explore editorial, commercial, and niche-focused workspaces crafted for premium visual storytelling.
          </p>

          <nav className="mt-7 flex flex-col gap-2 sm:gap-1.5">
            <PortalLink item={commercialItem} activeKey={activeKey} onActivate={setActiveKey} />
            <div className="mt-2 flex flex-wrap gap-2 pb-2">
              {["Portrait", "Fashion", "Product", "Beauty", "Editorial"].map((label) => (
                <Link
                  key={label}
                  href="/commercial"
                  onMouseEnter={() => setActiveKey("commercial")}
                  onFocus={() => setActiveKey("commercial")}
                  onTouchStart={() => setActiveKey("commercial")}
                  title={`${label} Photography Services`}
                  aria-label={`Open ${label} photography services in the commercial portfolio`}
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

            <PortalLink item={socialMediaManagementItem} activeKey={activeKey} onActivate={setActiveKey} />
          </nav>
        </motion.div>
      </section>
    </main>
  );
}

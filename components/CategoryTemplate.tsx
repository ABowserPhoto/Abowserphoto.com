"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CategoryContent, FAQItem } from "../lib/content";
import type { GalleryImage } from "../lib/gallery";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import type { PageSection } from "../lib/i18n/pageSections";
import { CONTACT_EMAIL } from "../lib/site";
import HeroSlider, { type HeroMediaItem } from "./HeroSlider";
import Navbar from "./Navbar";
import PageSections from "./PageSections";
import PortfolioGrid from "./PortfolioGrid";
import ServicesScroll from "./ServicesScroll";
import SiteFooter from "./SiteFooter";

type ServiceWithMedia = {
  title: string;
  description: string;
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  mediaType?: "embed" | "video";
  embedUrl?: string;
  videoUrl?: string;
  tours?: { title: string; url: string }[];
  videos?: { title: string; url: string }[];
  beforeImage?: string;
  afterImage?: string;
};

type AboutData = {
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
};

type CategoryTemplateProps = {
  category: CategoryContent;
  portfolio: GalleryImage[];
  heroMedia: HeroMediaItem[];
  services: ServiceWithMedia[];
  logoUrl: string | null;
  aboutData: AboutData;
  faqs: FAQItem[];
  pageSections?: PageSection[];
  dictionary: Dictionary;
  locale: Locale;
};

type SectionId = "hero" | "portfolio" | "services" | "about" | "faq";

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  // "some" = any pixel visible. A fractional amount (e.g. 0.22) can never
  // fire on mobile when the section is taller than ~viewport/amount — which
  // happens on Commercial with 5 tall portrait service cards stacked.
  viewport: { once: true, amount: "some" as const, margin: "0px 0px -8% 0px" },
  transition: { duration: 0.75, ease: "easeOut" as const },
};

/** Preview count on the commercial category page; full set lives at /commercial/portfolio. */
const COMMERCIAL_PORTFOLIO_PREVIEW_COUNT = 15;

export default function CategoryTemplate({
  category,
  portfolio,
  heroMedia,
  services,
  logoUrl,
  aboutData,
  faqs,
  pageSections = [],
  dictionary,
  locale,
}: CategoryTemplateProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  const isCommercial = category.slug === "commercial";
  const showFullPortfolioCta = isCommercial && portfolio.length > COMMERCIAL_PORTFOLIO_PREVIEW_COUNT;
  const gridImages = useMemo(
    () =>
      showFullPortfolioCta ? portfolio.slice(0, COMMERCIAL_PORTFOLIO_PREVIEW_COUNT) : portfolio,
    [portfolio, showFullPortfolioCta]
  );

  const sectionLinks = useMemo(
    () =>
      [
        { id: "hero" as const, label: dictionary.nav.hero },
        { id: "portfolio" as const, label: dictionary.nav.portfolio },
        { id: "services" as const, label: dictionary.nav.services },
        { id: "about" as const, label: dictionary.nav.about },
        { id: "faq" as const, label: dictionary.nav.faq },
      ] satisfies Array<{ id: SectionId; label: string }>,
    [dictionary]
  );

  const visibleSectionLinks = useMemo(
    () => (faqs.length > 0 ? sectionLinks : sectionLinks.filter((section) => section.id !== "faq")),
    [faqs.length, sectionLinks]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id as SectionId);
        }
      },
      { root: null, rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.35, 0.6] }
    );

    visibleSectionLinks.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [visibleSectionLinks]);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    }

    if (selectedImage) {
      window.addEventListener("keydown", onEscape);
    }
    return () => window.removeEventListener("keydown", onEscape);
  }, [selectedImage]);

  function handleSectionClick(event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(sectionId as SectionId);
  }

  return (
    <div className="min-h-screen bg-[#F4F1ED] text-[#322B2B]">
      <Navbar
        logoUrl={logoUrl}
        sections={visibleSectionLinks}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        themeColor={category.themeColor}
        lightSectionRef={aboutRef}
        homeHref="/"
        labels={{
          book: dictionary.nav.book,
          home: dictionary.nav.home,
          menu: dictionary.nav.menu,
        }}
      />

      <main>
        <section id="hero" className="relative min-h-screen w-full">
          <HeroSlider media={heroMedia} title={category.title} subtitle={category.subtitle} />
        </section>

        <section id="portfolio" className="relative z-0 isolate bg-black">
          <PortfolioGrid
            images={gridImages}
            title={category.title}
            themeColor={category.themeColor}
            onImageClick={setSelectedImage}
            label={
              showFullPortfolioCta ? dictionary.nav.selectedWork : dictionary.nav.fullPortfolio
            }
            countLabel={dictionary.nav.showcaseCount.replace("{count}", String(gridImages.length))}
            orientation={category.slug === "real-estate" ? "landscape" : "portrait"}
          />
          {showFullPortfolioCta ? (
            <div className="relative z-10 flex justify-center bg-black px-4 pb-16 pt-4">
              <Link
                href={withLocale("/commercial/portfolio", locale)}
                className="inline-flex items-center justify-center border border-[#F4F1ED]/45 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F4F1ED] transition-colors duration-300 hover:border-[#F4F1ED] hover:bg-[#F4F1ED] hover:text-[#322B2B]"
              >
                {dictionary.nav.viewFullPortfolio}
              </Link>
            </div>
          ) : null}
        </section>

        <ServicesScroll
          ref={servicesRef}
          services={services}
          themeColor={category.themeColor}
          inquireLabel={dictionary.nav.inquire}
          watchVideoLabel={dictionary.category.watchVideo}
          viewTourLabel={dictionary.category.viewTour}
        />

        <PageSections sections={pageSections} />

        <motion.section
          ref={aboutRef}
          id="about"
          className="relative z-30 bg-white/65 py-24"
          {...fadeUp}
        >
          <div
            className={`mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:px-8 ${
              aboutData.imageUrl ? "md:grid-cols-2" : ""
            }`}
          >
            {aboutData.imageUrl ? (
              <motion.div
                className="relative"
                initial={{ scale: 0.95, opacity: 0.9 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div
                  className="pointer-events-none absolute -inset-3 rounded-2xl"
                  style={{ backgroundColor: `${category.themeColor}22` }}
                  aria-hidden="true"
                />
                <div
                  className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border shadow-sm"
                  style={{ borderColor: `${category.themeColor}66` }}
                >
                  <Image
                    src={aboutData.imageUrl}
                    alt={aboutData.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#322B2B]/55">
                {aboutData.title}
              </p>
              <h2 className="mt-3 text-3xl font-light tracking-tight text-[#322B2B] sm:text-4xl">
                {dictionary.category.behindTheLens}
              </h2>
              <div className="mt-5 max-w-2xl space-y-4 text-sm leading-relaxed text-[#322B2B]/80 sm:text-base">
                {aboutData.description
                  .split(/\n\n+/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
                style={{ backgroundColor: category.themeColor }}
              >
                {dictionary.nav.contact}
              </a>
            </motion.div>
          </div>
        </motion.section>

        {faqs.length > 0 ? (
          <motion.section id="faq" className="relative z-30 mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8" {...fadeUp}>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#322B2B]/55">
              {dictionary.nav.faq}
            </p>
            <h2 className="mt-3 text-3xl font-light tracking-tight text-[#322B2B]">
              {dictionary.category.commonQuestions}
            </h2>
            <div className="mt-8 space-y-3">
              {faqs.map((item, index) => {
                const isOpen = index === openFaq;
                return (
                  <motion.article
                    key={item.question}
                    className="overflow-hidden rounded-xl border border-[#322B2B]/12 bg-white"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold sm:text-base"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      {item.question}
                      <span style={{ color: category.themeColor }}>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen ? (
                      <p className="px-5 pb-4 text-sm leading-relaxed text-[#322B2B]/80">{item.answer}</p>
                    ) : null}
                  </motion.article>
                );
              })}
            </div>
          </motion.section>
        ) : null}

        <SiteFooter locale={locale} dictionary={dictionary} />
      </main>

      <AnimatePresence>
        {selectedImage ? (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-md border border-white/30 bg-black/35 px-3 py-1.5 text-sm font-semibold text-white"
            >
              {dictionary.nav.close}
            </button>
            <motion.img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[90vh] w-auto max-w-full rounded-xl object-contain"
              initial={{ scale: 0.86, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

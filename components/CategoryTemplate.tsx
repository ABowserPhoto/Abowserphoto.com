"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CategoryContent, FAQItem } from "../lib/content";
import HeroSlider, { type HeroMediaItem } from "./HeroSlider";
import Navbar from "./Navbar";
import PortfolioGrid from "./PortfolioGrid";

type ServiceWithMedia = {
  title: string;
  description: string;
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
};

type AboutData = {
  title: string;
  description: string;
  imageUrl: string | null;
};

type CategoryTemplateProps = {
  category: CategoryContent;
  heroMedia: HeroMediaItem[];
  services: ServiceWithMedia[];
  logoUrl: string | null;
  aboutData: AboutData;
  faqs: FAQItem[];
};

type SectionId = "hero" | "portfolio" | "services" | "about" | "faq";

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.22 },
  transition: { duration: 0.75, ease: "easeOut" as const },
};

const sectionLinks: { id: SectionId; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "portfolio", label: "Portfolio" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
];

/** Preview count on the commercial category page; full set lives at /commercial/portfolio. */
const COMMERCIAL_PORTFOLIO_PREVIEW_COUNT = 15;

export default function CategoryTemplate({
  category,
  heroMedia,
  services,
  logoUrl,
  aboutData,
  faqs,
}: CategoryTemplateProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const servicesRef = useRef<HTMLElement>(null);

  const portfolioImages = category.portfolioImages;
  const isCommercial = category.slug === "commercial";
  const showFullPortfolioCta = isCommercial && portfolioImages.length > COMMERCIAL_PORTFOLIO_PREVIEW_COUNT;
  const gridImages = useMemo(
    () =>
      showFullPortfolioCta
        ? portfolioImages.slice(0, COMMERCIAL_PORTFOLIO_PREVIEW_COUNT)
        : portfolioImages,
    [portfolioImages, showFullPortfolioCta]
  );

  const visibleSectionLinks = useMemo(
    () => (faqs.length > 0 ? sectionLinks : sectionLinks.filter((section) => section.id !== "faq")),
    [faqs.length]
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
        lightSectionRef={servicesRef}
      />

      <main>
        <section id="hero" className="relative min-h-screen w-full">
          <HeroSlider media={heroMedia} title={category.title} subtitle={category.subtitle} />
        </section>

        <section id="portfolio" className="relative bg-black">
          <PortfolioGrid
            images={gridImages}
            title={category.title}
            themeColor={category.themeColor}
            onImageClick={setSelectedImage}
            label={showFullPortfolioCta ? "Selected Work" : "Full Portfolio"}
          />
          {showFullPortfolioCta ? (
            <div className="flex justify-center bg-black px-4 pb-16 pt-4">
              <Link
                href="/commercial/portfolio"
                className="inline-flex items-center justify-center border border-[#F4F1ED]/45 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F4F1ED] transition-colors duration-300 hover:border-[#F4F1ED] hover:bg-[#F4F1ED] hover:text-[#322B2B]"
              >
                View Full Portfolio
              </Link>
            </div>
          ) : null}
        </section>

        <motion.section
          ref={servicesRef}
          id="services"
          className="relative z-30 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
          {...fadeUp}
        >
          <motion.div className="mb-12 text-center md:text-left" {...fadeUp}>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#322B2B]/55">Services</p>
            <h2 className="mt-3 text-3xl font-light tracking-tight text-[#322B2B] sm:text-4xl">
              Crafted for premium storytelling
            </h2>
          </motion.div>

          <div className="space-y-12">
            {services.map((service, index) => {
              const reverse = index % 2 === 1;
              return (
                <motion.article
                  key={service.title}
                  className="grid overflow-hidden rounded-2xl border border-[#322B2B]/10 bg-white shadow-sm md:grid-cols-2"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.22 }}
                  transition={{ duration: 0.75, delay: 0.08, ease: "easeOut" }}
                >
                  <div className={reverse ? "order-1 md:order-2" : "order-1"}>
                    <div
                      className={`relative w-full max-h-[70vh] bg-[#F4F1ED] ${
                        service.imageWidth && service.imageHeight
                          ? ""
                          : "h-64 sm:h-72 md:h-full md:min-h-[22rem]"
                      }`}
                      style={
                        service.imageWidth && service.imageHeight
                          ? { aspectRatio: `${service.imageWidth} / ${service.imageHeight}` }
                          : undefined
                      }
                    >
                      {service.imageUrl ? (
                        <Image
                          src={service.imageUrl}
                          alt={service.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-contain"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className={reverse ? "order-2 md:order-1" : "order-2"}>
                    <div className="flex h-full flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">
                      <span
                        className="mb-3 inline-block h-1 w-14 rounded-full"
                        style={{ backgroundColor: category.themeColor }}
                        aria-hidden="true"
                      />
                      <h3 className="text-2xl font-semibold text-[#322B2B]">{service.title}</h3>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#322B2B]/80 sm:text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center md:justify-start">
            <Link
              href="/booking"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
              style={{ backgroundColor: category.themeColor }}
            >
              Start an Inquiry
            </Link>
          </div>
        </motion.section>

        <motion.section
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
                  className="relative h-80 w-full overflow-hidden rounded-2xl border shadow-sm sm:h-96"
                  style={{ borderColor: `${category.themeColor}66` }}
                >
                  <Image
                    src={aboutData.imageUrl}
                    alt={aboutData.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
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
                Behind the lens
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#322B2B]/80 sm:text-base">
                {aboutData.description}
              </p>
              <a
                href="mailto:hello@abowserphoto.com"
                className="mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
                style={{ backgroundColor: category.themeColor }}
              >
                Contact
              </a>
            </motion.div>
          </div>
        </motion.section>

        {faqs.length > 0 ? (
          <motion.section id="faq" className="relative z-30 mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8" {...fadeUp}>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#322B2B]/55">FAQ</p>
            <h2 className="mt-3 text-3xl font-light tracking-tight text-[#322B2B]">Common questions</h2>
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

        <footer className="relative z-30 border-t border-[#322B2B]/15 bg-[#F4F1ED]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#322B2B]/70">Contact</p>
                <a
                  href="tel:+4915783529270"
                  className="block text-[#322B2B] transition-opacity duration-300 hover:opacity-80"
                >
                  +49 157 83529270
                </a>
                <a
                  href="mailto:info@aaronbowser-photography.com"
                  className="block break-words text-[#322B2B] transition-opacity duration-300 hover:opacity-80"
                >
                  info@aaronbowser-photography.com
                </a>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#322B2B]/70">Address</p>
                <p className="text-[#322B2B]">Aaron Bowser Photography UG (haftungsbeschränkt)</p>
                <p className="text-[#322B2B]">Eckeseyerstr. 133</p>
                <p className="text-[#322B2B]">58089 Hagen, Germany</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#322B2B]/70">Legal</p>
                <p className="text-[#322B2B]">Gericht: Hagen</p>
                <p className="text-[#322B2B]">VAT: DE344108567</p>
                <p className="text-[#322B2B]">HRB: 11957</p>
                <Link href="/impressum" className="inline-block font-medium underline underline-offset-2">
                  Impressum
                </Link>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#322B2B]/70">Privacy</p>
                <a
                  href="/cookie-richtlinie"
                  className="inline-flex items-center gap-2 rounded-md border border-[#322B2B]/15 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#322B2B] transition-colors duration-300 hover:bg-white"
                >
                  <span aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                    </svg>
                  </span>
                  Cookie-Richtlinie
                </a>
                <a
                  href="/datenschutzerklaerung"
                  className="inline-flex items-center gap-2 rounded-md border border-[#322B2B]/15 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#322B2B] transition-colors duration-300 hover:bg-white"
                >
                  <span aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                    </svg>
                  </span>
                  Datenschutzerklärung
                </a>
              </div>
            </div>
          </div>
        </footer>
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
              X
            </button>
            <motion.img
              src={selectedImage}
              alt="Selected portfolio image"
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

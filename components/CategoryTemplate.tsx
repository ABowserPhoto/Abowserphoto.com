"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CategoryContent } from "../lib/content";

type NavItem = {
  slug: string;
  label: string;
};

type CategoryTemplateProps = {
  category: CategoryContent;
  navItems: NavItem[];
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

function hashToUnitInterval(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

export default function CategoryTemplate({ category, navItems }: CategoryTemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [portfolioRowHeight, setPortfolioRowHeight] = useState(260);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const portfolioGridRef = useRef<HTMLDivElement | null>(null);
  const otherServices = useMemo(
    () => navItems.filter((item) => item.slug !== category.slug),
    [category.slug, navItems]
  );
  const portfolioSpanClasses = useMemo(
    () => {
      const images = category.portfolioImages;
      if (images.length === 0) return [];

      const classes = images.map(() => "col-span-1 row-span-1");
      let hasPlacedTall = false;

      images.forEach((image, index) => {
        const tallChance = hashToUnitInterval(`${image}-${index}-tall`);
        if (!hasPlacedTall && tallChance < 0.1) {
          classes[index] = "col-span-1 row-span-1 md:col-span-1 md:row-span-2";
          hasPlacedTall = true;
          return;
        }

        const chance = hashToUnitInterval(`${image}-${index}-weighted`);
        const weightedValue = chance * 100;

        if (weightedValue < 85) {
          classes[index] = "col-span-1 row-span-1";
        } else if (weightedValue < 90) {
          classes[index] = "col-span-1 row-span-1 md:col-span-2 md:row-span-1";
        } else {
          classes[index] = "col-span-1 row-span-1 md:col-span-2 md:row-span-2";
        }
      });

      return classes;
    },
    [category.portfolioImages]
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
      { root: null, rootMargin: "-30% 0px -45% 0px", threshold: [0.2, 0.5, 0.75] }
    );

    sectionLinks.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function updateRowHeight() {
      if (!portfolioGridRef.current) return;

      const containerWidth = portfolioGridRef.current.clientWidth;
      const desktop = window.innerWidth >= 1024;
      const tablet = window.innerWidth >= 768;
      const columns = desktop ? 5 : tablet ? 3 : 1;
      const gap = 5; // gap-[5px]
      const totalGaps = gap * (columns - 1);
      const columnWidth = (containerWidth - totalGaps) / columns;
      // Strict 2:3 base unit so 1x1, 2x1, 1x2, and 2x2 spans stay proportional.
      const baseRowHeight = Math.round(columnWidth * 1.5);
      setPortfolioRowHeight(baseRowHeight);
    }

    updateRowHeight();
    window.addEventListener("resize", updateRowHeight);
    return () => window.removeEventListener("resize", updateRowHeight);
  }, []);

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

  function handleSectionClick(event: React.MouseEvent<HTMLAnchorElement>, sectionId: SectionId) {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(sectionId);
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F4F1ED] text-[#322B2B]">
      <header className="sticky top-0 z-40 border-b border-[#322B2B]/15 bg-[#F4F1ED]/95 md:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 text-[#322B2B]">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#322B2B]/35 bg-white text-[10px] font-semibold tracking-[0.12em]"
              aria-hidden="true"
            >
              LOGO
            </span>
            <span className="text-xs font-semibold tracking-wide sm:text-sm">
              Aaron Bowser | {category.navLabel}
            </span>
          </Link>
          <button
            type="button"
            className="rounded-md border border-[#322B2B]/20 px-3 py-2 text-sm"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="category-mobile-menu"
          >
            Menu
          </button>
        </div>
        {menuOpen ? (
          <nav id="category-mobile-menu" className="space-y-3 border-t border-[#322B2B]/10 px-4 py-4">
            <div className="space-y-1">
              {sectionLinks.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(event) => handleSectionClick(event, section.id)}
                  className="block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300"
                  style={
                    activeSection === section.id
                      ? { backgroundColor: `${category.themeColor}26`, color: category.themeColor }
                      : undefined
                  }
                >
                  {section.label}
                </a>
              ))}
            </div>

            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-center text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
              style={{ backgroundColor: category.themeColor }}
            >
              Book Now
            </Link>

            <div className="border-t border-[#322B2B]/10 pt-2">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#322B2B]/70"
                onClick={() => setExploreOpen((value) => !value)}
                aria-expanded={exploreOpen}
              >
                Explore Options
                <span>{exploreOpen ? "−" : "+"}</span>
              </button>
              {exploreOpen ? (
                <div className="mt-1 space-y-1 pb-1">
                  {otherServices.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className="block rounded-md px-3 py-2 text-sm text-[#322B2B]/85 transition-colors duration-300 hover:bg-[#322B2B]/5"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>
        ) : null}
      </header>

      <aside className="fixed left-0 top-0 hidden h-screen w-56 border-r border-[#322B2B]/10 bg-[#F4F1ED] px-6 py-8 md:flex md:flex-col">
        <Link href="/" className="flex items-center gap-2.5 text-[#322B2B]">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#322B2B]/35 bg-white text-[10px] font-semibold tracking-[0.12em]"
            aria-hidden="true"
          >
            LOGO
          </span>
          <span className="text-xs font-semibold leading-tight tracking-wide">
            Aaron Bowser | {category.navLabel}
          </span>
        </Link>
        <nav className="mt-8 space-y-1.5">
          {sectionLinks.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => handleSectionClick(event, section.id)}
              className="block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300"
              style={
                activeSection === section.id
                  ? { backgroundColor: `${category.themeColor}26`, color: category.themeColor }
                  : { color: "#322B2B" }
              }
            >
              {section.label}
            </a>
          ))}
        </nav>

        <Link
          href="/booking"
          className="mt-6 rounded-md px-3 py-2 text-center text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
          style={{ backgroundColor: category.themeColor }}
        >
          Inquiry
        </Link>

        <div className="mt-auto border-t border-[#322B2B]/10 pt-4">
          <button
            type="button"
            className="mb-2 flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[#322B2B]/70"
            onClick={() => setExploreOpen((value) => !value)}
            aria-expanded={exploreOpen}
          >
            Explore Options
            <span>{exploreOpen ? "−" : "+"}</span>
          </button>
          {exploreOpen ? (
            <div className="space-y-1">
              {otherServices.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="block rounded-md px-3 py-2 text-xs font-medium text-[#322B2B]/85 transition-colors duration-300 hover:bg-[#322B2B]/5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </aside>

      <main className="md:ml-56">
        <section id="hero" className="relative h-[70vh] overflow-hidden md:h-[90vh]">
          {category.heroVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={category.heroImage}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={category.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={category.heroImage}
              alt={category.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-[#322B2B]/58" />
          <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-12 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-2xl rounded-2xl border border-white/10 bg-[#322B2B]/55 p-6 backdrop-blur-sm sm:p-8"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-3xl font-bold text-[#F4F1ED] sm:text-5xl">{category.title}</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#F4F1ED]/90 sm:text-base">{category.subtitle}</p>
            </motion.div>
          </div>
        </section>

        <motion.section
          id="portfolio"
          className="w-full border-y border-[#1a1a1a] bg-[#000000] py-14"
          {...fadeUp}
        >
          <motion.div className="mb-6 px-0 text-center" {...fadeUp}>
            <h2 className="text-2xl font-semibold text-[#F4F1ED]">Portfolio</h2>
            <span className="mt-1 block text-sm font-medium text-[#F4F1ED]/85">
              {category.portfolioImages.length} showcase images
            </span>
          </motion.div>
          <div
            ref={portfolioGridRef}
            className="grid grid-cols-1 grid-flow-dense gap-[5px] md:grid-cols-3 lg:grid-cols-5"
            style={{ gridAutoRows: `${portfolioRowHeight}px` }}
          >
            {category.portfolioImages.map((image, index) => (
              <motion.div
                key={image}
                className={`${portfolioSpanClasses[index]} group relative overflow-hidden rounded-none border border-[#1f1f1f] bg-[#202020] shadow-sm transition-[opacity,border-color,box-shadow,filter] duration-300 ${
                  hoveredImage && hoveredImage !== image ? "opacity-50" : "opacity-100"
                }`}
                style={{ borderColor: index === 0 ? `${category.themeColor}55` : undefined }}
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
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`${category.title} portfolio ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 100vw"
                  className="rounded-none object-cover object-top transition duration-300 group-hover:brightness-110"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" {...fadeUp}>
          <motion.div className="mb-10" {...fadeUp}>
            <h2 className="text-3xl font-semibold text-[#322B2B]">Services</h2>
          </motion.div>

          <div className="space-y-10">
            {category.services.map((service, index) => {
              const reverse = index % 2 === 1;
              return (
                <motion.article
                  key={service.name}
                  className="grid overflow-hidden rounded-2xl border border-[#322B2B]/10 bg-white shadow-sm md:grid-cols-2"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.22 }}
                  transition={{ duration: 0.75, delay: 0.08, ease: "easeOut" }}
                >
                  <div className={reverse ? "order-1 md:order-2" : "order-1"}>
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-64 w-full object-cover sm:h-72 md:h-full md:min-h-[22rem]"
                    />
                  </div>
                  <div className={reverse ? "order-2 md:order-1" : "order-2"}>
                    <div className="flex h-full flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">
                      <span
                        className="mb-3 inline-block h-1 w-14 rounded-full"
                        style={{ backgroundColor: category.themeColor }}
                        aria-hidden="true"
                      />
                      <h3 className="text-2xl font-semibold text-[#322B2B]">{service.name}</h3>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#322B2B]/80 sm:text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-10 flex justify-start">
            <a
              href="mailto:hello@abowserphoto.com"
              className="rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
              style={{ backgroundColor: category.themeColor }}
            >
              Contact
            </a>
          </div>
        </motion.section>

        <motion.section id="about" className="bg-white/65 py-20" {...fadeUp}>
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
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
              <img
                src={category.aboutImage}
                alt={`${category.title} about`}
                className="relative h-80 w-full rounded-2xl border object-cover shadow-sm sm:h-96"
                style={{ borderColor: `${category.themeColor}66` }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-semibold text-[#322B2B]">About Me</h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#322B2B]/80 sm:text-base">
                {category.aboutText}
              </p>
              <a
                href="mailto:hello@abowserphoto.com"
                className="mt-8 inline-flex rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
                style={{ backgroundColor: category.themeColor }}
              >
                Contact
              </a>
            </motion.div>
          </div>
        </motion.section>

        <motion.section id="faq" className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8" {...fadeUp}>
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-6 space-y-3">
            {category.faq.map((item, index) => {
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

        <footer className="border-t border-[#322B2B]/15 bg-[#F4F1ED]">
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

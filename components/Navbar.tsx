"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useState } from "react";

export type NavbarSection = {
  id: string;
  label: string;
};

type NavbarProps = {
  logoUrl: string | null;
  sections: NavbarSection[];
  activeSection: string;
  onSectionClick: (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
  themeColor: string;
  lightSectionRef?: React.RefObject<HTMLElement | null>;
  bookHref?: string;
};

function NavbarLogo({
  logoUrl,
  lightOpacity,
  darkOpacity,
}: {
  logoUrl: string | null;
  lightOpacity: MotionValue<number>;
  darkOpacity: MotionValue<number>;
}) {
  const isSvg = logoUrl?.toLowerCase().endsWith(".svg");

  return (
    <Link href="/" className="relative block h-9 w-9 shrink-0" aria-label="Aaron Bowser Photography home">
      {logoUrl ? (
        <>
          <motion.span className="absolute inset-0" style={{ opacity: lightOpacity }}>
            {isSvg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="h-9 w-9 object-contain brightness-0 invert" />
            ) : (
              <Image
                src={logoUrl}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 object-contain brightness-0 invert"
                priority
              />
            )}
          </motion.span>
          <motion.span className="absolute inset-0" style={{ opacity: darkOpacity }}>
            {isSvg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="h-9 w-9 object-contain" />
            ) : (
              <Image src={logoUrl} alt="" width={36} height={36} className="h-9 w-9 object-contain" priority />
            )}
          </motion.span>
        </>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/30 bg-white/10 text-[9px] font-semibold tracking-[0.12em] text-[#F4F1ED]">
          LOGO
        </span>
      )}
    </Link>
  );
}

export default function Navbar({
  logoUrl,
  sections,
  activeSection,
  onSectionClick,
  themeColor,
  lightSectionRef,
  bookHref = "/booking",
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress: lightProgress } = useScroll({
    target: lightSectionRef,
    offset: ["start 85%", "start 25%"],
  });

  const blend = useTransform(lightProgress, [0, 1], [0, 1]);
  const headerBg = useTransform(blend, [0, 1], ["rgba(0, 0, 0, 0.12)", "rgba(244, 241, 237, 0.94)"]);
  const headerBorder = useTransform(blend, [0, 1], ["rgba(255, 255, 255, 0.08)", "rgba(50, 43, 43, 0.12)"]);
  const backdropBlur = useTransform(blend, [0, 1], ["blur(6px)", "blur(14px)"]);
  const headerShadow = useTransform(
    blend,
    [0, 1],
    ["0 0 0 rgba(0,0,0,0)", "0 12px 40px rgba(50, 43, 43, 0.08)"]
  );

  const linkColor = useTransform(blend, [0, 1], ["rgba(244, 241, 237, 0.88)", "rgba(50, 43, 43, 0.82)"]);
  const logoLightOpacity = useTransform(blend, [0, 0.45, 1], [1, 0, 0]);
  const logoDarkOpacity = useTransform(blend, [0, 0.55, 1], [0, 1, 1]);
  const bookBorder = useTransform(blend, [0, 1], ["rgba(244, 241, 237, 0.35)", "rgba(50, 43, 43, 0.25)"]);
  const bookText = useTransform(blend, [0, 1], ["rgba(244, 241, 237, 1)", "rgba(50, 43, 43, 0.95)"]);
  const menuBorder = useTransform(blend, [0, 1], ["rgba(255, 255, 255, 0.25)", "rgba(50, 43, 43, 0.2)"]);
  const menuText = useTransform(blend, [0, 1], ["rgba(244, 241, 237, 1)", "rgba(50, 43, 43, 0.9)"]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 48);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [menuOpen]);

  function handleSectionClick(event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) {
    onSectionClick(event, sectionId);
    setMenuOpen(false);
  }

  const pageSections = sections.filter((section) => section.id !== "hero");
  const showBar = scrolled || Boolean(lightSectionRef);

  return (
    <motion.header
      className="fixed top-0 z-50 w-full border-b"
      style={{
        backgroundColor: showBar ? headerBg : "rgba(0,0,0,0)",
        borderColor: showBar ? headerBorder : "rgba(255,255,255,0)",
        backdropFilter: showBar ? backdropBlur : "blur(0px)",
        boxShadow: showBar ? headerShadow : "none",
      }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <NavbarLogo logoUrl={logoUrl} lightOpacity={logoLightOpacity} darkOpacity={logoDarkOpacity} />

        <nav className="hidden items-center gap-8 md:flex">
          <motion.a
            href="/"
            className="text-[11px] font-medium uppercase tracking-[0.22em]"
            style={{ color: linkColor }}
          >
            Home
          </motion.a>
          {pageSections.map((section) =>
            activeSection === section.id ? (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(event) => handleSectionClick(event, section.id)}
                className="text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300"
                style={{ color: themeColor }}
              >
                {section.label}
              </a>
            ) : (
              <motion.a
                key={section.id}
                href={`#${section.id}`}
                onClick={(event) => handleSectionClick(event, section.id)}
                className="text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300"
                style={{ color: linkColor }}
              >
                {section.label}
              </motion.a>
            )
          )}
          <motion.div className="rounded-full border px-4 py-2" style={{ borderColor: bookBorder }}>
            <Link href={bookHref}>
              <motion.span
                className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: bookText }}
              >
                Book
              </motion.span>
            </Link>
          </motion.div>
        </nav>

        <motion.button
          type="button"
          className="rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] md:hidden"
          style={{ borderColor: menuBorder, color: menuText }}
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navbar-menu"
        >
          Menu
        </motion.button>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-navbar-menu"
          className="border-t border-[#322B2B]/10 bg-[#F4F1ED]/95 px-5 py-4 backdrop-blur-md md:hidden"
        >
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-[#322B2B]/90"
            >
              Home
            </Link>
            {pageSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(event) => handleSectionClick(event, section.id)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-300"
                style={
                  activeSection === section.id
                    ? { color: themeColor, backgroundColor: `${themeColor}22` }
                    : { color: "rgba(50, 43, 43, 0.9)" }
                }
              >
                {section.label}
              </a>
            ))}
            <Link
              href={bookHref}
              onClick={() => setMenuOpen(false)}
              className="mt-2 block rounded-md px-3 py-2.5 text-center text-sm font-semibold text-[#F4F1ED]"
              style={{ backgroundColor: themeColor }}
            >
              Book
            </Link>
          </div>
        </nav>
      ) : null}
    </motion.header>
  );
}

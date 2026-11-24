"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BOOKING_HREF, bookingHref, requestOpenBooking } from "../lib/booking";
import AccountNav from "./AccountNav";
import LanguageSwitcher from "./LanguageSwitcher";

export type NavbarSection = {
  id: string;
  label: string;
};

export type NavbarServiceLink = {
  href: string;
  label: string;
  themeColor: string;
};

type NavbarProps = {
  logoUrl: string | null;
  sections: NavbarSection[];
  activeSection: string;
  onSectionClick: (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
  themeColor: string;
  lightSectionRef?: React.RefObject<HTMLElement | null>;
  bookHref?: string;
  homeHref?: string;
  labels?: {
    book?: string;
    home?: string;
    menu?: string;
    services?: string;
  };
  serviceLinks?: NavbarServiceLink[];
};

function NavbarLogo({
  logoUrl,
  homeHref,
  lightOpacity,
  darkOpacity,
}: {
  logoUrl: string | null;
  homeHref: string;
  lightOpacity: MotionValue<number>;
  darkOpacity: MotionValue<number>;
}) {
  const isSvg = logoUrl?.toLowerCase().endsWith(".svg");

  return (
    <Link href={homeHref} className="relative block h-9 w-9 shrink-0" aria-label="Aaron Bowser Photography home">
      {logoUrl ? (
        <>
          <motion.span className="absolute inset-0" style={{ opacity: lightOpacity }}>
            {isSvg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Aaron Bowser Photography Logo" className="h-9 w-9 object-contain brightness-0 invert" />
            ) : (
              <Image
                src={logoUrl}
                alt="Aaron Bowser Photography Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain brightness-0 invert"
                priority
              />
            )}
          </motion.span>
          <motion.span className="absolute inset-0" style={{ opacity: darkOpacity }} aria-hidden="true">
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

function ServicesMenu({
  label,
  themeColor,
  linkColor,
  active,
  links,
  onSectionClick,
}: {
  label: string;
  themeColor: string;
  linkColor: MotionValue<string> | string;
  active: boolean;
  links: NavbarServiceLink[];
  onSectionClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [triggerHover, setTriggerHover] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  function focusItem(index: number) {
    const items = menuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]');
    if (!items?.length) return;
    const next = items[(index + items.length) % items.length];
    next?.focus();
  }

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  function onMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = menuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]');
    const current = items ? Array.from(items).findIndex((item) => item === document.activeElement) : -1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(current + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(current <= 0 ? (items?.length ?? 1) - 1 : current - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setOpen(true);
        setTriggerHover(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
        setTriggerHover(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <motion.a
        ref={triggerRef}
        href="#services"
        onClick={onSectionClick}
        onFocus={() => setOpen(true)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="services-menu"
        className="text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300"
        style={{ color: active || triggerHover || open ? themeColor : linkColor }}
      >
        {label}
      </motion.a>
      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-64 -translate-x-1/2 pt-3">
          <div
            ref={menuRef}
            id="services-menu"
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKeyDown}
            className="border border-[#322B2B]/10 bg-[#F4F1ED]/95 py-2 shadow-[0_12px_40px_rgba(50,43,43,0.08)] backdrop-blur-md"
          >
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                role="menuitem"
                className="block px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#322B2B]/85 transition-colors duration-300 hover:bg-[#322B2B]/5 focus-visible:bg-[#322B2B]/5"
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = item.themeColor;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = "";
                }}
                onFocus={(event) => {
                  event.currentTarget.style.color = item.themeColor;
                }}
                onBlur={(event) => {
                  event.currentTarget.style.color = "";
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default function Navbar({
  logoUrl,
  sections,
  activeSection,
  onSectionClick,
  themeColor,
  lightSectionRef,
  bookHref = BOOKING_HREF,
  homeHref = "/",
  labels,
  serviceLinks = [],
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [bookHover, setBookHover] = useState(false);
  const pathname = usePathname();
  const resolvedBookHref = bookHref === BOOKING_HREF ? bookingHref(pathname) : bookHref;
  const bookLabel = labels?.book ?? "Book";
  const homeLabel = labels?.home ?? "Home";
  const menuLabel = labels?.menu ?? "Menu";

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
  const menuBorder = useTransform(blend, [0, 1], ["rgba(244, 241, 237, 0.55)", "rgba(50, 43, 43, 0.28)"]);
  const menuText = useTransform(blend, [0, 1], ["rgba(244, 241, 237, 1)", "rgba(50, 43, 43, 0.95)"]);
  const menuBg = useTransform(blend, [0, 1], ["rgba(50, 43, 43, 0.86)", "rgba(244, 241, 237, 0.94)"]);

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
        <NavbarLogo
          logoUrl={logoUrl}
          homeHref={homeHref}
          lightOpacity={logoLightOpacity}
          darkOpacity={logoDarkOpacity}
        />

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href={homeHref}
            onMouseEnter={() => setHoveredNav("home")}
            onMouseLeave={() => setHoveredNav(null)}
            onFocus={() => setHoveredNav("home")}
            onBlur={() => setHoveredNav(null)}
          >
            <motion.span
              className="text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300"
              style={{ color: hoveredNav === "home" ? themeColor : linkColor }}
            >
              {homeLabel}
            </motion.span>
          </Link>
          {pageSections.map((section) =>
            section.id === "services" && serviceLinks.length > 0 ? (
              <ServicesMenu
                key={section.id}
                label={labels?.services ?? section.label}
                themeColor={themeColor}
                linkColor={hoveredNav === section.id ? themeColor : linkColor}
                active={activeSection === section.id}
                links={serviceLinks}
                onSectionClick={(event) => handleSectionClick(event, section.id)}
              />
            ) : activeSection === section.id ? (
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
                onMouseEnter={() => setHoveredNav(section.id)}
                onMouseLeave={() => setHoveredNav(null)}
                onFocus={() => setHoveredNav(section.id)}
                onBlur={() => setHoveredNav(null)}
                className="text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300"
                style={{ color: hoveredNav === section.id ? themeColor : linkColor }}
              >
                {section.label}
              </motion.a>
            )
          )}
          <motion.div
            className="rounded-full border px-4 py-2 transition-colors duration-300"
            style={{
              borderColor: bookHover ? themeColor : bookBorder,
              backgroundColor: bookHover ? themeColor : "transparent",
            }}
            onMouseEnter={() => setBookHover(true)}
            onMouseLeave={() => setBookHover(false)}
          >
            <Link href={resolvedBookHref} scroll={false} onClick={() => requestOpenBooking()}>
              <motion.span
                className="text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300"
                style={{ color: bookHover ? "#322B2B" : bookText }}
              >
                {bookLabel}
              </motion.span>
            </Link>
          </motion.div>
          <motion.div style={{ color: bookText }}>
            <AccountNav />
          </motion.div>
          <motion.div style={{ color: linkColor }}>
            <LanguageSwitcher />
          </motion.div>
        </nav>

        <motion.button
          type="button"
          className="inline-flex h-12 min-w-12 shrink-0 items-center justify-center rounded-md border px-3.5 text-[11px] font-semibold uppercase tracking-[0.15em] shadow-[0_10px_28px_rgba(0,0,0,0.28)] md:hidden"
          style={{ borderColor: menuBorder, color: menuText, backgroundColor: menuBg }}
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navbar-menu"
        >
          {menuLabel}
        </motion.button>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-navbar-menu"
          className="border-t border-[#322B2B]/10 bg-[#F4F1ED]/95 px-5 py-4 backdrop-blur-md md:hidden"
        >
          <div className="space-y-1">
            <Link
              href={homeHref}
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-[#322B2B]/90"
            >
              {homeLabel}
            </Link>
            {pageSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(event) => handleSectionClick(event, section.id)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-300 hover:!text-[var(--brand)]"
                style={
                  activeSection === section.id
                    ? {
                        color: themeColor,
                        backgroundColor: `${themeColor}22`,
                        ["--brand" as string]: themeColor,
                      }
                    : { color: "rgba(50, 43, 43, 0.9)", ["--brand" as string]: themeColor }
                }
              >
                {section.label}
              </a>
            ))}
            <Link
              href={resolvedBookHref}
              scroll={false}
              onClick={() => {
                requestOpenBooking();
                setMenuOpen(false);
              }}
              className="mt-2 block rounded-md px-3 py-2.5 text-center text-sm font-semibold text-[#F4F1ED] transition-colors duration-300 hover:!bg-[#F4F1ED] hover:!text-[var(--brand)]"
              style={{ backgroundColor: themeColor, ["--brand" as string]: themeColor }}
            >
              {bookLabel}
            </Link>
            <AccountNav variant="mobile" onNavigated={() => setMenuOpen(false)} />
            <div className="border-t border-[#322B2B]/10 pt-3">
              <LanguageSwitcher onNavigated={() => setMenuOpen(false)} className="flex items-center gap-1.5 px-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#322B2B]/90" />
            </div>
          </div>
        </nav>
      ) : null}
    </motion.header>
  );
}

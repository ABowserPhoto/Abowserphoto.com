"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  slug: string;
  label: string;
};

type SiteNavigationProps = {
  categories: NavItem[];
  activeSlug: string;
  accentColor: string;
};

export default function SiteNavigation({
  categories,
  activeSlug,
  accentColor,
}: SiteNavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
            A. Bowser Photo
          </Link>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            Menu
          </button>
        </div>
        {open ? (
          <nav id="mobile-nav" className="mx-auto mt-3 max-w-7xl space-y-1 pb-2">
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="block rounded px-3 py-2 text-sm font-medium text-slate-800"
                style={item.slug === activeSlug ? { backgroundColor: `${accentColor}22`, color: accentColor } : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white px-7 py-10 md:block">
        <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
          A. Bowser Photo
        </Link>
        <p className="mt-2 text-sm text-slate-600">Visual storytelling across multiple niches</p>
        <nav className="mt-10 space-y-2">
          {categories.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="block rounded-md px-3 py-2 text-sm font-semibold transition-colors"
              style={
                item.slug === activeSlug
                  ? { backgroundColor: `${accentColor}22`, color: accentColor }
                  : { color: "#334155" }
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

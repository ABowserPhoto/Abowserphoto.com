/**
 * robots.txt and sitemap.xml for niche hosts. The www files stay in
 * `app/robots.ts` and `app/sitemap.ts`. `proxy.ts` serves these only when the
 * request host is a niche host, and does not redirect that host.
 */
import type { MetadataRoute } from "next";
import type { Locale } from "./i18n/config";
import { withLocale } from "./i18n/config";
import { categoryPath } from "./routes";
import { nicheHostForHostname, nicheOrigin, type NicheHost } from "./subdomains";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function nicheSitemapEntries(host: string): MetadataRoute.Sitemap {
  const niche = nicheHostForHostname(host);
  if (!niche) return [];
  const origin = nicheOrigin(niche.subdomain, host);
  const de = `${origin}/de`;
  const en = `${origin}/en`;
  const landingAlternates = {
    languages: {
      de,
      en,
      "x-default": de,
    },
  };
  const entries: MetadataRoute.Sitemap = [
    { url: de, lastModified: new Date(), alternates: landingAlternates },
    { url: en, lastModified: new Date(), alternates: landingAlternates },
  ];

  if (niche.slug === "commercial") {
    const portfolioFor = (locale: Locale) =>
      `${origin}${withLocale(`${categoryPath("commercial", locale)}/portfolio`, locale)}`;
    const dePortfolio = portfolioFor("de");
    const enPortfolio = portfolioFor("en");
    const portfolioAlternates = {
      languages: {
        de: dePortfolio,
        en: enPortfolio,
        "x-default": dePortfolio,
      },
    };
    entries.push(
      { url: dePortfolio, lastModified: new Date(), alternates: portfolioAlternates },
      { url: enPortfolio, lastModified: new Date(), alternates: portfolioAlternates }
    );
  }

  return entries;
}

/** Plain-text robots.txt. No `Host:` line. Sitemap is this host's own file. */
export function renderNicheRobots(host: string) {
  const niche = nicheHostForHostname(host);
  if (!niche) return "";
  return `User-Agent: *\nAllow: /\nDisallow: /api/\nDisallow: /auth/\n\nSitemap: ${nicheCrawlSitemapUrl(niche, host)}\n`;
}

export function renderNicheSitemap(host: string) {
  const entries = nicheSitemapEntries(host);
  let content = '<?xml version="1.0" encoding="UTF-8"?>\n';
  content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const item of entries) {
    content += "<url>\n";
    content += `<loc>${escapeXml(item.url)}</loc>\n`;
    const languages = item.alternates?.languages;
    if (languages) {
      for (const [language, href] of Object.entries(languages)) {
        if (!href) continue;
        content += `<xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(href)}" />\n`;
      }
    }
    if (item.lastModified) {
      const serialized =
        item.lastModified instanceof Date ? item.lastModified.toISOString() : item.lastModified;
      content += `<lastmod>${serialized}</lastmod>\n`;
    }
    content += "</url>\n";
  }
  content += "</urlset>\n";
  return content;
}

export function nicheCrawlSitemapUrl(niche: NicheHost, host?: string | null) {
  return `${nicheOrigin(niche.subdomain, host)}/sitemap.xml`;
}

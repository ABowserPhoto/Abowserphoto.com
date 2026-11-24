import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import { HAGEN_ADDRESS, SOLINGEN_ADDRESS } from "./contact";
import { getDictionarySync } from "./i18n/getDictionary";
import { buildCategoryMetadata } from "./i18n/seo";
import { getLocalizedCategory } from "./i18n/localizeContent";
import { renderNicheRobots, renderNicheSitemap } from "./niche-crawl";
import { NICHE_LANDING_COPY, NICHE_LANDING_SLUGS, nicheDocumentCopy } from "./niche-landing";
import { PORTAL_CATEGORY_SUBDOMAIN } from "./subdomains";

const NICHES = NICHE_LANDING_SLUGS.map((slug) => ({
  slug,
  sub: PORTAL_CATEGORY_SUBDOMAIN[slug],
}));

function absoluteTitle(title: unknown) {
  if (title && typeof title === "object" && "absolute" in title) {
    return String(title.absolute);
  }
  return String(title);
}

function request(host: string, pathname: string) {
  return new NextRequest(`https://${host}${pathname}`, { headers: { host } });
}

test("niche hosts use their own German and English title, description, and H1", () => {
  const seenTitles = new Set<string>();
  const seenDescriptions = new Set<string>();
  const seenH1s = new Set<string>();

  for (const entry of NICHES) {
    for (const locale of ["de", "en"] as const) {
      const host = `${entry.sub}.abowserphoto.com`;
      const copy = NICHE_LANDING_COPY[entry.slug][locale];
      const dictionary = getDictionarySync(locale).seo[entry.slug];
      const onHost = buildCategoryMetadata(locale, entry.slug, host);
      const onWww = buildCategoryMetadata(locale, entry.slug, "www.aaronbowser-photography.com");
      const heading = getLocalizedCategory(entry.slug, locale).title;

      assert.equal(absoluteTitle(onHost.title), copy.title);
      assert.equal(onHost.description, copy.description);
      assert.equal(onHost.openGraph?.title, copy.title);
      assert.equal(onHost.openGraph?.description, copy.description);
      assert.equal(nicheDocumentCopy(entry.slug, locale, host)?.h1, copy.h1);

      assert.equal(absoluteTitle(onWww.title), dictionary.title);
      assert.equal(onWww.description, dictionary.description);
      assert.equal(nicheDocumentCopy(entry.slug, locale, "www.aaronbowser-photography.com"), null);
      assert.equal(nicheDocumentCopy(entry.slug, locale, null), null);

      assert.notEqual(copy.title, dictionary.title);
      assert.notEqual(copy.description, dictionary.description);
      assert.notEqual(copy.h1, heading);
      assert.equal(seenTitles.has(copy.title), false, copy.title);
      assert.equal(seenDescriptions.has(copy.description), false, copy.description);
      assert.equal(seenH1s.has(copy.h1), false, copy.h1);
      seenTitles.add(copy.title);
      seenDescriptions.add(copy.description);
      seenH1s.add(copy.h1);

      assert.ok(copy.title.length <= 60, `${copy.title} (${copy.title.length})`);
      assert.ok(copy.description.length <= 155, `${copy.description} (${copy.description.length})`);
      assert.equal(copy.title.includes("€"), false);
      assert.equal(copy.description.includes("€"), false);
      assert.equal(copy.h1.includes("€"), false);
      assert.equal(/preis|price/i.test(`${copy.title} ${copy.description} ${copy.h1}`), false);

      assert.equal(onHost.alternates?.canonical, `https://${entry.sub}.abowserphoto.com/${locale}`);
    }
  }

  const german = NICHE_LANDING_COPY;
  assert.match(german.wedding.de.title, /Hochzeitsfotograf Hagen/);
  assert.match(german.wedding.de.h1, /Hochzeitsfotograf/);
  assert.match(german["real-estate"].de.title, /Immobilienfotograf/);
  assert.match(german["real-estate"].de.h1, /Immobilienfotograf/);
  assert.match(german.food.de.title, /Food-Fotograf/);
  assert.match(german.food.de.h1, /Food-Fotografie/);
  assert.match(german["business-portraits"].de.title, /Mitarbeiterfotos/);
  assert.match(german["business-portraits"].de.h1, /Mitarbeiterfotos/);
  assert.match(german.commercial.de.title, /Werbefotograf/);
  assert.match(german.commercial.de.h1, /Werbe- und Produktfotografie/);

  for (const copy of Object.values(german)) {
    assert.ok(copy.de.description.length > 40);
    assert.ok(copy.en.description.length > 40);
  }
  assert.match(german.wedding.de.description, /Hagen/);
  assert.match(german.wedding.de.description, /Solingen/);
});

test("a niche host does not pick up another niche's document copy", () => {
  assert.equal(nicheDocumentCopy("wedding", "de", "immo.abowserphoto.com"), null);
  assert.equal(
    absoluteTitle(buildCategoryMetadata("de", "studio", "studio.abowserphoto.com").title),
    getDictionarySync("de").seo.studio.title
  );
  assert.equal(
    absoluteTitle(buildCategoryMetadata("de", "cinematography", "film.abowserphoto.com").title),
    "Videograf Hagen | Imagefilm, Hochzeitsfilm & Reels"
  );
  assert.notEqual(
    absoluteTitle(buildCategoryMetadata("de", "cinematography", "www.aaronbowser-photography.com").title),
    absoluteTitle(buildCategoryMetadata("de", "cinematography", "film.abowserphoto.com").title)
  );
});

test("niche robots.txt drops Host and points at that host's sitemap", () => {
  for (const entry of NICHES) {
    const host = `${entry.sub}.abowserphoto.com`;
    const text = renderNicheRobots(host);
    assert.equal(text.includes("Host:"), false);
    assert.equal(text.includes("aaronbowser-photography.com"), false);
    assert.match(text, new RegExp(`Sitemap: https://${entry.sub}\\.abowserphoto\\.com/sitemap\\.xml\\n$`));
    assert.match(text, /^User-Agent: \*\nAllow: \/\nDisallow: \/api\/\nDisallow: \/auth\/\n\n/);
  }

  const local = renderNicheRobots("food.localhost:3001");
  assert.equal(local.includes("Host:"), false);
  assert.match(local, /Sitemap: http:\/\/food\.localhost:3001\/sitemap\.xml\n$/);

  const studio = renderNicheRobots("studio.abowserphoto.com");
  assert.equal(studio.includes("Host:"), false);
  assert.match(studio, /Sitemap: https:\/\/studio\.abowserphoto\.com\/sitemap\.xml\n$/);
  const film = renderNicheRobots("film.abowserphoto.com");
  assert.match(film, /Sitemap: https:\/\/film\.abowserphoto\.com\/sitemap\.xml\n$/);
});

test("each niche sitemap lists only that host's own URLs", () => {
  for (const entry of [
    ...NICHES,
    { slug: "studio" as const, sub: "studio" },
    { slug: "cinematography" as const, sub: "film" },
    { slug: "social-media-management" as const, sub: "social" },
  ]) {
    const xml = renderNicheSitemap(`${entry.sub}.abowserphoto.com`);
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    assert.equal(xml.includes("aaronbowser-photography.com"), false, entry.sub);
    assert.equal(xml.includes("impressum"), false);
    for (const loc of locs) {
      assert.equal(loc?.startsWith(`https://${entry.sub}.abowserphoto.com/`), true, loc);
    }
    assert.equal(locs[0], `https://${entry.sub}.abowserphoto.com/de`);
    assert.equal(locs[1], `https://${entry.sub}.abowserphoto.com/en`);
    if (entry.slug === "commercial") {
      assert.deepEqual(locs, [
        "https://commercial.abowserphoto.com/de",
        "https://commercial.abowserphoto.com/en",
        "https://commercial.abowserphoto.com/de/commercial-fotografie/portfolio",
        "https://commercial.abowserphoto.com/en/commercial/portfolio",
      ]);
    } else {
      assert.equal(locs.length, 2, entry.sub);
    }
    assert.match(xml, /hreflang="x-default" href="https:\/\/[^"]+\/de"/);
  }

  const local = renderNicheSitemap("immo.localhost:3001");
  assert.match(local, /<loc>http:\/\/immo\.localhost:3001\/de<\/loc>/);
  assert.equal(local.includes("abowserphoto.com"), false);
});

test("proxy serves niche crawl files in place and leaves www on the app routes", async () => {
  const robots = await proxy(request("immo.abowserphoto.com", "/robots.txt"));
  assert.equal(robots.status, 200);
  assert.equal(robots.headers.get("location"), null);
  assert.equal(robots.headers.get("x-middleware-rewrite"), null);
  const robotsBody = await robots.text();
  assert.equal(robotsBody.includes("Host:"), false);
  assert.match(robotsBody, /Sitemap: https:\/\/immo\.abowserphoto\.com\/sitemap\.xml/);

  const sitemap = await proxy(request("wedding.abowserphoto.com", "/sitemap.xml"));
  assert.equal(sitemap.status, 200);
  assert.equal(sitemap.headers.get("location"), null);
  const sitemapBody = await sitemap.text();
  assert.match(sitemapBody, /<loc>https:\/\/wedding\.abowserphoto\.com\/de<\/loc>/);
  assert.equal(sitemapBody.includes("aaronbowser-photography.com"), false);

  for (const host of ["www.aaronbowser-photography.com", "aaronbowser-photography.com"]) {
    for (const pathname of ["/robots.txt", "/sitemap.xml"]) {
      const response = await proxy(request(host, pathname));
      assert.equal(response.headers.get("x-middleware-next"), "1", `${host} ${pathname}`);
      assert.equal(response.headers.get("location"), null, `${host} ${pathname}`);
      assert.equal(response.status, 200, `${host} ${pathname}`);
    }
  }
});

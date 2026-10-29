import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import { buildCategoryMetadata, buildLegalMetadata, buildSimplePageMetadata } from "./i18n/seo";
import { CATEGORY_SEGMENTS } from "./routes";
import {
  NICHE_HOSTS,
  PORTAL_CATEGORY_ORDER,
  PORTAL_CATEGORY_SUBDOMAIN,
  getSubdomainUrl,
  isNicheOnHostPath,
  nicheHostForHostname,
  nicheLocaleSwitchPath,
  portalCategoryUrl,
  type PortalCategory,
} from "./subdomains";

const CASES: Array<{
  slug: PortalCategory;
  sub: string;
  en: string;
  de: string;
}> = [
  { slug: "commercial", sub: "commercial", en: "commercial", de: "commercial-fotografie" },
  { slug: "real-estate", sub: "immo", en: "real-estate", de: "immobilienfotografie" },
  { slug: "wedding", sub: "wedding", en: "wedding", de: "hochzeitsfotograf" },
  { slug: "food", sub: "food", en: "food", de: "food-fotografie" },
  { slug: "business-portraits", sub: "business", en: "business-portraits", de: "business-portraits" },
  { slug: "cinematography", sub: "film", en: "cinematography", de: "filmproduktion" },
  { slug: "social-media-management", sub: "social", en: "social-media-management", de: "social-media" },
  { slug: "studio", sub: "studio", en: "application-photos", de: "bewerbungsfotos" },
];

function request(host: string, pathname: string, init?: { language?: string; cookie?: string }) {
  const headers = new Headers({ host });
  if (init?.language) headers.set("accept-language", init.language);
  if (init?.cookie) headers.set("cookie", init.cookie);
  const protocol = host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return new NextRequest(`${protocol}://${host}${pathname}`, { headers });
}

function rewriteUrl(response: Response) {
  const value = response.headers.get("x-middleware-rewrite");
  return value ? new URL(value) : null;
}

function locationUrl(response: Response) {
  const value = response.headers.get("location");
  return value ? new URL(value) : null;
}

test("portal map covers the eight categories and their public segments", () => {
  assert.deepEqual(PORTAL_CATEGORY_ORDER, CASES.map((entry) => entry.slug));
  assert.equal(NICHE_HOSTS.length, 8);
  for (const entry of CASES) {
    assert.equal(PORTAL_CATEGORY_SUBDOMAIN[entry.slug], entry.sub);
    assert.equal(CATEGORY_SEGMENTS[entry.slug].en, entry.en);
    assert.equal(CATEGORY_SEGMENTS[entry.slug].de, entry.de);
    const niche = NICHE_HOSTS.find((host) => host.slug === entry.slug);
    assert.ok(niche);
    assert.equal(niche.prefix, `${entry.sub}.`);
    assert.equal(niche.basePath, `/${entry.en}`);
  }
});

test("portal links always use the short apex, including from the long domain", () => {
  const hosts = [
    "www.aaronbowser-photography.com",
    "aaronbowser-photography.com",
    "www.abowserphoto.com",
    "abowserphoto.com",
    "preview-abc.vercel.app",
  ];
  for (const host of hosts) {
    for (const entry of CASES) {
      for (const locale of ["de", "en"] as const) {
        assert.equal(
          portalCategoryUrl(entry.slug, { host, locale }),
          `https://${entry.sub}.abowserphoto.com/${locale}`
        );
      }
    }
  }
  assert.equal(
    getSubdomainUrl("social", { host: "www.aaronbowser-photography.com", locale: "de" }),
    "https://social.abowserphoto.com/de"
  );
});

test("localhost portal links stay on localhost and keep the dev port", () => {
  assert.equal(
    portalCategoryUrl("business-portraits", { host: "localhost:3001", locale: "de" }),
    "http://business.localhost:3001/de"
  );
  assert.equal(
    portalCategoryUrl("food", { host: "immo.localhost:3001", locale: "en" }),
    "http://food.localhost:3001/en"
  );
  assert.equal(
    portalCategoryUrl("wedding", { host: "127.0.0.1:3001", locale: "en" }),
    "http://wedding.localhost:3001/en"
  );
  assert.equal(portalCategoryUrl("studio", { locale: "en" }), "https://studio.abowserphoto.com/en");
});

test("niche hostnames resolve for the short apex, the long apex, and localhost", () => {
  for (const entry of CASES) {
    for (const host of [
      `${entry.sub}.abowserphoto.com`,
      `${entry.sub}.aaronbowser-photography.com`,
      `${entry.sub}.localhost:3001`,
    ]) {
      const niche = nicheHostForHostname(host);
      assert.equal(niche?.slug, entry.slug);
    }
  }
  assert.equal(nicheHostForHostname("www.aaronbowser-photography.com"), null);
  assert.equal(nicheHostForHostname("abowserphoto.com"), null);
  assert.equal(nicheHostForHostname("localhost:3001"), null);
});

test("each niche host rewrites its landing page on-host in both locales", async () => {
  for (const entry of CASES) {
    const host = `${entry.sub}.abowserphoto.com`;
    const german = await proxy(request(host, "/", { language: "de" }));
    const germanRewrite = rewriteUrl(german);
    assert.equal(german.status, 200);
    assert.equal(locationUrl(german), null);
    assert.equal(germanRewrite?.hostname, host);
    assert.equal(germanRewrite?.pathname, `/de/${entry.de}`);

    const english = await proxy(request(host, "/en", { cookie: "NEXT_LOCALE=de" }));
    const englishRewrite = rewriteUrl(english);
    assert.equal(locationUrl(english), null);
    assert.equal(englishRewrite?.hostname, host);
    assert.equal(englishRewrite?.pathname, `/en/${entry.en}`);

    const cookie = await proxy(request(host, "/", { language: "en", cookie: "NEXT_LOCALE=de" }));
    assert.equal(rewriteUrl(cookie)?.pathname, `/de/${entry.de}`);
  }
});

test("niche hosts serve assets, locale roots, and internal links without leaving the host", async () => {
  const asset = await proxy(request("film.abowserphoto.com", "/favicon.ico"));
  assert.equal(rewriteUrl(asset), null);
  assert.equal(locationUrl(asset), null);

  const image = await proxy(request("social.abowserphoto.com", "/og/aaron-bowser-photography-hagen-solingen.jpg"));
  assert.equal(rewriteUrl(image), null);
  assert.equal(locationUrl(image), null);

  const impressum = await proxy(request("immo.abowserphoto.com", "/de/impressum"));
  assert.equal(rewriteUrl(impressum), null);
  assert.equal(locationUrl(impressum), null);
  assert.equal(impressum.headers.get("x-middleware-next"), "1");

  const portfolio = await proxy(
    request("commercial.abowserphoto.com", "/de/commercial-fotografie/portfolio")
  );
  assert.equal(rewriteUrl(portfolio), null);
  assert.equal(locationUrl(portfolio), null);

  const englishPortfolio = await proxy(request("commercial.abowserphoto.com", "/en/commercial/portfolio"));
  assert.equal(rewriteUrl(englishPortfolio), null);

  const barePortfolio = await proxy(
    request("commercial.localhost:3001", "/commercial/portfolio", { language: "en" })
  );
  const portfolioLocation = locationUrl(barePortfolio);
  assert.equal(portfolioLocation?.hostname, "commercial.localhost");
  assert.equal(portfolioLocation?.port, "3001");
  assert.equal(portfolioLocation?.pathname, "/en/commercial/portfolio");

  const foreign = await proxy(request("immo.abowserphoto.com", "/de/hochzeitsfotograf"));
  assert.equal(rewriteUrl(foreign)?.hostname, "immo.abowserphoto.com");
  assert.equal(rewriteUrl(foreign)?.pathname, "/de/immobilienfotografie");
  assert.equal(locationUrl(foreign), null);

  const devLanding = await proxy(request("business.localhost:3001", "/de"));
  assert.equal(rewriteUrl(devLanding)?.hostname, "business.localhost");
  assert.equal(rewriteUrl(devLanding)?.port, "3001");
  assert.equal(rewriteUrl(devLanding)?.pathname, "/de/business-portraits");
});

test("the apex still redirects to www and the main site does not rewrite categories", async () => {
  const apex = await proxy(request("aaronbowser-photography.com", "/de"));
  assert.equal(apex.status, 308);
  const apexLocation = locationUrl(apex);
  assert.equal(apexLocation?.protocol, "https:");
  assert.equal(apexLocation?.hostname, "www.aaronbowser-photography.com");
  assert.equal(apexLocation?.pathname, "/de");

  const home = await proxy(request("www.aaronbowser-photography.com", "/", { language: "de" }));
  assert.equal(home.status, 308);
  assert.equal(locationUrl(home)?.pathname, "/de");
  assert.equal(locationUrl(home)?.hostname, "www.aaronbowser-photography.com");
  assert.equal(rewriteUrl(home), null);
});

test("language switch stays on the niche landing or the current subpage", () => {
  const immo = nicheHostForHostname("immo.abowserphoto.com");
  assert.ok(immo);
  assert.equal(nicheLocaleSwitchPath("/", "de", immo), "/de");
  assert.equal(nicheLocaleSwitchPath("/en", "de", immo), "/de");
  assert.equal(nicheLocaleSwitchPath("/de/immobilienfotografie", "en", immo), "/en");
  assert.equal(nicheLocaleSwitchPath("/de/impressum", "en", immo), "/en/impressum");
  assert.equal(nicheLocaleSwitchPath("/de/hochzeitsfotograf", "en", immo), "/en");
  assert.equal(isNicheOnHostPath("/de/impressum", "real-estate"), true);
  assert.equal(isNicheOnHostPath("/de", "real-estate"), false);

  const commercial = nicheHostForHostname("commercial.abowserphoto.com");
  assert.ok(commercial);
  assert.equal(
    nicheLocaleSwitchPath("/de/commercial-fotografie/portfolio", "en", commercial),
    "/en/commercial/portfolio"
  );
  assert.equal(nicheLocaleSwitchPath("/en/commercial", "de", commercial), "/de");
});

test("niche category canonicals use the short subdomain; www category URLs stay on www", () => {
  for (const entry of CASES) {
    const german = buildCategoryMetadata("de", entry.slug, `${entry.sub}.abowserphoto.com`);
    const english = buildCategoryMetadata("en", entry.slug, `${entry.sub}.aaronbowser-photography.com`);
    assert.equal(german.alternates?.canonical, `https://${entry.sub}.abowserphoto.com/de`);
    assert.equal(english.alternates?.canonical, `https://${entry.sub}.abowserphoto.com/en`);
    const languages = german.alternates?.languages as Record<string, string>;
    assert.equal(languages.en, `https://${entry.sub}.abowserphoto.com/en`);
    assert.equal(languages.de, `https://${entry.sub}.abowserphoto.com/de`);
    assert.equal(languages["x-default"], `https://${entry.sub}.abowserphoto.com/en`);
    assert.equal(german.openGraph?.url, `https://${entry.sub}.abowserphoto.com/de`);
  }

  const www = buildCategoryMetadata("de", "real-estate", "www.aaronbowser-photography.com");
  assert.equal(
    www.alternates?.canonical,
    "https://www.aaronbowser-photography.com/de/immobilienfotografie"
  );
  assert.equal(
    buildCategoryMetadata("en", "food").alternates?.canonical,
    "https://www.aaronbowser-photography.com/en/food"
  );

  const local = buildCategoryMetadata("de", "food", "food.localhost:3001");
  assert.equal(local.alternates?.canonical, "http://food.localhost:3001/de");

  const portfolio = buildSimplePageMetadata(
    "de",
    "commercial-portfolio",
    "commercial.abowserphoto.com"
  );
  assert.equal(
    portfolio.alternates?.canonical,
    "https://commercial.abowserphoto.com/de/commercial-fotografie/portfolio"
  );
  const portfolioLanguages = portfolio.alternates?.languages as Record<string, string>;
  assert.equal(portfolioLanguages.en, "https://commercial.abowserphoto.com/en/commercial/portfolio");

  assert.equal(
    buildSimplePageMetadata("en", "commercial-portfolio", "www.aaronbowser-photography.com").alternates
      ?.canonical,
    "https://www.aaronbowser-photography.com/en/commercial/portfolio"
  );
  assert.equal(
    buildSimplePageMetadata("en", "account", "immo.abowserphoto.com").alternates?.canonical,
    "https://www.aaronbowser-photography.com/en/account"
  );
  assert.equal(
    buildLegalMetadata("de", "impressum").alternates?.canonical,
    "https://www.aaronbowser-photography.com/de/impressum"
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import type { Metadata } from "next";
import { buildCategoryMetadata, buildHomeMetadata, buildSimplePageMetadata } from "./i18n/seo";
import { NICHE_OG_IMAGES, OG_IMAGE_PATH } from "./site";
import { PORTAL_CATEGORY_ORDER, PORTAL_CATEGORY_SUBDOMAIN } from "./subdomains";

function imageOf(metadata: Metadata) {
  const images = metadata.openGraph?.images;
  const image = Array.isArray(images) ? images[0] : images;
  if (!image || typeof image === "string" || image instanceof URL) {
    return { url: image ? String(image) : "", width: undefined, height: undefined, alt: undefined };
  }
  return {
    url: String(image.url),
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

function twitterUrl(metadata: Metadata) {
  const images = metadata.twitter?.images;
  const image = Array.isArray(images) ? images[0] : images;
  if (!image || typeof image === "string" || image instanceof URL) return image ? String(image) : "";
  return String(image.url);
}

test("each niche page shares its own category image, and only real estate uses a property photo", () => {
  const paths = new Set<string>();

  for (const slug of PORTAL_CATEGORY_ORDER) {
    const expected = NICHE_OG_IMAGES[slug];
    assert.equal(paths.has(expected.path), false, expected.path);
    paths.add(expected.path);
    assert.equal(expected.path === OG_IMAGE_PATH, false);

    for (const locale of ["de", "en"] as const) {
      const pages = [
        buildCategoryMetadata(locale, slug, `${PORTAL_CATEGORY_SUBDOMAIN[slug]}.abowserphoto.com`),
        buildCategoryMetadata(locale, slug, "www.aaronbowser-photography.com"),
      ];
      for (const metadata of pages) {
        const image = imageOf(metadata);
        assert.equal(image.url, `https://www.aaronbowser-photography.com${expected.path}`);
        assert.equal(image.width, 1200);
        assert.equal(image.height, 630);
        assert.equal(image.alt, expected.alt[locale]);
        assert.equal(metadata.twitter?.card, "summary_large_image");
        assert.equal(twitterUrl(metadata), image.url);
      }
    }
  }

  assert.equal(NICHE_OG_IMAGES["real-estate"].path, "/og/og-real-estate.jpg");
  for (const slug of PORTAL_CATEGORY_ORDER) {
    if (slug === "real-estate") continue;
    assert.equal(NICHE_OG_IMAGES[slug].path.includes("real-estate"), false);
  }
});

test("commercial portfolio pages use the commercial product image", () => {
  for (const host of ["commercial.abowserphoto.com", "www.aaronbowser-photography.com"]) {
    const metadata = buildSimplePageMetadata("en", "commercial-portfolio", host);
    const image = imageOf(metadata);
    assert.equal(image.url, "https://www.aaronbowser-photography.com/og/og-commercial.jpg");
    assert.equal(image.alt, NICHE_OG_IMAGES.commercial.alt.en);
    assert.equal(image.width, 1200);
    assert.equal(image.height, 630);
    assert.equal(twitterUrl(metadata), image.url);
  }
});

test("the homepage keeps its existing share image", () => {
  const image = imageOf(buildHomeMetadata("de"));
  assert.equal(image.url, OG_IMAGE_PATH);
  assert.equal(image.url.includes("real-estate"), false);
});

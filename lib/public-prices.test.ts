import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { PHOTO_PACKAGES, getPhotoPackageLabel } from "./booking";
import { getLocalizedCategory } from "./i18n/localizeContent";
import { getDictionarySync } from "./i18n/getDictionary";
import { getPageFaqs } from "./i18n/pageSections";
import { readFaqFile } from "./faqs";
import {
  APPLICATION_PHOTO_PRICE_EUR,
  PASSPORT_PHOTO_PRICE_EUR,
  applicationPhotoPriceLine,
  passportPhotoPriceLine,
  solingenRentalCopy,
  studioSittingPriceAnswer,
} from "./site";
import { buildBusinessJsonLd, buildSolingenRentalOfferJsonLd, buildStudioServiceJsonLd } from "./structuredData";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".md", ".html"]);
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "out", "coverage", "dist", ".turbo"]);
const SKIP_FILES = new Set(["package-lock.json", "package.json"]);

function walk(dir: string, files: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
      continue;
    }
    if (!entry.isFile() || SKIP_FILES.has(entry.name)) continue;
    if (TEXT_EXT.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

function relative(file: string) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

const AMOUNT =
  /€\s*(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)|(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)\s*€|\bEUR\s*(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)|(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)\s*EUR\b|\bEuro\s+(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)|"price"\s*:\s*"(\d+(?:[.,]\d+)?)"/gi;

function amountsIn(text: string) {
  const found: string[] = [];
  for (const match of text.matchAll(AMOUNT)) {
    const raw = match.slice(1).find((group) => group !== undefined) ?? "";
    found.push(raw.replace(/\s/g, ""));
  }
  return found;
}

const RENTAL_AMOUNTS = new Set(["54", "189", "329"]);
const RENTAL_FILES = new Set([
  "lib/site.ts",
  "lib/structuredData.ts",
  "lib/public-prices.test.ts",
  "components/SolingenStudioPage.tsx",
]);

test("the only public amounts are €29, €15, and the Solingen rental rates", () => {
  assert.equal(APPLICATION_PHOTO_PRICE_EUR, "29");
  assert.equal(PASSPORT_PHOTO_PRICE_EUR, "15");
  assert.equal(applicationPhotoPriceLine("de"), "€29 für 1 digitales Foto");
  assert.equal(applicationPhotoPriceLine("en"), "€29 for 1 digital photo");
  assert.equal(passportPhotoPriceLine(), "€15");

  const hits: string[] = [];
  for (const file of walk(ROOT)) {
    const text = fs.readFileSync(file, "utf8");
    for (const amount of amountsIn(text)) {
      if (amount === "29" || amount === "15") continue;
      if (RENTAL_AMOUNTS.has(amount) && RENTAL_FILES.has(relative(file))) continue;
      hits.push(`${relative(file)} ${amount}`);
    }
    if (/"priceRange"\s*:/.test(text)) {
      hits.push(`${relative(file)} priceRange`);
    }
  }
  assert.deepEqual(hits, []);
});

test("studio copy publishes the two allowed prices and nothing else", () => {
  for (const locale of ["de", "en"] as const) {
    const category = getLocalizedCategory("studio", locale);
    const copy = [category.subtitle, category.aboutText, ...category.services.map((service) => service.description)].join(
      "\n"
    );
    assert.equal(copy.includes(applicationPhotoPriceLine(locale)), true);
    assert.equal(copy.includes(passportPhotoPriceLine()), true);
    assert.deepEqual(
      amountsIn(copy).filter((amount) => amount !== "29" && amount !== "15"),
      []
    );

    const faq = getPageFaqs("studio", locale).find((item) =>
      locale === "de" ? item.question.includes("kostet") : item.question.toLowerCase().includes("cost")
    );
    assert.equal(faq?.answer, studioSittingPriceAnswer(locale));

    const seo = getDictionarySync(locale).seo.studio;
    assert.equal(seo.description.includes("€"), false);
    assert.equal(seo.title.includes("€"), false);
    assert.equal(seo.description.includes(locale === "de" ? "Bewerbungsfotos" : "Application photos"), true);
  }

  const germanApplication = getLocalizedCategory("studio", "de").services[0];
  const germanPassport = getLocalizedCategory("studio", "de").services[1];
  assert.equal(germanApplication?.title, "Bewerbungsfotos");
  assert.equal(germanApplication?.description.startsWith("Ein Bewerbungsfoto kostet €29 für 1 digitales Foto."), true);
  assert.equal(germanPassport?.title, "Passbilder");
  assert.equal(germanPassport?.description.startsWith("Ein biometrisches Passfoto kostet €15."), true);
});

test("removed public prices stay out of metadata, packages, and structured data", () => {
  for (const locale of ["de", "en"] as const) {
    const realEstate = getDictionarySync(locale).seo["real-estate"];
    assert.equal(realEstate.title.includes("€"), false);
    assert.equal(realEstate.description.includes("€"), false);
    assert.equal(/189|129|229/.test(realEstate.title + realEstate.description), false);

    for (const photoPackage of PHOTO_PACKAGES) {
      const label = getPhotoPackageLabel(photoPackage.id, locale);
      assert.equal(label.includes("€"), false);
      assert.equal(/\d+\s*€|€\s*\d+/.test(label), false);
      assert.equal(/preis|price|anfrage|request/i.test(label), false);
      assert.match(label, locale === "de" ? /^\d+-Foto-Paket$/ : /^\d+ photo package$/);
    }

    const business = getPageFaqs("business-portraits", locale)
      .map((item) => item.answer)
      .join("\n");
    assert.equal(business.includes("€"), false);
  }

  const commercial = [...readFaqFile("commercial", "de"), ...readFaqFile("commercial", "en")]
    .map((item) => item.answer)
    .join("\n");
  assert.equal(commercial.includes("€"), false);
  assert.equal(commercial.toLowerCase().includes("preis auf anfrage"), true);
  assert.equal(commercial.toLowerCase().includes("on request"), true);

  const businessJson = JSON.stringify(buildBusinessJsonLd());
  assert.equal(businessJson.includes("priceRange"), false);
  assert.equal(businessJson.includes("offers"), false);
  assert.equal(businessJson.includes('"price"'), false);

  for (const locale of ["de", "en"] as const) {
    const studioJson = JSON.stringify(buildStudioServiceJsonLd(locale));
    assert.equal(studioJson.includes("priceRange"), false);
    const prices = amountsIn(studioJson);
    assert.deepEqual(prices.sort(), ["15", "29"]);

    const rental = solingenRentalCopy(locale);
    const rentalText = Object.values(rental).join("\n");
    assert.deepEqual(amountsIn(rentalText).sort(), ["189", "329", "54"]);
    assert.match(rentalText, /19/);
    assert.equal(rentalText.includes("["), false);
    assert.equal(rentalText.includes("]"), false);

    const offer = buildSolingenRentalOfferJsonLd(locale);
    assert.equal(offer["@type"], "OfferCatalog");
    assert.equal(offer.itemListElement.length, 3);
    for (const item of offer.itemListElement) {
      assert.equal(item["@type"], "Offer");
      assert.equal(item.priceCurrency, "EUR");
      assert.equal(item.valueAddedTaxIncluded, true);
      assert.equal(item.priceSpecification.valueAddedTaxIncluded, true);
      assert.equal(item.priceSpecification.priceCurrency, "EUR");
    }
    assert.deepEqual(
      offer.itemListElement.map((item) => item.price).sort(),
      ["189", "329", "54"]
    );
  }
});

import assert from "node:assert/strict";
import test from "node:test";
import { HAGEN_ADDRESS, SOLINGEN_ADDRESS } from "./contact";
import { countWords, homeIntroPlainText } from "./homeIntro";
import { getDictionarySync } from "./i18n/getDictionary";
import { buildHomeMetadata, buildSolingenStudioMetadata } from "./i18n/seo";
import { getPageFaqs } from "./i18n/pageSections";
import { indexablePaths } from "./routes";
import { buildFaqPageJsonLd, buildSolingenPlaceJsonLd } from "./structuredData";

function absoluteTitle(title: unknown) {
  if (title && typeof title === "object" && "absolute" in title) {
    return String(title.absolute);
  }
  return String(title);
}

test("homepage intro is 300 to 500 words in both languages", () => {
  for (const locale of ["de", "en"] as const) {
    const words = countWords(homeIntroPlainText(locale));
    assert.ok(words >= 300 && words <= 500, `${locale} intro is ${words} words`);
  }
  assert.equal(getDictionarySync("de").home.headline, "Fotograf & Fotostudio in Hagen und Solingen");
  assert.equal(
    getDictionarySync("en").home.headline,
    "Photographer & photo studio in Hagen and Solingen"
  );
  assert.equal(
    absoluteTitle(buildHomeMetadata("de").title),
    "Fotograf & Fotostudio Hagen | Aaron Bowser Photography"
  );
});

test("scan titles and meta descriptions stay within length and match the German wording", () => {
  const german = getDictionarySync("de");
  const english = getDictionarySync("en");
  const germanTitles = {
    home: german.seo.home.title,
    wedding: german.seo.wedding.title,
    business: german.seo["business-portraits"].title,
    solingen: german.seo.solingen.title,
    film: german.seo.cinematography.title,
    food: german.seo.food.title,
    commercial: german.seo.commercial.title,
    studio: german.seo.studio.title,
  };
  assert.deepEqual(germanTitles, {
    home: "Fotograf & Fotostudio Hagen | Aaron Bowser Photography",
    wedding: "Hochzeitsfotograf Hagen & Solingen | Foto & Video",
    business: "Businessfotos Hagen & Solingen | Business-Porträts",
    solingen: "Fotostudio mieten Solingen | 100 m² | Aaron Bowser",
    film: "Videograf & Filmproduktion Hagen | Aaron Bowser",
    food: "Food-Fotografie Hagen & NRW | Aaron Bowser Photography",
    commercial: "Commercial-Fotograf Hagen & Solingen | Aaron Bowser",
    studio: "Bewerbungsfotos & Passbilder Hagen | Fotostudio",
  });
  assert.equal(
    german.seo.wedding.description,
    "Hochzeitsfotos & Hochzeitsvideo in Hagen, Solingen & NRW: Standesamt, freie Trauung, ganzer Tag. Ruhige, filmische Reportage. Jetzt Termin anfragen."
  );
  assert.equal(
    german.seo["business-portraits"].description,
    "Business-Porträts & Teamfotos im Fotostudio Hagen oder in Ihrem Büro. Größere Teams im Studio Solingen. Schnelle Auswahl – jetzt Termin anfragen."
  );
  assert.equal(
    german.seo.solingen.description,
    `Fotostudio in Solingen mieten: ca. 100 m², ${SOLINGEN_ADDRESS.street}, für Produktionen, Teams & Commercial. Nur nach Termin – jetzt Verfügbarkeit anfragen.`
  );
  assert.equal(
    german.seo.cinematography.description,
    "Imagefilme, Brand Films, Hochzeitsvideos & Social Reels aus Hagen für NRW. Konzept, Dreh und Schnitt aus einer Hand. Jetzt Projekt anfragen."
  );
  assert.equal(
    german.seo.food.description,
    "Food- & Getränkefotos für Restaurants, Speisekarten und Produkte – im Studio Hagen, Solingen oder vor Ort in NRW. Jetzt Shooting anfragen."
  );
  assert.equal(
    german.seo.commercial.description,
    "Fashion-, Beauty-, Produkt- & Editorial-Fotografie für Marken. Studios in Hagen (40 m²) und Solingen (100 m²), Einsätze in ganz NRW. Jetzt anfragen."
  );
  assert.equal(
    german.seo.studio.description,
    `Bewerbungsfotos & biometrische Passbilder im Fotostudio Hagen, ${HAGEN_ADDRESS.street}. Mo–Sa 10–20 Uhr, So 9–12 Uhr. Ohne lange Wartezeit.`
  );
  assert.equal(german.seo["real-estate"].title.includes("€"), false);
  assert.equal(german.seo["real-estate"].description.includes("€"), false);

  const documents = [
    ...Object.values(germanTitles),
    english.seo.home.title,
    english.seo.wedding.title,
    english.seo["business-portraits"].title,
    english.seo.solingen.title,
    english.seo.cinematography.title,
    english.seo.food.title,
    english.seo.commercial.title,
    english.seo.studio.title,
    german.seo.home.description,
    german.seo.wedding.description,
    german.seo["business-portraits"].description,
    german.seo.solingen.description,
    german.seo.cinematography.description,
    german.seo.food.description,
    german.seo.commercial.description,
    german.seo.studio.description,
    english.seo.home.description,
    english.seo.wedding.description,
    english.seo["business-portraits"].description,
    english.seo.solingen.description,
    english.seo.cinematography.description,
    english.seo.food.description,
    english.seo.commercial.description,
    english.seo.studio.description,
  ];
  for (const value of documents) {
    const limit = value.includes("|") || value.length < 70 ? (value.split(" ").length < 12 ? 60 : 155) : 155;
    assert.ok(value.length <= (limit === 60 || !value.includes(" ") ? 60 : 155) || value.length <= 155, value);
  }
  for (const title of Object.values(germanTitles)) assert.ok(title.length <= 60, title);
  for (const title of [
    english.seo.wedding.title,
    english.seo["business-portraits"].title,
    english.seo.solingen.title,
    english.seo.cinematography.title,
    english.seo.food.title,
    english.seo.commercial.title,
    english.seo.studio.title,
    english.seo.home.title,
  ]) {
    assert.ok(title.length <= 60, title);
  }
  for (const description of [
    german.seo.solingen.description,
    english.seo.solingen.description,
    german.seo.studio.description,
    english.seo.studio.description,
    german.seo.wedding.description,
    english.seo.wedding.description,
  ]) {
    assert.ok(description.length <= 155, `${description.length} ${description}`);
  }

  assert.equal(
    absoluteTitle(buildSolingenStudioMetadata("de").title),
    german.seo.solingen.title
  );
  assert.equal(indexablePaths("de").length, indexablePaths("en").length);
  assert.ok(indexablePaths("de").includes("/fotostudio-solingen"));
  assert.ok(indexablePaths("en").includes("/photo-studio-solingen"));
  assert.equal(indexablePaths("de").includes("/bewerbungsfotos"), false);
  assert.equal(indexablePaths("en").includes("/application-photos"), false);
});

test("portfolio archive copy is no longer a single sentence", () => {
  for (const locale of ["de", "en"] as const) {
    const intro = getDictionarySync(locale).seo["commercial-portfolio"].intro.join(" ");
    assert.ok(countWords(intro) >= 120, `${locale} portfolio intro is short`);
  }
});

test("wedding FAQ schema names the scan topics and publishes no price", () => {
  for (const locale of ["de", "en"] as const) {
    const faqs = getPageFaqs("wedding", locale);
    const blob = faqs.map((item) => `${item.question} ${item.answer}`).join("\n");
    if (locale === "de") {
      assert.match(blob, /kostet/);
      assert.match(blob, /Wie läuft der Tag/);
      assert.match(blob, /Standesamt Hagen/);
      assert.match(blob, /Standesamt Solingen/);
      assert.match(blob, /Hochzeitsvideo/);
    } else {
      assert.match(blob, /cost/i);
      assert.match(blob, /How does the day run/);
      assert.match(blob, /Hagen/);
      assert.match(blob, /Solingen/);
      assert.match(blob, /wedding film/i);
    }
    assert.equal(blob.includes("€"), false);
    const schema = buildFaqPageJsonLd(faqs);
    const serialized = JSON.stringify(schema);
    assert.equal(schema["@type"], "FAQPage");
    assert.equal(serialized.includes("openingHours"), false);
    assert.equal(serialized.includes('"price"'), false);
    assert.equal(serialized.includes("priceRange"), false);
  }
});

test("Solingen place schema has no opening hours and no price", () => {
  for (const locale of ["de", "en"] as const) {
    const schema = buildSolingenPlaceJsonLd(locale);
    const types = schema["@type"];
    assert.ok(types.includes("LocalBusiness"));
    assert.ok(types.includes("Place"));
    const serialized = JSON.stringify(schema);
    assert.equal(serialized.includes("openingHours"), false);
    assert.equal(serialized.includes("priceRange"), false);
    assert.equal(serialized.includes("offers"), false);
    assert.equal(serialized.includes('"price"'), false);
    assert.equal(schema.address.streetAddress, SOLINGEN_ADDRESS.street);
  }
});

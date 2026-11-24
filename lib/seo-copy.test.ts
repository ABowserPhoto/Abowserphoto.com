import assert from "node:assert/strict";
import test from "node:test";
import { HAGEN_ADDRESS, SOLINGEN_ADDRESS } from "./contact";
import { countWords, homeIntroPlainText } from "./homeIntro";
import { AWARD_LOGOS } from "./awards";
import { MARKETING_VIDEO } from "./marketingVideo";
import { homeHubGroups } from "./homeHub";
import { serviceIntroBeats } from "./serviceIntro";
import { categoryContentMap, type CategorySlug } from "./content";
import { getDictionarySync } from "./i18n/getDictionary";
import { buildHomeMetadata, buildSolingenStudioMetadata } from "./i18n/seo";
import { getPageFaqs } from "./i18n/pageSections";
import { categoryPath, indexablePaths } from "./routes";
import { buildFaqPageJsonLd, buildSolingenPlaceJsonLd } from "./structuredData";

function absoluteTitle(title: unknown) {
  if (title && typeof title === "object" && "absolute" in title) {
    return String(title.absolute);
  }
  return String(title);
}

test("homepage intro leads with the studios and a quote, without internal notes", () => {
  for (const locale of ["de", "en"] as const) {
    const text = homeIntroPlainText(locale);
    assert.equal(/second studio|zweite Studio|every day|täglich|Paketpreise|package prices|not part of the offer|nicht zum Angebot|separate address|eigene Adresse/i.test(text), false);
    if (locale === "de") {
      assert.match(text, /100 m²/);
      assert.match(text, /Bewerbungsfotos und Passbilder/);
      assert.match(text, /Kontaktformular/);
    } else {
      assert.match(text, /about 100 m²/);
      assert.match(text, /application and passport photos/);
      assert.match(text, /contact form/);
      assert.match(text, /WhatsApp/);
    }
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
  const tiles = homeHubGroups("de");
  assert.equal(tiles.featured[0]?.slug, "wedding");
  assert.equal(tiles.featured[1]?.slug, "real-estate");
  assert.equal(tiles.text[0]?.slug, "business-portraits");
  assert.equal(tiles.text[1]?.slug, "food");
  assert.equal(AWARD_LOGOS.length, 0);
  assert.equal(MARKETING_VIDEO.src, "");
  assert.ok(MARKETING_VIDEO.poster.startsWith("/"));
  for (const slug of Object.keys(categoryContentMap) as CategorySlug[]) {
    for (const locale of ["de", "en"] as const) {
      assert.equal(serviceIntroBeats(slug, locale).length, 2);
    }
  }
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
    wedding: "Hochzeitsfotograf NRW | Düsseldorf, Köln & Ruhrgebiet",
    business: "Business-Fotograf NRW | Executive- & Corporate-Porträts",
    solingen: "Fotostudio mieten Solingen | 100 m² ab 54 €/Std.",
    film: "Imagefilm-Produktion NRW | Aaron Bowser Photography",
    food: "Food-Fotografie NRW | Kampagne, Verpackung & Getränke",
    commercial: "Commercial-Fotograf NRW | Fashion, Beauty & Editorial",
    studio: "Bewerbungsfotos & Passbilder Hagen | Fotostudio",
  });
  assert.match(german.seo.wedding.description, /Düsseldorf, Köln, Wuppertal/);
  assert.match(german.seo["business-portraits"].description, /Executive/);
  assert.match(german.seo.solingen.description, /54 €/);
  assert.match(german.seo.cinematography.description, /Imagefilme/);
  assert.match(german.seo.food.description, /Verpackung/);
  assert.match(german.seo.commercial.description, /Editorial/);
  assert.match(german.seo.studio.description, /29 €/);
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
  for (const slug of Object.keys(categoryContentMap) as CategorySlug[]) {
    if (slug === "studio") continue;
    assert.ok(indexablePaths("de").includes(categoryPath(slug, "de")), slug);
    assert.ok(indexablePaths("en").includes(categoryPath(slug, "en")), slug);
  }
  const social = getDictionarySync("de").seo["social-media-management"];
  assert.ok(social.title.length <= 60, social.title);
  assert.ok(social.description.length <= 155, social.description);
  assert.ok(getDictionarySync("en").seo["social-media-management"].description.length <= 155);
});

test("portfolio archive copy is no longer a single sentence", () => {
  for (const locale of ["de", "en"] as const) {
    const intro = getDictionarySync(locale).seo["commercial-portfolio"].intro.join(" ");
    assert.ok(countWords(intro) >= 120, `${locale} portfolio intro is short`);
  }
});

test("wedding FAQ schema names the scan topics and publishes no price", () => {
  for (const locale of ["de", "en"] as const) {
    const faqs = getPageFaqs("wedding", locale, locale === "de" ? "wedding.abowserphoto.com" : "wedding.abowserphoto.com");
    const blob = faqs.map((item) => `${item.question} ${item.answer}`).join("\n");
    if (locale === "de") {
      assert.match(blob, /kostet/);
      assert.match(blob, /Standesamt/);
      assert.match(blob, /Hochzeitsvideo|Hochzeitsfilm/);
    } else {
      assert.match(blob, /cost/i);
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

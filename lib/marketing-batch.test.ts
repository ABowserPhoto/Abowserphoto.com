import assert from "node:assert/strict";
import test from "node:test";
import { explicitImageAlt } from "./homeImageAlts";
import { getLegalDocument } from "./legalContent";
import { homeHeroCopy } from "./homeHero";
import { NICHE_LANDING_COPY } from "./niche-landing";
import { getDictionarySync } from "./i18n/getDictionary";
import { getLocalizedCategory } from "./i18n/localizeContent";
import { getPageFaqs, getPageSections } from "./i18n/pageSections";
import { offerPageCopy } from "./offerPages";
import { buildFaqPageJsonLd } from "./structuredData";

test("the German homepage uses Buscando's alts and the logo alt is already the brand name", () => {
  const expected = {
    "/home/images/julia_00220 3.jpg":
      "Modeporträt einer Frau im Profil mit großen Goldringen und Armreifen, im Studio unter türkisem Licht",
    "/home/images/Marsela_16_04_2024_5 2.jpg":
      "Editoriales Studiofoto einer Frau im schwarzen Latexanzug und einer Ledermaske, seitlich vor dunklem Hintergrund",
    "/home/images/Naya_29_01_202206722 1.jpg":
      "Beauty- und Modeporträt einer Frau mit goldenem Schlangenohrring und transparenten Handschuhen",
    "/home/light-theme/01-monja.jpg":
      "Schwarz-weißes Business-Porträt einer Frau mit lockigem Haar, großer Brille und Blazer, sitzend im Fotostudio",
    "/home/light-theme/02-nadine.jpg":
      "Business-Porträt einer lächelnden Frau im rosa Hosenanzug und mit Brille, sitzend auf einem Bürostuhl im Fotostudio",
    "/home/light-theme/03-olga.jpg":
      "Schwarz-weißes Porträt einer Frau mit blonden Haaren, weißer Bluse und großen Creolen",
  };
  for (const [src, alt] of Object.entries(expected)) {
    assert.equal(explicitImageAlt(src, "de"), alt);
    assert.equal(explicitImageAlt(src, "en"), "");
  }
  assert.equal(getDictionarySync("de").home.logoLabel, "Aaron Bowser Photography");
});

test("the homepage keeps its title and H1 and adds the claim without an award strip", () => {
  const german = getDictionarySync("de");
  const hero = homeHeroCopy("de");
  assert.equal(german.seo.home.title, "Fotograf & Fotostudio Hagen | Aaron Bowser Photography");
  assert.equal(german.home.headline, "Fotograf & Fotostudio in Hagen und Solingen");
  assert.equal(hero.claim, "It's not just a photo, it's A. Bowser Photo.");
  assert.match(hero.line, /Fotografie, Film und KI-Bildwelten/);
  assert.equal(hero.book, "Shooting buchen");
  assert.match(hero.note, /Preise & Buchung im Kundenkonto/);
  assert.equal(german.home.logoLabel, "Aaron Bowser Photography");
  assert.equal(getDictionarySync("en").nav.inquire, "Book a shoot");
  assert.equal(german.nav.consult, "Beratung anfragen");
});

test("immo keeps its title and H1, and www real-estate copy stays on its own heading", () => {
  const immo = NICHE_LANDING_COPY["real-estate"].de;
  assert.equal(immo.title, "Immobilienfotograf Hagen | Exposé-Fotos NRW");
  assert.equal(immo.h1, "Immobilienfotograf für Makler in NRW");
  assert.equal(immo.lead, "Immobilienfotos, die Besichtigungen bringen");
  assert.match(immo.description, /Drohne/);
  assert.equal(immo.description.includes("auf Anfrage"), false);
  assert.ok(immo.description.length <= 155, immo.description);
  assert.ok(NICHE_LANDING_COPY["real-estate"].en.description.length <= 155);

  const www = getLocalizedCategory("real-estate", "de");
  assert.equal(www.title, "Immobilienfotografie NRW");
  assert.equal(getDictionarySync("de").seo["real-estate"].title, "Immobilienfotografie Hagen & NRW | Aaron Bowser");
  assert.match(www.aboutText, /Fotos innerhalb von 24 Stunden/);
});

test("German offer FAQs are in German and can be marked up where they are visible", () => {
  const realEstate = getPageFaqs("real-estate", "de");
  assert.match(realEstate[0]?.question ?? "", /Wie schnell/);
  assert.match(realEstate[1]?.answer ?? "", /ImmoScout24/);
  assert.equal(realEstate.map((item) => item.answer).join(" ").includes("MLS"), false);
  const schema = buildFaqPageJsonLd(realEstate);
  assert.equal(schema["@type"], "FAQPage");
  assert.equal(schema.mainEntity.length, 2);

  for (const slug of ["food", "cinematography", "social-media-management"] as const) {
    const faqs = getPageFaqs(slug, "de");
    assert.ok(faqs.length > 0);
    assert.equal(/[A-Za-z]{3}/.test(faqs[0]?.question ?? ""), true);
    assert.equal(faqs[0]?.question.includes("?"), true);
    assert.equal(/\b(What|Can|Do|Which|Is)\b/.test(faqs.map((item) => item.question).join(" ")), false);
  }
});

test("new offer pages publish no prices, and commercial labels AI image worlds", () => {
  for (const locale of ["de", "en"] as const) {
    for (const kind of ["prints", "events"] as const) {
      const copy = offerPageCopy(kind, locale);
      const blob = JSON.stringify(copy);
      assert.equal(blob.includes("€"), false);
      assert.equal(/Standard|Legacy|Corporate/.test(blob), false);
    }
  }
  const prints = offerPageCopy("prints", "de");
  assert.equal(prints.h1, "Wandbilder & Metalldrucke");
  assert.equal(prints.claim, "Wandbilder, die bleiben.");
  assert.match(prints.paragraphs.join(" "), /KI-Bildwelten/);
  const events = offerPageCopy("events", "de");
  assert.match(events.datesPlaceholder ?? "", /noch nicht fest/);
  const commercial = getPageSections("commercial", "de");
  assert.match(commercial[0]?.title ?? "", /KI-Bildwelten/);
  assert.match(commercial.map((section) => section.paragraphs.join(" ")).join(" "), /Platzhalter/);
});

test("legal pages no longer carry a public draft note", () => {
  for (const path of ["/impressum", "/datenschutz", "/cookie-richtlinie"] as const) {
    for (const locale of ["de", "en"] as const) {
      const document = getLegalDocument(path, locale);
      const blob = JSON.stringify(document);
      assert.equal(blob.includes("Entwurf"), false);
      assert.equal(blob.includes("Draft"), false);
      assert.equal(blob.includes("Angabe fehlt"), false);
    }
  }
  const notice = getLegalDocument("/impressum", "de");
  const noticeText = notice.blocks.map((block) => block.paragraphs.join(" ")).join("\n");
  assert.match(noticeText, /Aaron Bowser/);
  assert.equal(
    noticeText.includes(
      "Die Aaron Bowser Photography UG (haftungsbeschränkt) ist nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
    ),
    true
  );
  const privacy = getLegalDocument("/datenschutz", "de");
  const privacyText = privacy.blocks.map((block) => block.paragraphs.join(" ")).join("\n");
  assert.equal(privacyText.includes("nicht hinterlegt"), false);
  assert.equal(privacyText.includes("nicht festgelegt"), false);
  assert.match(privacyText, /e-passtransfer GmbH/);
  assert.match(privacyText, /eu-west-1/);
  assert.match(privacyText, /Virtuell eingerichtet|Cloudflare/);
  assert.equal(offerPageCopy("prints", "de").footnote, null);
  assert.equal(JSON.stringify(offerPageCopy("prints", "de")).includes("312g"), false);
});

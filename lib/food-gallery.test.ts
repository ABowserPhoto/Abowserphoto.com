import assert from "node:assert/strict";
import test from "node:test";
import { categoryContentMap } from "./content";
import { readHeroMedia, readPortfolio, readPortalHeroSets } from "./gallery";
import { themeConfig } from "./themeConfig";

const FOOD_PORTFOLIO = [
  "/food/portfolio/food-asian-spread-1.jpg",
  "/food/portfolio/food-asian-spread-2.jpg",
  "/food/portfolio/food-bowl-falafel.jpg",
  "/food/portfolio/food-bowl-kofta-feta.jpg",
  "/food/portfolio/food-bowls-burger-spread.jpg",
  "/food/portfolio/food-bowls-overhead.jpg",
  "/food/portfolio/food-chicken-fried-closeup.jpg",
  "/food/portfolio/food-chicken-fried-salt.jpg",
  "/food/portfolio/food-pizza-closeup.jpg",
  "/food/portfolio/food-pizza-spread.jpg",
  "/food/portfolio/food-platter-falafel.jpg",
  "/food/portfolio/food-platter-spread.jpg",
  "/food/portfolio/food-salad-pasta-table.jpg",
  "/food/portfolio/food-spaghetti-pomodoro.jpg",
  "/food/portfolio/food-tempura-curry.jpg",
  "/food/portfolio/food-tempura-shrimp.jpg",
];

const GERMAN_ALTS: Record<string, string> = {
  "/food/hero/food-hero-1-desktop.jpg":
    "Überbackene Gemüsepizza auf weißem Teller oben rechts auf einer dunklen Schieferplatte",
  "/food/hero/food-hero-1-mobile.jpg":
    "Überbackene Gemüsepizza auf weißem Teller unten links auf dunkler Schieferfläche",
  "/food/hero/food-hero-2-desktop.jpg":
    "Zwei Pizzen auf weißen Tellern rechts auf dunklem Schiefer mit viel freier Fläche",
  "/food/hero/food-hero-2-mobile.jpg":
    "Pizzen auf weißen Tellern am unteren Bildrand einer dunklen Schieferplatte",
  "/food/hero/food-hero-3-desktop.jpg":
    "Gemüsepizza auf weißem Teller unten rechts auf dunkler Schieferplatte",
  "/food/hero/food-hero-3-mobile.jpg":
    "Pizza auf weißem Teller im unteren Bereich einer dunklen Schieferfläche",
  "/food/portfolio/food-platter-falafel.jpg":
    "Falafel mit Joghurtdip, Granatapfelkernen, Salat und Zitrone auf Holzplatte",
  "/food/portfolio/food-chicken-fried-salt.jpg":
    "Hand streut Salz über knuspriges Brathähnchen mit Gemüse vor schwarzem Hintergrund",
  "/food/portfolio/food-bowl-falafel.jpg":
    "Holzschale mit Falafel, Hummus, Kichererbsen, Gurke, Karotten und Granatapfel vor dunklem Hintergrund",
  "/food/portfolio/food-bowl-kofta-feta.jpg":
    "Holzschale mit Köfte, Feta, Karotten und Nüssen auf grauem Steintisch",
  "/food/portfolio/food-bowls-overhead.jpg": "Fünf bunte Bowls in Holzschalen von oben fotografiert",
  "/food/portfolio/food-pizza-spread.jpg": "Pizzen, Salat und Pasta von oben auf einem gedeckten Tisch",
  "/food/portfolio/food-bowls-burger-spread.jpg": "Bowls, Burger und Beilagen auf dunklem Tisch von oben",
  "/food/portfolio/food-pizza-closeup.jpg": "Nahaufnahme einer goldbraun gebackenen Pizza mit Käse",
  "/food/portfolio/food-salad-pasta-table.jpg":
    "Salat mit Rindfleisch und Parmesan, Pasta und Pizza auf Holztisch",
  "/food/portfolio/food-spaghetti-pomodoro.jpg":
    "Spaghetti Pomodoro mit Basilikum, daneben Brot und überbackene Pasta",
  "/food/portfolio/food-asian-spread-1.jpg":
    "Asiatische Gerichte in dunklen Schalen auf rustikalem Holztisch von oben",
  "/food/portfolio/food-tempura-shrimp.jpg": "Tempura-Garnelen mit Chilisauce auf dunkler Schale",
  "/food/portfolio/food-tempura-curry.jpg": "Tempura und rotes Curry mit Reis in dunkler Schale",
  "/food/portfolio/food-asian-spread-2.jpg":
    "Gedeckter Tisch mit asiatischen Gerichten, Limetten und Saucen von oben",
  "/food/portfolio/food-platter-spread.jpg": "Pizza, Falafel, Salate und Sushi auf Holzbrettern von oben",
  "/food/portfolio/food-chicken-fried-closeup.jpg":
    "Nahaufnahme von knusprigem Brathähnchen, dahinter Taboulé-Salat",
};

test("food portfolio is Aaron's sixteen photographs at their own size", () => {
  const german = readPortfolio("food", "de");
  const english = readPortfolio("food", "en");

  assert.deepEqual(
    german.map((image) => image.src),
    FOOD_PORTFOLIO
  );
  assert.deepEqual(
    english.map((image) => image.src),
    FOOD_PORTFOLIO
  );

  for (const image of german) {
    assert.equal(image.alt, GERMAN_ALTS[image.src]);
    assert.equal(typeof image.width, "number");
    assert.equal(typeof image.height, "number");
    assert.notEqual(image.width, image.height);
  }

  for (let index = 0; index < english.length; index += 1) {
    const image = english[index];
    assert.notEqual(image?.alt, german[index]?.alt);
    assert.equal(image?.alt.includes("unsplash"), false);
    assert.ok((image?.alt.length ?? 0) > 20);
  }
});

test("food hero rotates three art-directed frames", () => {
  const german = readHeroMedia("food", "de");
  const english = readHeroMedia("food", "en");

  assert.deepEqual(
    german.map((item) => item.url),
    [
      "/food/hero/food-hero-1-desktop.jpg",
      "/food/hero/food-hero-2-desktop.jpg",
      "/food/hero/food-hero-3-desktop.jpg",
    ]
  );
  assert.deepEqual(
    german.map((item) => item.mobileUrl),
    [
      "/food/hero/food-hero-1-mobile.jpg",
      "/food/hero/food-hero-2-mobile.jpg",
      "/food/hero/food-hero-3-mobile.jpg",
    ]
  );

  for (const item of german) {
    assert.equal(item.type, "image");
    assert.equal(item.alt, GERMAN_ALTS[item.url]);
    assert.equal(item.mobileAlt, GERMAN_ALTS[item.mobileUrl ?? ""]);
  }

  assert.notEqual(english[1]?.alt, german[1]?.alt);
  assert.notEqual(english[1]?.mobileAlt, german[1]?.mobileAlt);

  const portal = readPortalHeroSets("de").food;
  assert.deepEqual(portal.images, german.map((item) => item.url));
  assert.equal(portal.videoUrl, null);
});

test("food category content no longer points at stock photography", () => {
  const food = categoryContentMap.food;
  const urls = [food.heroImage, food.aboutImage, ...food.portfolioImages, themeConfig.food.heroImage];
  for (const url of urls) {
    assert.equal(url.startsWith("/food/"), true, url);
  }
  assert.deepEqual(food.portfolioImages, FOOD_PORTFOLIO);
});

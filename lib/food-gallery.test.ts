import assert from "node:assert/strict";
import test from "node:test";
import { categoryContentMap } from "./content";
import { readHeroMedia, readPortfolio, readPortalHeroSets } from "./gallery";
import { themeConfig } from "./themeConfig";

const FOOD_PORTFOLIO = [
  "/food/portfolio/food-asian-salad.jpg",
  "/food/portfolio/food-asian-spread-1.jpg",
  "/food/portfolio/food-asian-spread-2.jpg",
  "/food/portfolio/food-bowl-falafel.jpg",
  "/food/portfolio/food-bowl-kofta-feta.jpg",
  "/food/portfolio/food-bowls-burger-spread.jpg",
  "/food/portfolio/food-bowls-overhead.jpg",
  "/food/portfolio/food-breakfast-spread.jpg",
  "/food/portfolio/food-chicken-fried-closeup.jpg",
  "/food/portfolio/food-chicken-fried-salt.jpg",
  "/food/portfolio/food-dessert-waffle-donuts.jpg",
  "/food/portfolio/food-dim-sum-steamers.jpg",
  "/food/portfolio/food-donut-plate.jpg",
  "/food/portfolio/food-fries-four-trays.jpg",
  "/food/portfolio/food-fries-loaded.jpg",
  "/food/portfolio/food-fries-three-trays.jpg",
  "/food/portfolio/food-noodle-salad-bowl.jpg",
  "/food/portfolio/food-platter-falafel.jpg",
  "/food/portfolio/food-salad-pasta-table.jpg",
  "/food/portfolio/food-shrimp-salad-bowl.jpg",
  "/food/portfolio/food-spaghetti-pomodoro.jpg",
  "/food/portfolio/food-spicy-noodle-soup.jpg",
  "/food/portfolio/food-sushi-boat.jpg",
  "/food/portfolio/food-sushi-roll-torch.jpg",
  "/food/portfolio/food-tempura-curry.jpg",
  "/food/portfolio/food-tempura-shrimp.jpg",
  "/food/portfolio/food-veggie-momo.jpg",
  "/food/portfolio/food-waffle-candy.jpg",
];

const GERMAN_ALTS: Record<string, string> = {
  "/food/hero/food-hero-1-desktop.jpg":
    "Sushirolle mit Lachs und scharfer Sauce auf schwarzem Schiefer, darüber die Flamme eines Brenners, mit Ingwer und Wasabi",
  "/food/hero/food-hero-1-mobile.jpg":
    "Nahaufnahme einer flambierten Sushirolle mit scharfer Sauce auf Schiefer, Wasabi im Vordergrund und die Flamme darüber",
  "/food/portfolio/food-platter-falafel.jpg":
    "Falafel mit Joghurtdip, Granatapfelkernen, Salat und Zitrone auf Holzplatte",
  "/food/portfolio/food-chicken-fried-salt.jpg":
    "Hand streut Salz über knuspriges Brathähnchen mit Gemüse vor schwarzem Hintergrund",
  "/food/portfolio/food-bowl-falafel.jpg":
    "Holzschale mit Falafel, Hummus, Kichererbsen, Gurke, Karotten und Granatapfel vor dunklem Hintergrund",
  "/food/portfolio/food-bowl-kofta-feta.jpg":
    "Holzschale mit Köfte, Feta, Karotten und Nüssen auf grauem Steintisch",
  "/food/portfolio/food-bowls-overhead.jpg": "Fünf bunte Bowls in Holzschalen von oben fotografiert",
  "/food/portfolio/food-breakfast-spread.jpg":
    "Frühstückstisch von oben mit Croissant, Brot, Brezel, Pfannkuchen mit Obst, Orangensaft, Apfelcrumble, Salat und einem roten Gericht auf weißem Holz",
  "/food/portfolio/food-bowls-burger-spread.jpg": "Bowls, Burger und Beilagen auf dunklem Tisch von oben",
  "/food/portfolio/food-dessert-waffle-donuts.jpg":
    "Waffel mit Marshmallows und Schokolade, Donuts, Cheesecake und Milchshake auf hellblauem Tisch, dazwischen Beeren",
  "/food/portfolio/food-dim-sum-steamers.jpg":
    "Bunte Teigtaschen in Bambusdämpfern auf rotem Holztisch, von oben",
  "/food/portfolio/food-donut-plate.jpg":
    "Donuts auf einem türkisen Teller am linken Bildrand, der Rest eine hellblaue Tischfläche",
  "/food/portfolio/food-fries-four-trays.jpg":
    "Vier Frittenschalen von oben auf grauem Stein: Fleisch mit Gurke und Feta, Guacamole mit Tomate, braune Sauce mit Sahne und Nüssen, und Süßkartoffelpommes",
  "/food/portfolio/food-fries-loaded.jpg":
    "Nahaufnahme von Fritten mit Käsesauce, Jalapeños und Röstzwiebeln in einer Frittenküche-Schale, darum weitere belegte Fritten",
  "/food/portfolio/food-fries-three-trays.jpg":
    "Drei Frittenschalen von oben auf grauem Stein: Fleisch mit Gurke, Feta und Sauce, Süßkartoffelpommes, und braune Sauce mit Sahne und Nüssen",
  "/food/portfolio/food-noodle-salad-bowl.jpg":
    "Vietnamesische Nudelsalat-Schale mit Reisnudeln, Gurke, Karotten, Sprossen, Kräutern und Seetang auf grauem Stein",
  "/food/portfolio/food-salad-pasta-table.jpg":
    "Salat mit Rindfleisch und Parmesan, Pasta und überbackene Nudeln auf Holztisch",
  "/food/portfolio/food-shrimp-salad-bowl.jpg":
    "Garnelensalat mit Gurke, Erdnüssen, knusprigen Crackern und roten Chilifäden in dunkler Schale auf grauem Stein",
  "/food/portfolio/food-spaghetti-pomodoro.jpg":
    "Spaghetti Pomodoro mit Basilikum, daneben Brot und überbackene Pasta",
  "/food/portfolio/food-spicy-noodle-soup.jpg":
    "Scharfe Nudelsuppe mit Fleischbällchen, Rind und hellen Wurstscheiben in schwarzer Schale, daneben Kräuter, Limette und Sprossen auf grauem Stein",
  "/food/portfolio/food-sushi-boat.jpg":
    "Sushi und Lachs auf einem Holzboot, umgeben von blauen Tellern mit Nigiri und Maki auf einem Holztisch",
  "/food/portfolio/food-sushi-roll-torch.jpg":
    "Sushirolle mit Lachs und scharfer Sauce auf schwarzem Schiefer, darüber die Flamme eines Brenners, mit Ingwer und Wasabi",
  "/food/portfolio/food-asian-salad.jpg":
    "Asiatischer Kohl-Karotten-Salat mit Frühlingszwiebeln in roter Schale auf Schiefer, im Hintergrund Edamame und Getränke",
  "/food/portfolio/food-asian-spread-1.jpg":
    "Asiatische Gerichte in dunklen Schalen auf rustikalem Holztisch von oben",
  "/food/portfolio/food-tempura-shrimp.jpg": "Tempura-Garnelen mit Chilisauce auf dunkler Schale",
  "/food/portfolio/food-tempura-curry.jpg": "Tempura und rotes Curry mit Reis in dunkler Schale",
  "/food/portfolio/food-asian-spread-2.jpg":
    "Gedeckter Tisch mit asiatischen Gerichten, Limetten und Saucen von oben",
  "/food/portfolio/food-veggie-momo.jpg":
    "Gemüse-Momo im Kreis um eine Schale mit oranger Sauce, daneben Gewürze, Chutneys und ein Mango-Lassi auf dunklem Holz",
  "/food/portfolio/food-waffle-candy.jpg":
    "Schokoladenwaffel mit Marshmallows und bunten Streuseln auf rosa Teller, daneben Donuts, Beeren und ein Zuckerstreuer auf hellblauem Tisch",
  "/food/portfolio/food-chicken-fried-closeup.jpg":
    "Nahaufnahme von knusprigem Brathähnchen, dahinter Taboulé-Salat",
};

test("food portfolio is Aaron's photographs at their own size", () => {
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
    // The momo plate was delivered as a square. Every other frame keeps its own ratio.
    if (image.src === "/food/portfolio/food-veggie-momo.jpg") {
      assert.equal(image.width, image.height);
    } else {
      assert.notEqual(image.width, image.height);
    }
  }

  for (let index = 0; index < english.length; index += 1) {
    const image = english[index];
    assert.notEqual(image?.alt, german[index]?.alt);
    assert.equal(image?.alt.includes("unsplash"), false);
    assert.ok((image?.alt.length ?? 0) > 20);
  }
});

test("food hero is one art-directed frame of the torched sushi roll", () => {
  const german = readHeroMedia("food", "de");
  const english = readHeroMedia("food", "en");

  assert.deepEqual(
    german.map((item) => item.url),
    ["/food/hero/food-hero-1-desktop.jpg"]
  );
  assert.deepEqual(
    german.map((item) => item.mobileUrl),
    ["/food/hero/food-hero-1-mobile.jpg"]
  );

  for (const item of german) {
    assert.equal(item.type, "image");
    assert.equal(item.alt, GERMAN_ALTS[item.url]);
    assert.equal(item.mobileAlt, GERMAN_ALTS[item.mobileUrl ?? ""]);
  }

  assert.notEqual(english[0]?.alt, german[0]?.alt);
  assert.notEqual(english[0]?.mobileAlt, german[0]?.mobileAlt);

  const portal = readPortalHeroSets("de").food;
  assert.deepEqual(portal.images, german.map((item) => item.url));
  assert.equal(portal.videoUrl, null);
});

test("food photography does not show a pizza", () => {
  const texts = [
    ...readPortfolio("food", "de").flatMap((image) => [image.src, image.alt]),
    ...readPortfolio("food", "en").map((image) => image.alt),
    ...readHeroMedia("food", "de").flatMap((item) => [item.url, item.mobileUrl ?? "", item.alt, item.mobileAlt ?? ""]),
    ...readHeroMedia("food", "en").flatMap((item) => [item.alt, item.mobileAlt ?? ""]),
    ...categoryContentMap.food.services.flatMap((service) => [service.title, service.image ?? ""]),
  ];

  for (const text of texts) {
    assert.equal(/pizza/i.test(text), false, text);
  }
});

test("food category content no longer points at stock photography", () => {
  const food = categoryContentMap.food;
  const urls = [food.heroImage, food.aboutImage, ...food.portfolioImages, themeConfig.food.heroImage];
  for (const url of urls) {
    assert.equal(url.startsWith("/food/"), true, url);
  }
  assert.deepEqual(food.portfolioImages, FOOD_PORTFOLIO);
});

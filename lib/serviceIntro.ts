import type { CategorySlug } from "./content";
import type { Locale } from "./i18n/config";
import { applicationPhotoPriceLine, passportPhotoPriceLine } from "./site";
import { pricingLead } from "./pricingLead";

export type IntroBeat = {
  title: string;
  description: string;
};

const quote = pricingLead;

/**
 * Two marketing beats for the pinned stage under each service hero.
 * Wording stays off the niche-host titles and H1s so those hosts keep
 * their own document copy.
 */
const BEATS: Record<CategorySlug, Record<Locale, IntroBeat[]>> = {
  wedding: {
    de: [
      {
        title: "Eine ruhige Reportage",
        description:
          "Standesamt, freie Trauung oder der ganze Tag in Hagen, Solingen und NRW. Die Bilder folgen Ihrem Ablauf, ohne dass etwas für die Kamera nachgestellt wird.",
      },
      {
        title: "Foto und Film am selben Tag",
        description: `Wenn Sie beides möchten, entsteht das Hochzeitsvideo mit der Reportage. Konzept, Dreh und Schnitt liegen bei der Filmproduktion. ${quote("de")}`,
      },
    ],
    en: [
      {
        title: "A calm reportage",
        description:
          "Registry office, a symbolic ceremony, or the full day in Hagen, Solingen, and NRW. The pictures follow your plan, and nothing is restaged for the camera.",
      },
      {
        title: "Photographs and film on the same day",
        description: `When you want both, the wedding film is made with the reportage. Concept, shoot, and edit sit with the film production. ${quote("en")}`,
      },
    ],
  },
  "real-estate": {
    de: [
      {
        title: "Räume, die man betreten will",
        description:
          "Innen, außen und Dämmerung für Makler in Hagen, Solingen und NRW. Das Angebot ist ein Fotopaket ohne Video, die Extras Walk Thru Video und Agent Branding Video, und die Bündel Premium Home und Luxury Makler.",
      },
      {
        title: "Ein Ansprechpartner für das Exposé",
        description: `Bei Premium Home und Luxury Makler werden Drohnenfotos auf das Fotopaket angerechnet, und die Drohnenaufnahmen fließen in das Video. ${quote("de")}`,
      },
    ],
    en: [
      {
        title: "Rooms people want to walk into",
        description:
          "Interiors, exteriors, and twilight for agents in Hagen, Solingen, and NRW. The offer is a photo package with no video, the extras Walk Thru Video and Agent Branding Video, and the bundles Premium Home and Luxury Makler.",
      },
      {
        title: "One contact for the listing",
        description: `On Premium Home and Luxury Makler, drone photos count toward the photo package and drone footage is used in the video. ${quote("en")}`,
      },
    ],
  },
  commercial: {
    de: [
      {
        title: "Bilder, die eine Marke tragen",
        description:
          "Fashion, Beauty, Produkt und Editorial für Marken in NRW. Kleinere Sets im Studio Hagen, größere Produktionen im Studio Solingen.",
      },
      {
        title: "Vom Packshot bis zur Kampagne",
        description: `Lookbook, Shop und Kampagne können aus einer Produktion kommen. ${quote("de")}`,
      },
    ],
    en: [
      {
        title: "Pictures that carry a brand",
        description:
          "Fashion, beauty, product, and editorial for brands in NRW. Smaller sets at the Hagen studio, larger productions at the Solingen studio.",
      },
      {
        title: "From the packshot to the campaign",
        description: `Lookbook, shop, and campaign can come from one production. ${quote("en")}`,
      },
    ],
  },
  food: {
    de: [
      {
        title: "Speisen, die man bestellen will",
        description: "Für Restaurants, Speisekarten und Produkte, im Studio oder in Ihrer Küche in NRW.",
      },
      {
        title: "Eine Serie, die zusammenpasst",
        description: `Karte, Verpackung und Social Media aus derselben Bildsprache. ${quote("de")}`,
      },
    ],
    en: [
      {
        title: "Dishes people want to order",
        description: "For restaurants, menus, and products, in the studio or in your kitchen in NRW.",
      },
      {
        title: "A series that belongs together",
        description: `Menu, packaging, and social media in the same visual language. ${quote("en")}`,
      },
    ],
  },
  "business-portraits": {
    de: [
      {
        title: "Porträts, die zur Firma passen",
        description:
          "Geschäftsführung, Teams und Profile, im Studio Hagen oder in Ihrem Büro. Größere Teams fotografiere ich im Studio Solingen.",
      },
      {
        title: "Eine Bildsprache für alle Kanäle",
        description: `Website, LinkedIn und Presse aus derselben Sitzung. ${quote("de")}`,
      },
    ],
    en: [
      {
        title: "Portraits that belong to the company",
        description:
          "Leadership, teams, and profiles, at the Hagen studio or in your office. Larger teams are photographed at the Solingen studio.",
      },
      {
        title: "One visual language for every channel",
        description: `Website, LinkedIn, and press from the same sitting. ${quote("en")}`,
      },
    ],
  },
  studio: {
    de: [
      {
        title: "Bewerbungsfotos, die zur Stelle passen",
        description:
          "Im Studio Hagen. Licht, Hintergrund und Ausdruck richten sich danach, wo das Bild erscheinen soll: Lebenslauf, LinkedIn oder Xing.",
      },
      {
        title: "Passbilder nach den amtlichen Vorgaben",
        description: `Ein Bewerbungsfoto kostet ${applicationPhotoPriceLine("de")}. Ein biometrisches Passfoto kostet ${passportPhotoPriceLine()}. Beides kann in einem Termin entstehen.`,
      },
    ],
    en: [
      {
        title: "Application photos that suit the role",
        description:
          "At the Hagen studio. Light, background, and expression follow where the picture will be used: a CV, LinkedIn, or Xing.",
      },
      {
        title: "Passport photos to the official rules",
        description: `An application photo is ${applicationPhotoPriceLine("en")}. A biometric passport photo is ${passportPhotoPriceLine()}. Both can be made in the same visit.`,
      },
    ],
  },
  cinematography: {
    de: [
      {
        title: "Film, der die Marke bewegt",
        description: "Imagefilme, Brand Films, Hochzeitsvideos und Social Reels aus Hagen für NRW.",
      },
      {
        title: "Konzept, Dreh und Schnitt",
        description: `Ein Team für die ganze Produktion, vor Ort oder im Studio Solingen. ${quote("de")}`,
      },
    ],
    en: [
      {
        title: "Film that moves a brand",
        description: "Brand films, wedding films, and social reels from Hagen for NRW.",
      },
      {
        title: "Concept, shoot, and edit",
        description: `One team for the whole production, on location or at the Solingen studio. ${quote("en")}`,
      },
    ],
  },
  "social-media-management": {
    de: [
      {
        title: "Ein Auftritt, der regelmäßig bleibt",
        description:
          "Plan, Bilder, Veröffentlichung und ein Blick darauf, was getragen hat. Für Marken in Hagen, Solingen und NRW.",
      },
      {
        title: "Foto, Film und Kanal zusammen",
        description: `Die Inhalte entstehen hier. ${quote("de")}`,
      },
    ],
    en: [
      {
        title: "A presence that stays regular",
        description:
          "A plan, pictures, publishing, and a look at what carried. For brands in Hagen, Solingen, and NRW.",
      },
      {
        title: "Photographs, film, and the channel together",
        description: `The content is made here. ${quote("en")}`,
      },
    ],
  },
};

export function serviceIntroKicker(locale: Locale) {
  return locale === "de" ? "Im Blick" : "In focus";
}

export function serviceIntroBeats(slug: CategorySlug, locale: Locale) {
  return BEATS[slug][locale];
}

const OG_STILL: Record<CategorySlug, string> = {
  wedding: "/og/og-wedding.jpg",
  "real-estate": "/og/og-real-estate.jpg",
  commercial: "/og/og-commercial.jpg",
  food: "/og/og-food.jpg",
  "business-portraits": "/og/og-business-portraits.jpg",
  studio: "/og/og-studio.jpg",
  cinematography: "/og/og-film.jpg",
  "social-media-management": "/og/og-social.jpg",
};

export type IntroFrame = {
  imageUrl: string | null;
  backgroundVideoUrl?: string;
};

type IntroSource = {
  url: string;
  type: "image" | "video";
};

/** Two frames from media already on the site: hero, then portfolio, then the share image. */
export function serviceIntroFrames(
  slug: CategorySlug,
  hero: readonly IntroSource[],
  portfolio: readonly { src: string }[]
): IntroFrame[] {
  const images = [...hero.filter((item) => item.type === "image").map((item) => item.url), ...portfolio.map((item) => item.src)]
    .filter((url) => !url.toLowerCase().includes("signet"))
    .filter((url, index, all) => all.indexOf(url) === index);
  const video = hero.find((item) => item.type === "video")?.url ?? null;
  const still = OG_STILL[slug];

  if (video) {
    const second = images.find((url) => url !== still) ?? still;
    return [
      { imageUrl: null, backgroundVideoUrl: video },
      { imageUrl: second },
    ];
  }

  const first = images[0] ?? still;
  const second = images.find((url) => url !== first) ?? (still !== first ? still : first);
  return [{ imageUrl: first }, { imageUrl: second }];
}

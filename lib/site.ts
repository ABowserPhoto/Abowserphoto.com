/**
 * Public business facts for Aaron Bowser Photography.
 * Phone, email, studio addresses, and Hagen hours come from `lib/contact.ts`.
 * Unknown values stay null and are omitted from JSON-LD.
 * Do not invent a price, a social profile, or a legal name that is not listed here.
 */

import {
  appointmentOnlyLabel,
  HAGEN_ADDRESS,
  SOLINGEN_ADDRESS,
  formatAddressLine,
} from "./contact";

export {
  appointmentOnlyLabel,
  contactEmailHref,
  contactPhoneHref,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
  CONTACT_PHONE_TEL,
  fillContactTokens,
  formatAddressLine,
  formatHagenOpeningHours,
  HAGEN_ADDRESS,
  HAGEN_OPENING_HOURS,
  hagenHoursLine,
  hagenOpeningHoursSpecification,
  SOLINGEN_ADDRESS,
} from "./contact";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aaronbowser-photography.com";

function normalizeSiteUrl(value: string) {
  const url = new URL(value);
  if (url.hostname === "aaronbowser-photography.com") {
    url.hostname = "www.aaronbowser-photography.com";
  }
  url.protocol = url.hostname.endsWith("aaronbowser-photography.com") ? "https:" : url.protocol;
  url.pathname = "";
  url.search = "";
  url.hash = "";
  return url.origin;
}

export const SITE_URL = normalizeSiteUrl(configuredSiteUrl);

/**
 * Google Analytics 4 measurement ID (gtag.js / Google tag).
 * studio.abowserphoto.com should reuse this same ID.
 */
export const GA_MEASUREMENT_ID = "G-L8XCWNTH3N";

export const BRAND_NAME = "Aaron Bowser Photography";
export const LEGAL_NAME = "Aaron Bowser Photography UG (haftungsbeschränkt)";

export const OG_IMAGE_PATH = "/og/aaron-bowser-photography-hagen-solingen.jpg";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = "Aaron Bowser Photography, Studios in Hagen und Solingen";

/** Preview image for the business-portraits pages only. */
export const BUSINESS_PORTRAITS_OG_IMAGE_PATH = "/og/og-business-portraits.jpg";
export const BUSINESS_PORTRAITS_OG_IMAGE_WIDTH = 1200;
export const BUSINESS_PORTRAITS_OG_IMAGE_HEIGHT = 630;
export const BUSINESS_PORTRAITS_OG_ALT = {
  de: "Businessportrait einer lächelnden Frau im fliederfarbenen Blazer als Vorschaubild für Business-Portraits.",
  en: "Business portrait of a smiling woman in a lilac blazer, used as the preview image for business portraits.",
} as const;

export type Studio = {
  id: "hagen" | "solingen";
  nameDe: string;
  nameEn: string;
  street: string;
  postalCode: string;
  city: string;
  countryCode: "DE";
  latitude: number;
  longitude: number;
  mapsUrl: string;
  /** Floor area in square metres. */
  areaSqm: number;
  summaryDe: string;
  summaryEn: string;
  /**
   * Locale-less path. `withLocale` maps it to the public German or English slug.
   * Null when the studio has no page of its own.
   */
  pagePath: string | null;
  detailLabelDe?: string;
  detailLabelEn?: string;
};

export const STUDIOS: readonly Studio[] = [
  {
    id: "hagen",
    nameDe: "Studio Hagen",
    nameEn: "Hagen studio",
    street: HAGEN_ADDRESS.street,
    postalCode: HAGEN_ADDRESS.postalCode,
    city: HAGEN_ADDRESS.city,
    countryCode: HAGEN_ADDRESS.countryCode,
    latitude: 51.3771835,
    longitude: 7.454225,
    mapsUrl:
      "https://www.google.com/maps/place/Aaron+Bowser+Photography/@51.3771835,7.454225,17z/data=!4m6!3m5!1s0x47b93cbdc8d7c7b3:0x6fde83c86b76ba38!8m2!3d51.3771835!4d7.454225!16s%2Fg%2F11btwpyctw",
    areaSqm: 40,
    summaryDe:
      "Hauptstudio, etwa 40 m². Aaron arbeitet hier täglich. Porträt- und Business-Sitzungen finden in der Regel hier statt.",
    summaryEn:
      "The main studio, about 40 m². Aaron works here every day. Portrait and business sessions are booked here by default.",
    pagePath: null,
  },
  {
    id: "solingen",
    nameDe: "Studio Solingen",
    nameEn: "Solingen studio",
    street: SOLINGEN_ADDRESS.street,
    postalCode: SOLINGEN_ADDRESS.postalCode,
    city: SOLINGEN_ADDRESS.city,
    countryCode: SOLINGEN_ADDRESS.countryCode,
    latitude: 51.1641699,
    longitude: 7.020909,
    mapsUrl:
      "https://www.google.com/maps/place/Aaron+Bowser+Photography/@51.1641699,7.020909,17z/data=!4m6!3m5!1s0x47b8d36375b52c6f:0x36d573286e598635!8m2!3d51.1641699!4d7.020909!16s%2Fg%2F11vzycbxq5",
    areaSqm: 100,
    summaryDe: `Etwa 100 m² für größere Produktionen, zum Beispiel Teams, Commercial und aufwendigere Sets. ${appointmentOnlyLabel("de")}. Studiovermietung möglich.`,
    summaryEn: `About 100 m² for larger productions, such as team shoots, commercial work, and bigger set-ups. ${appointmentOnlyLabel("en")}. The studio can be rented.`,
    pagePath: "/fotostudio-solingen",
    detailLabelDe: "Studio Solingen – mehr erfahren",
    detailLabelEn: "Learn more about the Solingen studio",
  },
];

export const HAGEN_STUDIO = STUDIOS[0];
export const SOLINGEN_STUDIO = STUDIOS[1];

export function formatStudioLine(studio: Pick<Studio, "street" | "postalCode" | "city">) {
  return formatAddressLine(studio);
}

/** Facts already printed in the site footer. */
export const COMPANY_REGISTER = {
  court: "Hagen",
  hrb: "11957",
  vatId: "DE344108567",
} as const;

export const MANAGING_DIRECTOR = "Aaron Bowser";

export const HOSTING_PROVIDER = "Vercel";

/**
 * The only amounts published on the site.
 * An application photo (Bewerbungsfoto) is €29 for 1 digital photo.
 * A biometric passport photo (Passbild / biometrisches Passfoto) is €15.
 * Every other service is an individual quote and must not publish an amount.
 */
export const APPLICATION_PHOTO_PRICE_EUR = "29";
export const PASSPORT_PHOTO_PRICE_EUR = "15";

export function applicationPhotoPriceLine(locale: "de" | "en") {
  return locale === "de" ? "€29 für 1 digitales Foto" : "€29 for 1 digital photo";
}

export function passportPhotoPriceLine() {
  return "€15";
}

export function studioSittingPriceAnswer(locale: "de" | "en") {
  if (locale === "de") {
    return `Ein Bewerbungsfoto kostet ${applicationPhotoPriceLine("de")}. Ein biometrisches Passfoto kostet ${passportPhotoPriceLine()}. LinkedIn- und Xing-Porträts aus demselben Termin sind auf Anfrage.`;
  }
  return `An application photo is ${applicationPhotoPriceLine("en")}. A biometric passport photo is ${passportPhotoPriceLine()}. LinkedIn and Xing portraits from the same visit are on request.`;
}

export const SOCIAL_LINKS = [
  {
    id: "instagram-main",
    label: "Aaron Bowser Photography",
    href: "https://instagram.com/aaronbowser_photography",
  },
  {
    id: "instagram-real-estate",
    label: "Immobilien Photography",
    href: "https://instagram.com/abowser_immobilien_photography",
  },
  {
    id: "instagram-food",
    label: "Food Photography",
    href: "https://instagram.com/abowser_food_photography",
  },
] as const;

/** Profile URLs for JSON-LD sameAs and public footer links. */
export const SOCIAL_PROFILE_URLS: readonly string[] = SOCIAL_LINKS.map((link) => link.href);

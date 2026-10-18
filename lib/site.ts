/**
 * Public business facts for Aaron Bowser Photography.
 * Unknown values stay null and are omitted from JSON-LD.
 * Do not invent a price, a social profile, or a legal name that is not listed here.
 */

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

export const BRAND_NAME = "Aaron Bowser Photography";
export const LEGAL_NAME = "Aaron Bowser Photography UG (haftungsbeschränkt)";

/** Public studio mailbox. */
export const CONTACT_EMAIL = "info@aaronbowser-photography.com";

/** Published in the site footer before this SEO pass. */
export const CONTACT_PHONE_DISPLAY = "+49 157 83529270";
export const CONTACT_PHONE_E164 = "+4915783529270";

export const OG_IMAGE_PATH = "/og/aaron-bowser-photography-hagen-solingen.jpg";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = "Aaron Bowser Photography, Studios in Hagen und Solingen";

export type Studio = {
  id: "hagen" | "solingen";
  nameDe: string;
  nameEn: string;
  street: string;
  postalCode: string;
  city: string;
  countryCode: "DE";
};

export const STUDIOS: readonly Studio[] = [
  {
    id: "hagen",
    nameDe: "Studio Hagen",
    nameEn: "Hagen studio",
    street: "Eckeseyer Str. 133",
    postalCode: "58089",
    city: "Hagen",
    countryCode: "DE",
  },
  {
    id: "solingen",
    nameDe: "Studio Solingen",
    nameEn: "Solingen studio",
    street: "Merscheider Str. 112",
    postalCode: "42699",
    city: "Solingen",
    countryCode: "DE",
  },
];

export const HAGEN_STUDIO = STUDIOS[0];
export const SOLINGEN_STUDIO = STUDIOS[1];

export function formatStudioLine(studio: Studio) {
  return `${studio.street}, ${studio.postalCode} ${studio.city}`;
}

/** Facts already printed in the site footer. */
export const COMPANY_REGISTER = {
  court: "Hagen",
  hrb: "11957",
  vatId: "DE344108567",
} as const;

/**
 * TODO(owner): Geschäftsführer der UG eintragen.
 * The footer names the company, court, HRB, and VAT ID, not the managing director.
 */
export const MANAGING_DIRECTOR: string | null = null;

/**
 * TODO(owner): Hosting-Anbieter für die Datenschutzerklärung eintragen.
 */
export const HOSTING_PROVIDER: string | null = null;

/**
 * TODO(owner): Startpreis für Business-Porträts eintragen, zum Beispiel "ab 249 €".
 * null zeigt auf der Seite nur "Preis auf Anfrage".
 */
export const BUSINESS_PORTRAIT_PRICE_FROM: string | null = null;

/**
 * TODO(owner): Echte Profil-URLs eintragen (Instagram, LinkedIn, weitere).
 * Platzhalter-Domains werden nicht veröffentlicht und nicht in sameAs geschrieben.
 */
export const SOCIAL_PROFILE_URLS: readonly string[] = [];

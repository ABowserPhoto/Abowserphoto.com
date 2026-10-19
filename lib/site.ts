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

/** Preview image for the business-portraits pages only. */
export const BUSINESS_PORTRAITS_OG_IMAGE_PATH = "/og/og-business-portraits.jpg";
export const BUSINESS_PORTRAITS_OG_IMAGE_WIDTH = 1200;
export const BUSINESS_PORTRAITS_OG_IMAGE_HEIGHT = 630;
export const BUSINESS_PORTRAITS_OG_ALT = {
  de: "Businessportrait einer Unternehmerin im roten Blazer als Vorschaubild für Business-Portraits.",
  en: "Business portrait of a businesswoman in a red blazer, used as the preview image for business portraits.",
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
   * Public page for this studio. Null until the page exists, so the
   * interface must not render a link.
   */
  pagePath: string | null;
  /** Plain-text hook. Not a link while pagePath is null. */
  detailLabelDe?: string;
  detailLabelEn?: string;
  /** Reserved path for a future page. Do not link it yet. */
  plannedPagePath?: string;
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
    street: "Merscheider Str. 112",
    postalCode: "42699",
    city: "Solingen",
    countryCode: "DE",
    latitude: 51.1641699,
    longitude: 7.020909,
    mapsUrl:
      "https://www.google.com/maps/place/Aaron+Bowser+Photography/@51.1641699,7.020909,17z/data=!4m6!3m5!1s0x47b8d36375b52c6f:0x36d573286e598635!8m2!3d51.1641699!4d7.020909!16s%2Fg%2F11vzycbxq5",
    areaSqm: 100,
    summaryDe:
      "Etwa 100 m² für größere Produktionen, zum Beispiel Teams, Commercial und aufwendigere Sets. Nur nach Termin. Studiovermietung möglich.",
    summaryEn:
      "About 100 m² for larger productions, such as team shoots, commercial work, and bigger set-ups. By appointment only. The studio can be rented.",
    pagePath: null,
    detailLabelDe: "Studio Solingen – mehr erfahren",
    detailLabelEn: "Studio Solingen — more to come",
    plannedPagePath: "/studio-solingen",
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
 * Platzhalter-Domains werden nicht veröffentlicht. Google-Maps-Einträge
 * stehen an den Studios und werden separat in sameAs aufgenommen.
 */
export const SOCIAL_PROFILE_URLS: readonly string[] = [];

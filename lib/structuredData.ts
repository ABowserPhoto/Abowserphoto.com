import {
  CONTACT_EMAIL,
  CONTACT_PHONE_TEL,
  hagenOpeningHoursSpecification,
} from "./contact";
import type { FAQItem } from "./content";
import { withLocale, type Locale } from "./i18n/config";
import { absoluteUrl } from "./i18n/seo";
import { solingenStudioPath } from "./routes";
import { nicheOrigin } from "./subdomains";
import {
  APPLICATION_PHOTO_PRICE_EUR,
  BRAND_NAME,
  COMPANY_REGISTER,
  HAGEN_STUDIO,
  LEGAL_NAME,
  OG_IMAGE_PATH,
  PASSPORT_PHOTO_PRICE_EUR,
  SITE_URL,
  SOLINGEN_RENTAL_RATES,
  SOCIAL_PROFILE_URLS,
  SOLINGEN_STUDIO,
  STUDIOS,
  type Studio,
} from "./site";

function postalAddress(studio: Studio) {
  return {
    "@type": "PostalAddress",
    streetAddress: studio.street,
    postalCode: studio.postalCode,
    addressLocality: studio.city,
    addressCountry: studio.countryCode,
  };
}

function studioNode(studio: Studio) {
  const node: Record<string, unknown> = {
    "@type": ["LocalBusiness", "ProfessionalService", "Photographer"],
    "@id": `${SITE_URL}/#studio-${studio.id}`,
    name: `${BRAND_NAME} ${studio.nameDe}`,
    url:
      studio.id === "solingen"
        ? absoluteUrl(withLocale(solingenStudioPath("de"), "de"))
        : SITE_URL,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_TEL,
    image: absoluteUrl(OG_IMAGE_PATH),
    address: postalAddress(studio),
    geo: {
      "@type": "GeoCoordinates",
      latitude: studio.latitude,
      longitude: studio.longitude,
    },
    hasMap: studio.mapsUrl,
    description: studio.summaryDe,
    floorSize: {
      "@type": "QuantitativeValue",
      value: studio.areaSqm,
      unitCode: "MTK",
      unitText: "m²",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };

  // Public hours exist only for Hagen. Solingen is by appointment and must not
  // declare openingHours or openingHoursSpecification.
  if (studio.id === "hagen") {
    node.openingHoursSpecification = hagenOpeningHoursSpecification();
  }

  return node;
}

/**
 * One photography practice with two studio locations.
 * Opening hours belong to the Hagen address (the practice and the Hagen studio).
 * The Solingen studio does not publish opening hours.
 * No priceRange and no priced offers. The only public prices are the
 * application-photo and passport-photo offers from `buildStudioServiceJsonLd`.
 */
export function buildBusinessJsonLd() {
  const organization: Record<string, unknown> = {
    "@type": ["LocalBusiness", "ProfessionalService", "Photographer"],
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_TEL,
    image: absoluteUrl(OG_IMAGE_PATH),
    description: `Fotograf in Hagen und Solingen. Das Studio Hagen hat etwa 40 m² für Porträts und Business. Das Studio Solingen hat etwa 100 m² für größere Produktionen, Projekte und Teams und kann gemietet werden.`,
    address: postalAddress(HAGEN_STUDIO),
    // The practice address is the Hagen studio, so the same public hours apply here.
    // Solingen is a separate node and does not receive them.
    openingHoursSpecification: hagenOpeningHoursSpecification(),
    areaServed: [
      { "@type": "City", name: "Hagen" },
      { "@type": "City", name: "Solingen" },
      { "@type": "AdministrativeArea", name: "Nordrhein-Westfalen" },
    ],
    vatID: COMPANY_REGISTER.vatId,
    department: [
      { "@id": `${SITE_URL}/#studio-${HAGEN_STUDIO.id}` },
      { "@id": `${SITE_URL}/#studio-${SOLINGEN_STUDIO.id}` },
    ],
  };

  const sameAs = [...STUDIOS.map((studio) => studio.mapsUrl), ...SOCIAL_PROFILE_URLS];
  if (sameAs.length > 0) {
    organization.sameAs = sameAs;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [organization, studioNode(HAGEN_STUDIO), studioNode(SOLINGEN_STUDIO)],
  };
}

/**
 * Priced offers for the two services that publish a fee.
 * Rendered on the studio pages, where those services are described.
 */
export function buildStudioServiceJsonLd(locale: Locale) {
  const de = locale === "de";
  const pageUrl = `${nicheOrigin("studio")}/${locale}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#service-application-photo`,
        name: de ? "Bewerbungsfoto" : "Application photo",
        serviceType: de ? "Bewerbungsfoto" : "Application photo",
        description: de ? "1 digitales Foto" : "1 digital photo",
        url: pageUrl,
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          price: APPLICATION_PHOTO_PRICE_EUR,
          priceCurrency: "EUR",
          description: de ? "1 digitales Foto" : "1 digital photo",
        },
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#service-passport-photo`,
        name: de ? "Biometrisches Passfoto" : "Passport photo",
        alternateName: de ? "Passbild" : "Biometric passport photo",
        serviceType: de ? "Passbild" : "Passport photo",
        description: de ? "Biometrisches Passfoto" : "Biometric passport photo",
        url: pageUrl,
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          price: PASSPORT_PHOTO_PRICE_EUR,
          priceCurrency: "EUR",
          description: de ? "Biometrisches Passfoto" : "Biometric passport photo",
        },
      },
    ],
  };
}

/** Place + LocalBusiness for the Solingen studio page. No hours and no price. */
export function buildSolingenPlaceJsonLd(locale: Locale) {
  const de = locale === "de";
  const pageUrl = absoluteUrl(withLocale(solingenStudioPath(locale), locale));
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Place"],
    "@id": `${pageUrl}#place`,
    name: de ? `${BRAND_NAME} Studio Solingen` : `${BRAND_NAME} Solingen studio`,
    url: pageUrl,
    image: absoluteUrl(OG_IMAGE_PATH),
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_TEL,
    address: postalAddress(SOLINGEN_STUDIO),
    geo: {
      "@type": "GeoCoordinates",
      latitude: SOLINGEN_STUDIO.latitude,
      longitude: SOLINGEN_STUDIO.longitude,
    },
    hasMap: SOLINGEN_STUDIO.mapsUrl,
    description: de
      ? `Fotostudio in Solingen, etwa ${SOLINGEN_STUDIO.areaSqm} m², für größere Produktionen, Projekte und Teams, die im Studio Hagen zu groß wären. Ein Shooting wird vor dem Besuch terminiert. Das Studio kann gemietet werden.`
      : `Photo studio in Solingen, about ${SOLINGEN_STUDIO.areaSqm} m², for larger productions, projects and teams that would be too big for the Hagen studio. To book a shoot, contact the studio and schedule an appointment before coming. The studio can also be rented.`,
    floorSize: {
      "@type": "QuantitativeValue",
      value: SOLINGEN_STUDIO.areaSqm,
      unitCode: "MTK",
      unitText: "m²",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * Public Solingen rental rates. Gross, VAT included.
 * Inclusions are not listed here: they are not confirmed.
 */
export function buildSolingenRentalOfferJsonLd(locale: Locale) {
  const de = locale === "de";
  const pageUrl = absoluteUrl(withLocale(solingenStudioPath(locale), locale));
  const rates = SOLINGEN_RENTAL_RATES;

  function offer(name: string, price: string, description: string) {
    return {
      "@type": "Offer",
      name,
      price,
      priceCurrency: "EUR",
      valueAddedTaxIncluded: true,
      availability: "https://schema.org/InStock",
      url: pageUrl,
      description,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: "EUR",
        valueAddedTaxIncluded: true,
      },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${pageUrl}#rental-offers`,
    name: de ? "Fotostudio mieten in Solingen" : "Rent the Solingen photo studio",
    url: pageUrl,
    itemListElement: [
      offer(
        de ? "Stundenweise" : "Hourly",
        rates.hourlyEur,
        de
          ? `${rates.hourlyEur} € pro Stunde, mindestens ${rates.minimumHours} Stunden, inkl. 19 % MwSt.`
          : `€${rates.hourlyEur} per hour, ${rates.minimumHours} hour minimum, including 19% VAT.`
      ),
      offer(
        de ? "Halber Tag" : "Half day",
        rates.halfDayEur,
        de
          ? `${rates.halfDayEur} € für ${rates.halfDayHours} Stunden, inkl. 19 % MwSt.`
          : `€${rates.halfDayEur} for ${rates.halfDayHours} hours, including 19% VAT.`
      ),
      offer(
        de ? "Ganzer Tag" : "Full day",
        rates.fullDayEur,
        de
          ? `${rates.fullDayEur} € für ${rates.fullDayHours} Stunden, inkl. 19 % MwSt.`
          : `€${rates.fullDayEur} for ${rates.fullDayHours} hours, including 19% VAT.`
      ),
    ],
  };
}

export function buildFaqPageJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

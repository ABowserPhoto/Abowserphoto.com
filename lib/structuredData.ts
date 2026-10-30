import {
  appointmentOnlyLabel,
  CONTACT_EMAIL,
  CONTACT_PHONE_TEL,
  hagenOpeningHoursSpecification,
} from "./contact";
import { absoluteUrl } from "./i18n/seo";
import {
  BRAND_NAME,
  COMPANY_REGISTER,
  HAGEN_STUDIO,
  LEGAL_NAME,
  OG_IMAGE_PATH,
  SITE_URL,
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
    url: SITE_URL,
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
 * Unknown fields (priceRange) are omitted.
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
    description: `Fotograf mit Hauptstudio in Hagen, etwa 40 m², für Porträt und Business im Alltag. Das Studio Solingen, etwa 100 m², ist für größere Produktionen, ${appointmentOnlyLabel("de", { sentence: false })}, und kann gemietet werden.`,
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

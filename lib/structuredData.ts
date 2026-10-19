import { absoluteUrl } from "./i18n/seo";
import {
  BRAND_NAME,
  COMPANY_REGISTER,
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
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
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#studio-${studio.id}`,
    name: `${BRAND_NAME} ${studio.nameDe}`,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_E164,
    image: absoluteUrl(OG_IMAGE_PATH),
    address: postalAddress(studio),
    geo: {
      "@type": "GeoCoordinates",
      latitude: studio.latitude,
      longitude: studio.longitude,
    },
    hasMap: studio.mapsUrl,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * One photography practice with two studio locations.
 * Unknown fields (priceRange, opening hours, social profiles) are omitted.
 */
export function buildBusinessJsonLd() {
  const organization: Record<string, unknown> = {
    "@type": ["ProfessionalService", "Photographer"],
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_E164,
    image: absoluteUrl(OG_IMAGE_PATH),
    address: postalAddress(HAGEN_STUDIO),
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

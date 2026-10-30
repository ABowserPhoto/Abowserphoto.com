/**
 * GA4 events for leads and contact clicks.
 *
 * `trackEvent` does nothing during SSR, outside production, without analytics
 * consent, or when `window.gtag` is missing. The cookie banner is the consent
 * gate: the tag in `components/GoogleAnalytics.tsx` loads only after
 * "Alle akzeptieren", and a later "Nur essenzielle" choice blocks further hits.
 */
import { getPathSlug, isRealEstateBookingPath, type InquiryCategorySlug } from "./booking";
import { hasAnalyticsConsent } from "./cookieConsent";
import type { CategorySlug } from "./content";
import { resolveCategorySegment } from "./routes";
import { GA_MEASUREMENT_ID } from "./site";
import { nicheHostForHostname } from "./subdomains";

export const GENERATE_LEAD_EVENT = "generate_lead";
export const CONTACT_CLICK_EVENT = "contact_click";

export const IMMOBILIEN_BOOKING_FORM_NAME = "immobilien_booking";

/** Public path segments that mean a passport photo rather than an application photo. */
const PASSPORT_SEGMENTS = new Set(["passbilder", "passfotos", "passport-photos"]);

/**
 * GA4 `service` values. Niche host labels where the host is the public name
 * (`wedding`, `business`, `food`, …). Real estate and the studio sittings use
 * the German names already used on the site.
 */
const SERVICE_BY_CATEGORY = {
  wedding: "wedding",
  "real-estate": "immobilien",
  "business-portraits": "business",
  studio: "bewerbungsfoto",
  food: "food",
  cinematography: "film",
  "social-media-management": "social",
  commercial: "commercial",
} as const satisfies Record<CategorySlug, string>;

const INQUIRY_FORM_NAMES = {
  wedding: "wedding_inquiry",
  "business-portraits": "business_inquiry",
  studio: "studio_inquiry",
  food: "food_inquiry",
  cinematography: "film_inquiry",
  "social-media-management": "social_inquiry",
  commercial: "commercial_inquiry",
  general: "general_inquiry",
} as const satisfies Record<InquiryCategorySlug, string>;

export type AnalyticsEventName = typeof GENERATE_LEAD_EVENT | typeof CONTACT_CLICK_EVENT;

export type GenerateLeadParams = {
  form_name: string;
  service: string;
  host: string;
};

export type ContactClickParams = {
  link_type: "tel" | "mailto";
  link_url: string;
  host: string;
  service?: string;
};

export type ContactLink = {
  link_type: "tel" | "mailto";
  link_url: string;
};

type ClickTargetLike = {
  closest?: (selector: string) => { getAttribute?: (name: string) => string | null } | null;
  parentElement?: ClickTargetLike | null;
};

type ClickListenable = {
  addEventListener(
    type: "click",
    listener: (event: Event) => void,
    options?: AddEventListenerOptions | boolean
  ): void;
  removeEventListener(
    type: "click",
    listener: (event: Event) => void,
    options?: EventListenerOptions | boolean
  ): void;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function analyticsDisabled() {
  const flag = `ga-disable-${GA_MEASUREMENT_ID}`;
  return (window as unknown as Record<string, unknown>)[flag] === true;
}

/** True only when a production page may send a hit. */
export function canTrackAnalytics() {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV !== "production") return false;
  if (!hasAnalyticsConsent()) return false;
  if (analyticsDisabled()) return false;
  return typeof window.gtag === "function";
}

export function trackEvent(
  name: AnalyticsEventName,
  params: Record<string, string | undefined>
): boolean {
  if (!canTrackAnalytics()) return false;

  const payload: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value) payload[key] = value;
  }

  try {
    window.gtag!("event", name, payload);
    return true;
  } catch {
    return false;
  }
}

export function serviceForCategory(slug: CategorySlug) {
  return SERVICE_BY_CATEGORY[slug];
}

export function serviceForInquirySlug(slug: InquiryCategorySlug) {
  if (slug === "general") return "general";
  return SERVICE_BY_CATEGORY[slug];
}

export function inquiryFormName(slug: InquiryCategorySlug) {
  return INQUIRY_FORM_NAMES[slug];
}

/**
 * Service implied by the hostname or the path.
 * A niche host wins, because `/` and `/de` on that host are the category page.
 * Passport aliases stay `passfoto` on the studio host and on the main site.
 * Returns undefined when the page is not a service page (home, legal, account).
 */
export function pageService(pathname: string, hostname: string): string | undefined {
  const segment = getPathSlug(pathname).toLowerCase();
  const niche = nicheHostForHostname(hostname);
  const passport = PASSPORT_SEGMENTS.has(segment);

  if (niche?.slug === "studio" && passport) return "passfoto";
  if (niche) return SERVICE_BY_CATEGORY[niche.slug];
  if (passport) return "passfoto";
  if (isRealEstateBookingPath(pathname)) return "immobilien";

  const category = resolveCategorySegment(segment);
  if (category) return SERVICE_BY_CATEGORY[category];
  return undefined;
}

export function immobilienBookingLead(): Pick<GenerateLeadParams, "form_name" | "service"> {
  return {
    form_name: IMMOBILIEN_BOOKING_FORM_NAME,
    service: serviceForCategory("real-estate"),
  };
}

export function inquiryLead(
  slug: InquiryCategorySlug,
  pathname: string,
  hostname: string
): Pick<GenerateLeadParams, "form_name" | "service"> {
  return {
    form_name: inquiryFormName(slug),
    service: pageService(pathname, hostname) ?? serviceForInquirySlug(slug),
  };
}

export function trackGenerateLead(input: Pick<GenerateLeadParams, "form_name" | "service">) {
  if (typeof window === "undefined") return false;
  return trackEvent(GENERATE_LEAD_EVENT, {
    form_name: input.form_name,
    service: input.service,
    host: window.location.hostname,
  });
}

export function contactLinkFromTarget(target: EventTarget | null): ContactLink | null {
  let current = target as ClickTargetLike | null;
  if (current && typeof current.closest !== "function" && current.parentElement) {
    current = current.parentElement;
  }
  const anchor = current && typeof current.closest === "function" ? current.closest("a") : null;
  const href = anchor?.getAttribute?.("href")?.trim() ?? "";
  if (!href) return null;

  const lower = href.toLowerCase();
  if (lower.startsWith("tel:")) return { link_type: "tel", link_url: href };
  if (lower.startsWith("mailto:")) return { link_type: "mailto", link_url: href };
  return null;
}

export function handleContactClick(event: Event) {
  const link = contactLinkFromTarget(event.target);
  if (!link || typeof window === "undefined") return false;

  const service = pageService(window.location.pathname, window.location.hostname);
  return trackEvent(CONTACT_CLICK_EVENT, {
    link_type: link.link_type,
    link_url: link.link_url,
    host: window.location.hostname,
    service,
  });
}

/**
 * One document click listener. Anchors rendered later are covered because the
 * listener reads the event target instead of binding each link.
 * Passive: the handler never calls preventDefault.
 */
export function installContactClickListener(target?: ClickListenable) {
  const listenable =
    target ?? (typeof document === "undefined" ? undefined : (document as unknown as ClickListenable));
  if (!listenable) return () => {};

  const onClick = (event: Event) => {
    handleContactClick(event);
  };
  listenable.addEventListener("click", onClick, { passive: true });
  return () => listenable.removeEventListener("click", onClick);
}

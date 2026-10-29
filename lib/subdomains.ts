import type { CategorySlug } from "./content";
import { SITE_URL } from "./site";

/**
 * Niche hosts stay on their own hostname. `proxy.ts` rewrites them to a
 * localized path on this app instead of redirecting the browser onto a
 * `/de/...` or `/en/...` folder of the main site.
 *
 * `studio.` serves the Bewerbungsfotos / application-photos category.
 * The others serve one category landing page each.
 */
export const NICHE_HOSTS = [
  { prefix: "immo.", basePath: "/real-estate" },
  { prefix: "food.", basePath: "/food" },
  { prefix: "wedding.", basePath: "/wedding" },
  { prefix: "studio.", basePath: "/application-photos" },
] as const;

export type NicheHost = (typeof NICHE_HOSTS)[number];

export type PortalCategorySlug = Extract<
  CategorySlug,
  | "commercial"
  | "real-estate"
  | "wedding"
  | "food"
  | "business-portraits"
  | "cinematography"
  | "social-media-management"
  | "studio"
>;

/** Portal menu labels → first hostname segment (e.g. `immo.example.com`). */
export const PORTAL_CATEGORY_SUBDOMAIN: Record<PortalCategorySlug, string> = {
  commercial: "commercial",
  "real-estate": "immo",
  wedding: "wedding",
  food: "food",
  "business-portraits": "business",
  cinematography: "film",
  "social-media-management": "social",
  studio: "studio",
};

const PORTAL_SUBDOMAIN_PREFIXES = new Set([
  ...Object.values(PORTAL_CATEGORY_SUBDOMAIN),
  ...NICHE_HOSTS.map((entry) => entry.prefix.slice(0, -1)),
]);

function rootDomainFromSiteUrl() {
  try {
    return new URL(SITE_URL).hostname.replace(/^www\./, "");
  } catch {
    return "abowserphoto.com";
  }
}

/** Apex domain without `www.` or a known category subdomain prefix. */
export function rootDomainFromHost(host: string): string {
  const bare = host.split(":")[0]?.toLowerCase() ?? "";
  if (!bare || bare === "localhost" || bare === "127.0.0.1") {
    return rootDomainFromSiteUrl();
  }

  const withoutWww = bare.replace(/^www\./, "");
  const labels = withoutWww.split(".");
  if (labels.length >= 3 && PORTAL_SUBDOMAIN_PREFIXES.has(labels[0] ?? "")) {
    return labels.slice(1).join(".");
  }

  return withoutWww;
}

/**
 * Absolute URL for a category niche host. Uses the apex of the current site
 * (abowserphoto.com, aaronbowser-photography.com, etc.) so links work across
 * the three production domains and from localhost during development.
 */
export function getSubdomainUrl(subdomain: string, host?: string): string {
  const resolvedHost =
    host ?? (typeof window !== "undefined" ? window.location.host : "");
  const root = rootDomainFromHost(resolvedHost);
  const protocol = root === "localhost" || root.startsWith("127.0.0.1") ? "http:" : "https:";
  return `${protocol}//${subdomain}.${root}/`;
}

export function portalCategoryUrl(slug: PortalCategorySlug, host?: string): string {
  return getSubdomainUrl(PORTAL_CATEGORY_SUBDOMAIN[slug], host);
}

export function nicheHostForHostname(hostname: string): NicheHost | null {
  const host = hostname.toLowerCase().split(":")[0] ?? "";
  return NICHE_HOSTS.find((entry) => host.startsWith(entry.prefix)) ?? null;
}
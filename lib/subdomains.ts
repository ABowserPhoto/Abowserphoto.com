/**
 * Niche hosts stay on their own hostname. `proxy.ts` rewrites `/`, `/de`, and
 * `/en` to a localized category path on this app instead of redirecting the
 * browser onto the main site.
 *
 * Portal links always use `<sub>.abowserphoto.com`, on whichever apex the
 * visitor arrived. Localhost (and `*.localhost`) keeps the dev port so the
 * same hosts can be opened locally.
 *
 * `studio.` serves Bewerbungsfotos / application photos. Each other prefix
 * serves one category. English and German paths come from `CATEGORY_SEGMENTS`.
 */
import type { CategorySlug } from "./content";
import { isLocale, stripLocaleFromPathname, withLocale, type Locale } from "./i18n/config";
import { CATEGORY_SEGMENTS, resolveCategorySegment } from "./routes";

export const PORTAL_APEX = "abowserphoto.com";

/** Homepage portal order. Subdomain labels are the public host prefixes. */
export const PORTAL_CATEGORY_ORDER = [
  "commercial",
  "real-estate",
  "wedding",
  "food",
  "business-portraits",
  "cinematography",
  "social-media-management",
  "studio",
] as const satisfies readonly CategorySlug[];

export type PortalCategory = (typeof PORTAL_CATEGORY_ORDER)[number];

export const PORTAL_CATEGORY_SUBDOMAIN: Record<PortalCategory, string> = {
  commercial: "commercial",
  "real-estate": "immo",
  wedding: "wedding",
  food: "food",
  "business-portraits": "business",
  cinematography: "film",
  "social-media-management": "social",
  studio: "studio",
};

export const NICHE_HOSTS = PORTAL_CATEGORY_ORDER.map((slug) => {
  const subdomain = PORTAL_CATEGORY_SUBDOMAIN[slug];
  return {
    prefix: `${subdomain}.`,
    subdomain,
    slug,
    /** English segment. `withLocale` applies the German public path. */
    basePath: `/${CATEGORY_SEGMENTS[slug].en}`,
  };
});

export type NicheHost = (typeof NICHE_HOSTS)[number];

/**
 * Pages that are not the niche landing but must still render on that host:
 * legal, account, booking, and this category's own routes (including the
 * commercial portfolio).
 */
const NICHE_SHARED_ROOTS = new Set([
  "impressum",
  "datenschutz",
  "cookie-richtlinie",
  "account",
  "book",
  "booking",
]);

export function nicheHostForHostname(hostname: string): NicheHost | null {
  const host = hostname.toLowerCase().split(":")[0] ?? "";
  return NICHE_HOSTS.find((entry) => host.startsWith(entry.prefix)) ?? null;
}

function splitHost(host: string) {
  const trimmed = host.trim();
  if (trimmed.startsWith("[")) {
    const end = trimmed.indexOf("]");
    const hostname = (end >= 0 ? trimmed.slice(1, end) : trimmed).toLowerCase();
    const port = end >= 0 && trimmed[end + 1] === ":" ? trimmed.slice(end + 2) : "";
    return { hostname, port };
  }
  const [hostname = "", port = ""] = trimmed.split(":");
  return { hostname: hostname.toLowerCase(), port };
}

function isDevHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

/** Origin for a niche label. Production is always the short apex. */
export function nicheOrigin(subdomain: string, host?: string | null) {
  const label = subdomain.trim().toLowerCase();
  const { hostname, port } = splitHost(host ?? "");
  if (hostname && isDevHostname(hostname)) {
    const portSuffix = port ? `:${port}` : "";
    return `http://${label}.localhost${portSuffix}`;
  }
  return `https://${label}.${PORTAL_APEX}`;
}

export function getSubdomainUrl(
  subdomain: string,
  options: { host?: string | null; locale?: Locale; pathname?: string } = {}
) {
  const origin = nicheOrigin(subdomain, options.host);
  const pathname = options.pathname ?? (options.locale ? `/${options.locale}` : "/");
  if (pathname === "/") return `${origin}/`;
  return `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

/** Public URL for a homepage portal category. Includes the locale when given. */
export function portalCategoryUrl(
  slug: PortalCategory,
  options: { host?: string | null; locale?: Locale } = {}
) {
  return getSubdomainUrl(PORTAL_CATEGORY_SUBDOMAIN[slug], options);
}

function localeLessParts(pathname: string) {
  return stripLocaleFromPathname(pathname).split("/").filter(Boolean);
}

/** `/`, `/de`, `/en`, or exactly this niche's category path (no extra segments). */
export function isNicheCategoryLanding(pathname: string, slug: CategorySlug) {
  const visible = pathname.split("/").filter(Boolean);
  if (visible.length === 0) return true;
  if (visible.length === 1 && isLocale(visible[0] ?? "")) return true;
  const parts = localeLessParts(pathname);
  return parts.length === 1 && resolveCategorySegment(parts[0] ?? "") === slug;
}

/**
 * True when this path should be served as itself on a niche host.
 * Bare `/`, `/de`, and `/en` are landings and return false.
 */
export function isNicheOnHostPath(pathname: string, slug: CategorySlug) {
  const parts = localeLessParts(pathname);
  const first = parts[0];
  if (!first) return false;
  if (NICHE_SHARED_ROOTS.has(first)) return true;
  return resolveCategorySegment(first) === slug;
}

/**
 * Language switch on a niche host. The landing stays on `/de` or `/en` so the
 * category folder never enters the address bar. Subpages keep their path.
 */
export function nicheLocaleSwitchPath(pathname: string, locale: Locale, niche: NicheHost) {
  if (!isNicheCategoryLanding(pathname, niche.slug) && isNicheOnHostPath(pathname, niche.slug)) {
    return withLocale(stripLocaleFromPathname(pathname), locale);
  }
  return `/${locale}`;
}

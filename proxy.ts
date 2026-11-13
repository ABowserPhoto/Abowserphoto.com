import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  defaultLocale,
  detectLocaleFromHeader,
  getLocaleFromPathname,
  isLocale,
  stripLocaleFromPathname,
  withLocale,
  type Locale,
} from "./lib/i18n/config";
import { localizePublicPath } from "./lib/routes";
import { isNicheOnHostPath, nicheHostForHostname } from "./lib/subdomains";
import { copySessionOntoResponse, updateSession } from "./lib/supabase/middleware";

const PUBLIC_FILE = /\.[^/]+$/;
const RESERVED_ROOT = new Set(["api", "auth", "_next"]);

function isSkippedPath(pathname: string) {
  const first = pathname.split("/").filter(Boolean)[0] ?? "";
  return (
    RESERVED_ROOT.has(first) ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  );
}

function resolveLocale(req: NextRequest, fallback: Locale): Locale {
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;
  return detectLocaleFromHeader(req.headers.get("accept-language"), fallback);
}

function applyLocaleHeaders(response: NextResponse, locale: Locale) {
  response.headers.set("x-locale", locale);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

function redirectToPath(
  req: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
  locale: Locale
) {
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = pathname;
  // A request like `/de/deutsch/` marks the URL as trailing-slash, and Next
  // would then emit `/de/`. Rebuild so the destination is the path we set.
  const target = new URL(redirectUrl.href);
  target.pathname = pathname;
  const redirect = NextResponse.redirect(target, 308);
  return applyLocaleHeaders(copySessionOntoResponse(supabaseResponse, redirect), locale);
}

function localeRequestHeaders(req: NextRequest, locale: Locale) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", locale);
  return requestHeaders;
}

/** Serve `pathname` without changing the browser URL. */
function rewriteToPath(
  req: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
  locale: Locale
) {
  const rewriteUrl = req.nextUrl.clone();
  rewriteUrl.pathname = pathname;
  const rewrite = NextResponse.rewrite(rewriteUrl, {
    request: { headers: localeRequestHeaders(req, locale) },
  });
  return applyLocaleHeaders(copySessionOntoResponse(supabaseResponse, rewrite), locale);
}

function continueWithLocale(req: NextRequest, supabaseResponse: NextResponse, locale: Locale) {
  const response = NextResponse.next({
    request: { headers: localeRequestHeaders(req, locale) },
  });
  return applyLocaleHeaders(copySessionOntoResponse(supabaseResponse, response), locale);
}

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

/**
 * Old site URLs under `/deutsch`. No locale means the German homepage.
 * An `en` or `de` prefix is kept. Other paths return null.
 */
function legacyDeutschLocale(pathname: string): Locale | null {
  const parts = normalizePathname(pathname).toLowerCase().split("/").filter(Boolean);
  const [first, second] = parts;
  if (first === "deutsch") return "de";
  if (first && isLocale(first) && second === "deutsch") return first;
  return null;
}

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = (req.headers.get("host") || "").split(":")[0];

  if (hostname === "aaronbowser-photography.com") {
    const redirectUrl = url.clone();
    redirectUrl.hostname = "www.aaronbowser-photography.com";
    redirectUrl.protocol = "https:";
    redirectUrl.port = "";
    const legacyLocale = legacyDeutschLocale(url.pathname);
    if (legacyLocale) {
      redirectUrl.pathname = `/${legacyLocale}`;
      const target = new URL(redirectUrl.href);
      target.pathname = `/${legacyLocale}`;
      return NextResponse.redirect(target, 308);
    }
    return NextResponse.redirect(redirectUrl, 308);
  }

  const supabaseResponse = await updateSession(req);
  const pathname = normalizePathname(url.pathname);

  if (isSkippedPath(pathname)) {
    return supabaseResponse;
  }

  // These three paths already redirect on every host, including niche hosts.
  // next.config.ts does the same. Any other /deutsch URL is main-host only.
  const legacyGerman = pathname.toLowerCase();
  if (
    legacyGerman === "/deutsch" ||
    legacyGerman === "/deutsch/index" ||
    legacyGerman === "/deutsch/index.html"
  ) {
    return redirectToPath(req, supabaseResponse, "/de", "de");
  }

  const niche = nicheHostForHostname(hostname);
  // Niche hosts are German-market sites. The fallback locale is German.
  // A cookie or an explicit Accept-Language of en/de still wins. The rewrite
  // stays on this hostname.
  const locale = resolveLocale(req, niche ? "de" : defaultLocale);

  // `/deutsch/indhttpsex` and `/{en|de}/deutsch/...` are broken legacy links.
  // Send them to that locale's homepage. Niche hosts are skipped: an unknown
  // path there is rewritten onto the same host below, and must not leave it.
  // `/de` and `/en` are not matched, so this cannot loop with the `/` → locale redirect.
  if (!niche) {
    const legacyLocale = legacyDeutschLocale(pathname);
    if (legacyLocale && pathname.toLowerCase() !== `/${legacyLocale}`) {
      return redirectToPath(req, supabaseResponse, `/${legacyLocale}`, legacyLocale);
    }
  }

  if (niche) {
    // `/`, `/de`, and `/en` are the public category URL. A locale prefix wins
    // over the cookie. The rewrite leaves the browser on this host.
    // This category's own routes, plus legal, account, and booking, are served
    // here too so those links do not collapse back into the landing page.
    // Any other path still rewrites to the landing page.
    const pathLocale = getLocaleFromPathname(pathname);
    const nicheLocale = pathLocale ?? locale;
    const destination = withLocale(niche.basePath, nicheLocale);
    const bareLanding = pathname === "/" || pathname === "/de" || pathname === "/en";
    if (bareLanding || !isNicheOnHostPath(pathname, niche.slug)) {
      if (pathname === destination) {
        return continueWithLocale(req, supabaseResponse, nicheLocale);
      }
      return rewriteToPath(req, supabaseResponse, destination, nicheLocale);
    }
  }

  if (pathname === "/immobilien" || pathname.startsWith("/immobilien/")) {
    const rest = pathname.replace(/^\/immobilien/, "") || "";
    return redirectToPath(req, supabaseResponse, withLocale(`/real-estate${rest}`, locale), locale);
  }

  const pathLocale = getLocaleFromPathname(pathname);
  if (pathLocale) {
    const stripped = stripLocaleFromPathname(pathname);
    const localized = localizePublicPath(stripped, pathLocale);
    if (localized !== stripped) {
      const target = localized === "/" ? `/${pathLocale}` : `/${pathLocale}${localized}`;
      return redirectToPath(req, supabaseResponse, target, pathLocale);
    }

    const response = NextResponse.next({ request: req });
    copySessionOntoResponse(supabaseResponse, response);
    return applyLocaleHeaders(response, pathLocale);
  }

  return redirectToPath(req, supabaseResponse, withLocale(pathname, locale), locale);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
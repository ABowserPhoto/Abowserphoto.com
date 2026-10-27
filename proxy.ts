import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  detectLocaleFromHeader,
  getLocaleFromPathname,
  isLocale,
  stripLocaleFromPathname,
  withLocale,
  type Locale,
} from "./lib/i18n/config";
import { localizePublicPath } from "./lib/routes";
import { nicheHostForHostname } from "./lib/subdomains";
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

function resolveLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;
  return detectLocaleFromHeader(req.headers.get("accept-language"));
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
  const redirect = NextResponse.redirect(redirectUrl, 308);
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

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = (req.headers.get("host") || "").split(":")[0];

  if (hostname === "aaronbowser-photography.com") {
    const redirectUrl = url.clone();
    redirectUrl.hostname = "www.aaronbowser-photography.com";
    redirectUrl.protocol = "https:";
    redirectUrl.port = "";
    return NextResponse.redirect(redirectUrl, 308);
  }

  const supabaseResponse = await updateSession(req);
  const pathname = normalizePathname(url.pathname);

  if (isSkippedPath(pathname)) {
    return supabaseResponse;
  }

  const legacyGerman = pathname.toLowerCase();
  if (
    legacyGerman === "/deutsch" ||
    legacyGerman === "/deutsch/index" ||
    legacyGerman === "/deutsch/index.html"
  ) {
    return redirectToPath(req, supabaseResponse, "/de", "de");
  }

  const locale = resolveLocale(req);
  const niche = nicheHostForHostname(hostname);
  if (niche) {
    // A /de or /en prefix (the language switcher) wins over the cookie so the
    // visible locale and the rewritten page stay in sync. The browser URL is
    // left as-is; only the internal path changes.
    const pathLocale = getLocaleFromPathname(pathname);
    const nicheLocale = pathLocale ?? locale;
    const destination = withLocale(niche.basePath, nicheLocale);
    if (pathname === destination) {
      return continueWithLocale(req, supabaseResponse, nicheLocale);
    }
    return rewriteToPath(req, supabaseResponse, destination, nicheLocale);
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

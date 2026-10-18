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

function redirectToLocalized(
  req: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
  locale: Locale
) {
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = withLocale(pathname, locale);
  const redirect = NextResponse.redirect(redirectUrl);
  return applyLocaleHeaders(copySessionOntoResponse(supabaseResponse, redirect), locale);
}

export async function proxy(req: NextRequest) {
  const supabaseResponse = await updateSession(req);
  const url = req.nextUrl;
  const pathname = url.pathname;
  const hostname = req.headers.get("host") || "";

  if (isSkippedPath(pathname)) {
    return supabaseResponse;
  }

  const locale = resolveLocale(req);

  if (hostname.startsWith("immo.")) {
    return redirectToLocalized(req, supabaseResponse, "/real-estate", locale);
  }
  if (hostname.startsWith("food.")) {
    return redirectToLocalized(req, supabaseResponse, "/food", locale);
  }
  if (hostname.startsWith("wedding.")) {
    return redirectToLocalized(req, supabaseResponse, "/wedding", locale);
  }

  if (pathname === "/immobilien" || pathname.startsWith("/immobilien/")) {
    const rest = pathname.replace(/^\/immobilien/, "") || "";
    return redirectToLocalized(req, supabaseResponse, `/real-estate${rest}`, locale);
  }

  const pathLocale = getLocaleFromPathname(pathname);
  if (pathLocale) {
    const response = NextResponse.next({ request: req });
    copySessionOntoResponse(supabaseResponse, response);
    return applyLocaleHeaders(response, pathLocale);
  }

  return redirectToLocalized(
    req,
    supabaseResponse,
    stripLocaleFromPathname(pathname),
    locale
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};

import { NextResponse, type NextRequest } from "next/server";
import { copySessionOntoResponse, updateSession } from "./lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const supabaseResponse = await updateSession(req);
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  function rewriteWithSession(pathname: string) {
    const rewriteUrl = new URL(`${pathname}${url.search}`, req.url);
    const rewrite = NextResponse.rewrite(rewriteUrl);
    return copySessionOntoResponse(supabaseResponse, rewrite);
  }

  if (hostname.startsWith("immo.")) {
    return rewriteWithSession(`/immo${url.pathname}`);
  }

  if (hostname.startsWith("food.")) {
    return rewriteWithSession(`/food${url.pathname}`);
  }

  if (hostname.startsWith("wedding.")) {
    return rewriteWithSession(`/wedding${url.pathname}`);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|commercial).*)"],
};

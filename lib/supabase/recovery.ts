import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPasswordResetPath } from "../passwordReset";
import { getSupabasePublishableKey, getSupabaseUrl, isSupabaseConfigured } from "./env";
import { copySessionOntoResponse } from "./middleware";

/**
 * Recovery emails land on `/<locale>/reset-password?code=...` on the host that
 * requested the email. Exchange the PKCE code here, where the session cookie
 * can be written, then redirect to that same URL without the code.
 */
export async function redirectAfterRecoveryExchange(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code || !isPasswordResetPath(request.nextUrl.pathname)) return null;

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.searchParams.delete("code");
  redirectUrl.searchParams.delete("error_description");
  redirectUrl.searchParams.delete("error_code");

  if (!isSupabaseConfigured()) {
    redirectUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
      },
    },
  });

  let failed = false;
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = Boolean(error);
    if (error) console.error("Password recovery code exchange failed.");
  } catch {
    console.error("Password recovery code exchange failed.");
    failed = true;
  }

  if (failed) {
    redirectUrl.searchParams.set("error", "invalid");
    redirectUrl.searchParams.delete("recovery");
  } else {
    redirectUrl.searchParams.delete("error");
    redirectUrl.searchParams.set("recovery", "1");
  }

  return copySessionOntoResponse(supabaseResponse, NextResponse.redirect(redirectUrl));
}

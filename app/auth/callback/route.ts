import { NextResponse } from "next/server";
import { BOOKING_QUERY_KEY, BOOKING_QUERY_VALUE } from "../../../lib/booking";
import { createClient } from "../../../lib/supabase/server";

function safeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = new URL(next, requestUrl.origin);
      redirectUrl.searchParams.set(BOOKING_QUERY_KEY, BOOKING_QUERY_VALUE);
      return NextResponse.redirect(redirectUrl);
    }
  }

  const fallback = new URL("/", requestUrl.origin);
  fallback.searchParams.set(BOOKING_QUERY_KEY, BOOKING_QUERY_VALUE);
  return NextResponse.redirect(fallback);
}

"use server";

import { isValidBookingDate } from "../lib/booking";
import { queryAvailableTimesForDate } from "../lib/googleCalendar";
import { getAuthCopy, getBookingCopy, resolveLocale } from "../lib/i18n/messages";
import { createClient } from "../lib/supabase/server";

export type GetAvailableTimesResult = {
  success: boolean;
  times: string[];
  message?: string;
};

async function assertApprovedClient(locale?: string | null) {
  const auth = getAuthCopy(locale);
  const booking = getBookingCopy(locale);
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false as const, message: booking.signInToCheck };
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("is_approved")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (clientError) {
    throw new Error(clientError.message);
  }

  if (!client?.is_approved) {
    return {
      ok: false as const,
      message: auth.pendingReviewBooking,
    };
  }

  return { ok: true as const };
}

export async function getAvailableTimes(
  date: string,
  locale?: string | null
): Promise<GetAvailableTimesResult> {
  const resolved = resolveLocale(locale);
  const booking = getBookingCopy(resolved);
  const selectedDate = date.trim();
  if (!isValidBookingDate(selectedDate)) {
    return { success: false, times: [], message: booking.invalidDate };
  }

  try {
    const access = await assertApprovedClient(resolved);
    if (!access.ok) {
      return { success: false, times: [], message: access.message };
    }

    const times = await queryAvailableTimesForDate(selectedDate);
    return { success: true, times: [...times] };
  } catch (error) {
    const message = error instanceof Error ? error.message : booking.calendarUnavailable;
    console.error("Google Calendar free/busy lookup failed:", error);
    return { success: false, times: [], message };
  }
}

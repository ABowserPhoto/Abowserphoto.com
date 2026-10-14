"use server";

import { isValidBookingDate } from "../lib/booking";
import { queryAvailableTimesForDate } from "../lib/googleCalendar";
import { createClient } from "../lib/supabase/server";

export type GetAvailableTimesResult = {
  success: boolean;
  times: string[];
  message?: string;
};

async function assertApprovedClient() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false as const, message: "Please sign in to check availability." };
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
      message: "Your account is currently being reviewed. You will be able to book photoshoots once approved.",
    };
  }

  return { ok: true as const };
}

export async function getAvailableTimes(date: string): Promise<GetAvailableTimesResult> {
  const selectedDate = date.trim();
  if (!isValidBookingDate(selectedDate)) {
    return { success: false, times: [], message: "Please select a valid date." };
  }

  try {
    const access = await assertApprovedClient();
    if (!access.ok) {
      return { success: false, times: [], message: access.message };
    }

    const times = await queryAvailableTimesForDate(selectedDate);
    return { success: true, times: [...times] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not check calendar availability.";
    console.error("Google Calendar free/busy lookup failed:", error);
    return { success: false, times: [], message };
  }
}

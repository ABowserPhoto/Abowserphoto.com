"use server";

import {
  isBookingTimeSlot,
  isValidBookingDate,
  normalizeTime,
  addOneHour,
  resolveInquiryCategoryLabel,
} from "../lib/booking";
import { getCalendarClient, queryAvailableTimesForDate } from "../lib/googleCalendar";
import { getAuthCopy, getBookingCopy, resolveLocale } from "../lib/i18n/messages";
import { createClient } from "../lib/supabase/server";

export type GeneralInquiryFormData = {
  categorySlug: string;
  requestedDate: string;
  requestedTime: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  details: string;
  locale?: string;
};

export type SubmitGeneralInquiryResult = {
  success: boolean;
  message: string;
};

function sanitizeLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function getApprovedClient(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const { data, error } = await supabase
    .from("clients")
    .select("company_name, is_approved")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function createInquiryEvent(
  data: GeneralInquiryFormData,
  categoryLabel: string,
  companyName: string
) {
  const { calendar, calendarId, timeZone } = getCalendarClient();
  const startTime = normalizeTime(data.requestedTime);
  const endTime = addOneHour(data.requestedTime);

  try {
    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `${categoryLabel} Inquiry - ${companyName}`,
        description: [
          `Contact Name: ${data.contactName}`,
          `Contact Email Address: ${data.contactEmail}`,
          `Contact Phone Number: ${data.contactPhone}`,
          "",
          "Details of the Photoshoot:",
          data.details,
        ].join("\n"),
        start: {
          dateTime: `${data.requestedDate}T${startTime}`,
          timeZone,
        },
        end: {
          dateTime: `${data.requestedDate}T${endTime}`,
          timeZone,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}

export async function submitGeneralInquiry(
  data: GeneralInquiryFormData
): Promise<SubmitGeneralInquiryResult> {
  const locale = resolveLocale(data.locale);
  const auth = getAuthCopy(locale);
  const booking = getBookingCopy(locale);
  const categoryLabel = resolveInquiryCategoryLabel(data.categorySlug);
  const requestedDate = data.requestedDate.trim();
  const requestedTime = data.requestedTime.trim();
  const contactName = sanitizeLine(data.contactName);
  const contactEmail = sanitizeLine(data.contactEmail);
  const contactPhone = sanitizeLine(data.contactPhone);
  const details = (data.details ?? "").replace(/\r\n/g, "\n").trim().slice(0, 4000);

  if (
    !categoryLabel ||
    !isValidBookingDate(requestedDate) ||
    !isBookingTimeSlot(requestedTime) ||
    !contactName ||
    !contactEmail ||
    !contactPhone ||
    !details
  ) {
    return { success: false, message: booking.completeFields };
  }

  if (!isValidEmail(contactEmail)) {
    return { success: false, message: booking.validEmail };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, message: booking.signInToInquire };
  }

  const client = await getApprovedClient(supabase, userData.user.id);
  if (!client || !client.is_approved) {
    return {
      success: false,
      message: auth.pendingReviewBooking,
    };
  }

  try {
    const availableTimes = await queryAvailableTimesForDate(requestedDate);
    if (!availableTimes.includes(requestedTime)) {
      return {
        success: false,
        message: booking.timeUnavailable,
      };
    }

    await createInquiryEvent(
      {
        categorySlug: data.categorySlug,
        requestedDate,
        requestedTime,
        contactName,
        contactEmail,
        contactPhone,
        details,
      },
      categoryLabel,
      sanitizeLine(client.company_name)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : booking.calendarEventFailed;
    console.error("Google Calendar inquiry sync failed:", error);
    return { success: false, message };
  }

  return {
    success: true,
    message: booking.inquirySuccess,
  };
}

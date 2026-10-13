"use server";

import { google } from "googleapis";
import { extractCity, isPropertyStatus, type PropertyStatus } from "../lib/booking";
import { createClient } from "../lib/supabase/server";

export type BookingFormData = {
  locationAddress: string;
  requestedDate: string;
  requestedTime: string;
  propertyStatus: PropertyStatus;
  contactName: string;
  contactNumber: string;
  contactEmail: string;
};

export type SubmitBookingResult = {
  success: boolean;
  message: string;
};

type ClientRecord = {
  company_name: string;
  is_approved: boolean;
};

function normalizeTime(value: string) {
  const [hours = "00", minutes = "00"] = value.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
}

function addOneHour(value: string) {
  const [hours = "0", minutes = "00"] = value.split(":");
  const nextHour = (Number(hours) + 1) % 24;
  return `${String(nextHour).padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
}

function getPrivateKey() {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key || key.includes("...")) return undefined;
  return key.replace(/\\n/g, "\n");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function getApprovedClient(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ClientRecord | null> {
  const { data: existingByUser, error: userLookupError } = await supabase
    .from("clients")
    .select("company_name, is_approved")
    .eq("user_id", userId)
    .maybeSingle();

  if (userLookupError) {
    throw new Error(userLookupError.message);
  }

  return existingByUser;
}

async function createCalendarEvent(data: BookingFormData, companyName: string) {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const timeZone = process.env.BOOKING_TIMEZONE ?? "Europe/Berlin";

  if (
    !clientEmail ||
    !privateKey ||
    !calendarId ||
    clientEmail.includes("your-service-account") ||
    calendarId.includes("your-calendar-id")
  ) {
    throw new Error(
      "Google Calendar is not configured. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_CALENDAR_ID."
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });
  const startTime = normalizeTime(data.requestedTime);
  const endTime = addOneHour(data.requestedTime);
  const city = extractCity(data.locationAddress);

  try {
    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Immobilien - ${companyName} - ${city}`,
        location: data.locationAddress,
        description: [
          `Property Status: ${data.propertyStatus}`,
          `Contact Name: ${data.contactName}`,
          `Contact Number: ${data.contactNumber}`,
          `Contact Email Address: ${data.contactEmail}`,
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

export async function submitBooking(data: BookingFormData): Promise<SubmitBookingResult> {
  const locationAddress = data.locationAddress.trim();
  const requestedDate = data.requestedDate.trim();
  const requestedTime = data.requestedTime.trim();
  const propertyStatus = data.propertyStatus;
  const contactName = data.contactName.trim();
  const contactNumber = data.contactNumber.trim();
  const contactEmail = data.contactEmail.trim();

  if (
    !locationAddress ||
    !requestedDate ||
    !requestedTime ||
    !isPropertyStatus(propertyStatus) ||
    !contactName ||
    !contactNumber ||
    !contactEmail
  ) {
    return { success: false, message: "Please complete all required fields." };
  }

  if (!isValidEmail(contactEmail)) {
    return { success: false, message: "Please enter a valid contact email address." };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, message: "Please sign in to submit a booking request." };
  }

  const client = await getApprovedClient(supabase, userData.user.id);
  if (!client || !client.is_approved) {
    return {
      success: false,
      message: "Your account is currently being reviewed. You will be able to book photoshoots once approved.",
    };
  }

  try {
    await createCalendarEvent(
      {
        locationAddress,
        requestedDate,
        requestedTime,
        propertyStatus,
        contactName,
        contactNumber,
        contactEmail,
      },
      client.company_name
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not create the calendar event.";
    console.error("Google Calendar sync failed:", error);
    return { success: false, message };
  }

  return {
    success: true,
    message: "Your request has been received. We will review your details and be in touch shortly.",
  };
}

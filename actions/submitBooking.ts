"use server";

import {
  addOneHour,
  extractCity,
  getPhotoPackageLabel,
  isBookingTimeSlot,
  isPhotoPackage,
  isPropertyStatus,
  normalizeTime,
  parseBookingServices,
  type BookingService,
  type PhotoPackage,
  type PropertyStatus,
} from "../lib/booking";
import { getCalendarClient, queryAvailableTimesForDate } from "../lib/googleCalendar";
import { createClient } from "../lib/supabase/server";

export type BookingFormData = {
  locationAddress: string;
  requestedDate: string;
  requestedTime: string;
  propertyStatus: PropertyStatus;
  contactName: string;
  contactNumber: string;
  contactEmail: string;
  services: BookingService[];
  photoPackage: PhotoPackage;
  additionalDetails?: string;
};

export type SubmitBookingResult = {
  success: boolean;
  message: string;
};

type ClientRecord = {
  company_name: string;
  is_approved: boolean;
};

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
  const { calendar, calendarId, timeZone } = getCalendarClient();
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
          `Services: ${data.services.join(", ")}`,
          `Photo Package: ${getPhotoPackageLabel(data.photoPackage)}`,
          `Additional Details: ${data.additionalDetails?.trim() || "None"}`,
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
  const services = parseBookingServices(data.services ?? []);
  const photoPackage = data.photoPackage;
  const additionalDetails = (data.additionalDetails ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2000);

  if (
    !locationAddress ||
    !requestedDate ||
    !requestedTime ||
    !isPropertyStatus(propertyStatus) ||
    !contactName ||
    !contactNumber ||
    !contactEmail ||
    services.length === 0 ||
    !isPhotoPackage(photoPackage) ||
    !isBookingTimeSlot(requestedTime)
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
    const availableTimes = await queryAvailableTimesForDate(requestedDate);
    if (!availableTimes.includes(requestedTime)) {
      return {
        success: false,
        message: "That time is no longer available. Please choose another slot.",
      };
    }

    await createCalendarEvent(
      {
        locationAddress,
        requestedDate,
        requestedTime,
        propertyStatus,
        contactName,
        contactNumber,
        contactEmail,
        services,
        photoPackage,
        additionalDetails,
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

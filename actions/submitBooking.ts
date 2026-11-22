"use server";

import {
  isBookingTimeSlot,
  isPropertyStatus,
  parseBookingServices,
  resolvePhotoChoice,
  type BookingService,
  type IndividualPhotoCount,
  type PhotoPackage,
  type PropertyStatus,
} from "../lib/booking";
import { bookingFailureMessage, placeShootRequest } from "../lib/bookingRequests";
import { getAuthCopy, getBookingCopy, resolveLocale } from "../lib/i18n/messages";
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
  photoPackage: PhotoPackage | null;
  individualPhotoCount: IndividualPhotoCount | null;
  additionalDetails?: string;
  locale?: string;
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

export async function submitBooking(data: BookingFormData): Promise<SubmitBookingResult> {
  const locale = resolveLocale(data.locale);
  const auth = getAuthCopy(locale);
  const booking = getBookingCopy(locale);
  const locationAddress = data.locationAddress.trim();
  const requestedDate = data.requestedDate.trim();
  const requestedTime = data.requestedTime.trim();
  const propertyStatus = data.propertyStatus;
  const contactName = data.contactName.trim();
  const contactNumber = data.contactNumber.trim();
  const contactEmail = data.contactEmail.trim();
  const services = parseBookingServices(data.services ?? []);
  const photoChoice = resolvePhotoChoice(data.photoPackage, data.individualPhotoCount);
  const additionalDetails = (data.additionalDetails ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2000);

  if (!photoChoice) {
    return { success: false, message: booking.selectPhotoPackageError };
  }

  if (
    !locationAddress ||
    !requestedDate ||
    !requestedTime ||
    !isPropertyStatus(propertyStatus) ||
    !contactName ||
    !contactNumber ||
    !contactEmail ||
    services.length === 0 ||
    !isBookingTimeSlot(requestedTime)
  ) {
    return { success: false, message: booking.completeFields };
  }

  if (!isValidEmail(contactEmail)) {
    return { success: false, message: booking.validEmail };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, message: booking.signInToSubmit };
  }

  const client = await getApprovedClient(supabase, userData.user.id);
  if (!client || !client.is_approved) {
    return {
      success: false,
      message: auth.pendingReviewBooking,
    };
  }

  try {
    await placeShootRequest({
      kind: "immobilien",
      locale,
      userId: userData.user.id,
      companyName: client.company_name,
      contactName,
      contactEmail,
      accountEmail: userData.user.email ?? null,
      contactPhone: contactNumber,
      requestedDate,
      requestedTime,
      notes: additionalDetails,
      locationAddress,
      propertyStatus,
      services,
      photoPackage: photoChoice.photoPackage,
      individualPhotoCount: photoChoice.individualPhotoCount,
    });
  } catch (error) {
    return { success: false, message: bookingFailureMessage(error, booking) };
  }

  return {
    success: true,
    message: booking.success,
  };
}

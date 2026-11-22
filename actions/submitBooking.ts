"use server";

import {
  isBookingTimeSlot,
  isPropertyStatus,
  resolveImmobilienSelection,
  type BookingService,
  type IndividualPhotoCount,
  type PhotoPackage,
  type PropertyStatus,
} from "../lib/booking";
import { bookingFailureMessage, placeShootRequest } from "../lib/bookingRequests";
import { buildPriceSnapshot, loadOwnPriceCatalog, type PriceSnapshot } from "../lib/clientPricing";
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
  offer: string;
  highlightRoom?: string;
  homestagingPhotoCount?: number | null;
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
  const selection = resolveImmobilienSelection({
    offer: data.offer ?? "",
    services: data.services ?? [],
    photoPackage: data.photoPackage,
    individualPhotoCount: data.individualPhotoCount,
    highlightRoom: data.highlightRoom ?? "",
    homestagingPhotoCount: data.homestagingPhotoCount ?? null,
  });
  const additionalDetails = (data.additionalDetails ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2000);

  if (
    !locationAddress ||
    !requestedDate ||
    !requestedTime ||
    !isPropertyStatus(propertyStatus) ||
    !contactName ||
    !contactNumber ||
    !contactEmail ||
    !isBookingTimeSlot(requestedTime)
  ) {
    return { success: false, message: booking.completeFields };
  }

  if (!selection.ok) {
    switch (selection.reason) {
      case "offer":
        return { success: false, message: booking.selectOffer };
      case "services":
        return { success: false, message: booking.selectAtLeastOneService };
      case "photos":
        return { success: false, message: booking.selectPhotoPackageError };
      case "bundle-photos":
        return { success: false, message: booking.selectBundlePhotoPackage };
      case "homestaging":
        return { success: false, message: booking.selectHomestagingCount };
      default: {
        const neverReason: never = selection.reason;
        return { success: false, message: neverReason };
      }
    }
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

  const prices = await loadOwnPriceCatalog(supabase);
  let priceSnapshot: PriceSnapshot | null;
  switch (prices.status) {
    case "hidden":
      priceSnapshot = null;
      break;
    case "ready":
      priceSnapshot = buildPriceSnapshot(prices.catalog, selection.selection);
      break;
    case "error":
      console.error("Client price catalog could not be loaded.");
      return { success: false, message: booking.saveFailed };
    default: {
      const neverPrices: never = prices;
      console.error("Unhandled price catalog status:", neverPrices);
      return { success: false, message: booking.saveFailed };
    }
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
      services: selection.selection.services,
      photoPackage: selection.selection.photoPackage,
      individualPhotoCount: selection.selection.individualPhotoCount,
      bundle: selection.selection.bundle,
      highlightRoom: selection.selection.highlightRoom,
      homestagingPhotoCount: selection.selection.homestagingPhotoCount,
      priceSnapshot,
    });
  } catch (error) {
    return { success: false, message: bookingFailureMessage(error, booking) };
  }

  return {
    success: true,
    message: booking.success,
  };
}

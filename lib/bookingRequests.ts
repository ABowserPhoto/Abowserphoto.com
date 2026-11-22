import { createApprovalToken, hashApprovalToken, isApprovalToken } from "./approvalToken";
import {
  extractCity,
  normalizeTime,
  resolveInquiryCategoryLabel,
  type BookingBundle,
  type BookingService,
  type IndividualPhotoCount,
  type PhotoPackage,
  type PropertyStatus,
} from "./booking";
import {
  adminDetailRows,
  bundleDetailRows,
  bundleFromRow,
  highlightRoomFromRow,
  isShootKind,
  isShootStatus,
  keepLines,
  individualPhotoCountFromRow,
  photoChoiceRows,
  photoPackageFromRow,
  propertyStatusFromRow,
  requestPriceSnapshot,
  safeHttpUrl,
  serviceLabel,
  servicesFromRow,
  singleLine,
  type RequestDetails,
  type ShootKind,
} from "./bookingDetails";
import type { DecisionAction, DecisionPageModel } from "./bookingDecisionPage";
import {
  confirmBookingCalendarEvent,
  deleteBookingCalendarEvent,
  getCalendarTimezone,
  insertBookingCalendarEvent,
  isMissingCalendarEvent,
  queryAvailableTimesForDate,
} from "./googleCalendar";
import { priceSnapshotToJson, type PriceSnapshot } from "./clientPricing";
import type { Locale } from "./i18n/config";
import { getBookingCopy, resolveLocale } from "./i18n/messages";
import { sendShootDecisionEmail, sendShootRequestEmails } from "./mail";
import type { Database } from "./database.types";
import { createServiceClient } from "./supabase/admin";
import { getSupabaseUrl } from "./supabase/env";

type BookingRequestRow = Database["public"]["Tables"]["booking_requests"]["Row"];

type SharedPlace = {
  locale: Locale;
  userId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  accountEmail: string | null;
  contactPhone: string;
  requestedDate: string;
  requestedTime: string;
  notes: string;
};

export type PlaceShootRequestInput =
  | (SharedPlace & {
      kind: "immobilien";
      locationAddress: string;
      propertyStatus: PropertyStatus;
      services: BookingService[];
      photoPackage: PhotoPackage | null;
      individualPhotoCount: IndividualPhotoCount | null;
      bundle: BookingBundle | null;
      highlightRoom: string | null;
      priceSnapshot: PriceSnapshot | null;
    })
  | (SharedPlace & {
      kind: "inquiry";
      categorySlug: string;
    });

export class BookingRequestError extends Error {
  readonly code: "unavailable" | "calendar" | "save";

  constructor(code: "unavailable" | "calendar" | "save") {
    super(code);
    this.name = "BookingRequestError";
    this.code = code;
  }
}

export function bookingFailureMessage(
  error: unknown,
  booking: { timeUnavailable: string; calendarEventFailed: string; saveFailed: string }
) {
  if (error instanceof BookingRequestError) {
    switch (error.code) {
      case "unavailable":
        return booking.timeUnavailable;
      case "calendar":
        return booking.calendarEventFailed;
      case "save":
        return booking.saveFailed;
      default: {
        const neverCode: never = error.code;
        console.error("Unhandled booking error:", neverCode);
        return booking.calendarEventFailed;
      }
    }
  }

  console.error("Booking request failed:", error instanceof Error ? error.message : "request failed");
  return booking.calendarEventFailed;
}

function failureText(error: unknown) {
  return error instanceof Error ? error.message : "request failed";
}

function calendarDescription(details: RequestDetails, pending: boolean) {
  const copy = getBookingCopy("de");
  const lines = [
    pending ? "Pending request. Not confirmed." : "Confirmed booking.",
    `Service: ${serviceLabel(details, "de")}`,
    `Company: ${details.companyName}`,
    `Contact: ${details.contactName}`,
    `Email: ${details.contactEmail}`,
    `Phone: ${details.contactPhone}`,
  ];
  if (details.address) lines.push(`Address: ${details.address}`);
  if (details.propertyStatus) lines.push(`Property status: ${copy.propertyStatuses[details.propertyStatus]}`);
  for (const row of [...bundleDetailRows(details, "de"), ...photoChoiceRows(details, "de")]) {
    lines.push(`${row.label}: ${row.value}`);
  }
  if (details.notes) lines.push("", "Notes:", details.notes);
  return lines.join("\n");
}

function eventSummary(input: PlaceShootRequestInput, company: string) {
  switch (input.kind) {
    case "immobilien":
      return `Immobilien - ${company} - ${extractCity(input.locationAddress) || company}`;
    case "inquiry":
      return `${resolveInquiryCategoryLabel(input.categorySlug) ?? "General"} Inquiry - ${company}`;
    default: {
      const neverInput: never = input;
      throw new Error(`Unexpected booking request: ${String(neverInput)}`);
    }
  }
}

function detailsFromInput(input: PlaceShootRequestInput, timeZone: string): RequestDetails {
  const companyName = singleLine(input.companyName) || singleLine(input.contactName);
  const shared = {
    locale: input.locale,
    companyName,
    contactName: singleLine(input.contactName),
    contactEmail: singleLine(input.contactEmail),
    contactPhone: singleLine(input.contactPhone),
    accountEmail: input.accountEmail ? singleLine(input.accountEmail) : null,
    notes: keepLines(input.notes) || null,
    requestedDate: input.requestedDate,
    requestedTime: input.requestedTime,
    timeZone,
    calendarUrl: null,
    priceSnapshot: input.kind === "immobilien" ? input.priceSnapshot : null,
  };

  switch (input.kind) {
    case "immobilien":
      return {
        ...shared,
        kind: "immobilien",
        address: singleLine(input.locationAddress, 500),
        propertyStatus: input.propertyStatus,
        services: input.services,
        photoPackage: input.photoPackage,
        individualPhotoCount: input.individualPhotoCount,
        bundle: input.bundle,
        highlightRoom: input.highlightRoom,
        categorySlug: null,
      };
    case "inquiry":
      return {
        ...shared,
        kind: "inquiry",
        address: null,
        propertyStatus: null,
        services: [],
        photoPackage: null,
        individualPhotoCount: null,
        bundle: null,
        highlightRoom: null,
        categorySlug: input.categorySlug,
      };
    default: {
      const neverInput: never = input;
      throw new Error(`Unexpected booking request: ${String(neverInput)}`);
    }
  }
}

function detailsFromRow(row: BookingRequestRow): RequestDetails {
  const kind: ShootKind = isShootKind(row.kind) ? row.kind : "inquiry";
  return {
    kind,
    locale: resolveLocale(row.locale),
    companyName: row.company_name,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    accountEmail: row.account_email,
    address: row.location_address,
    propertyStatus: propertyStatusFromRow(row.property_status),
    services: servicesFromRow(row.services),
    photoPackage: photoPackageFromRow(row.photo_package),
    individualPhotoCount: individualPhotoCountFromRow(row.individual_photo_count),
    bundle: bundleFromRow(row.bundle),
    highlightRoom: highlightRoomFromRow(row.highlight_room),
    categorySlug: row.category_slug,
    notes: row.notes,
    requestedDate: row.requested_date,
    requestedTime: row.requested_time,
    timeZone: row.time_zone,
    calendarUrl: safeHttpUrl(row.calendar_html_link),
    priceSnapshot: requestPriceSnapshot(row.price_snapshot),
  };
}

function isSlotConflict(error: { code?: string; message?: string; details?: string }) {
  const text = `${error.message ?? ""} ${error.details ?? ""}`;
  return error.code === "23505" && text.includes("booking_requests_one_active_slot_idx");
}

async function removeTentative(eventId: string) {
  try {
    await deleteBookingCalendarEvent(eventId);
  } catch (error) {
    console.error("Tentative calendar event could not be removed after a failed save:", failureText(error));
  }
}

async function insertPendingRequest(input: {
  place: PlaceShootRequestInput;
  details: RequestDetails;
  summary: string;
  timeZone: string;
  calendarEventId: string;
  calendarHtmlLink: string | null;
}) {
  const { token, hash } = createApprovalToken();
  const supabase = createServiceClient();
  const { error } = await supabase.from("booking_requests").insert({
    user_id: input.place.userId,
    kind: input.details.kind,
    status: "pending",
    approval_token_hash: hash,
    locale: input.details.locale,
    company_name: input.details.companyName,
    contact_name: input.details.contactName,
    contact_email: input.details.contactEmail,
    contact_phone: input.details.contactPhone,
    account_email: input.details.accountEmail,
    location_address: input.details.address,
    property_status: input.details.propertyStatus,
    services: input.details.services,
    photo_package: input.details.photoPackage,
    individual_photo_count: input.details.individualPhotoCount,
    bundle: input.details.bundle,
    highlight_room: input.details.highlightRoom,
    category_slug: input.details.categorySlug,
    notes: input.details.notes,
    requested_date: input.details.requestedDate,
    requested_time: normalizeTime(input.details.requestedTime),
    time_zone: timeZoneOf(input.timeZone),
    event_summary: input.summary,
    calendar_event_id: input.calendarEventId,
    calendar_html_link: input.calendarHtmlLink,
    price_snapshot: priceSnapshotToJson(input.details.priceSnapshot),
  });

  if (error) {
    if (isSlotConflict(error)) throw new BookingRequestError("unavailable");
    console.error("Booking request save failed.", error.code);
    throw new BookingRequestError("save");
  }

  return token;
}

function timeZoneOf(value: string) {
  return value || "Europe/Berlin";
}

export async function placeShootRequest(input: PlaceShootRequestInput) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !getSupabaseUrl()) {
    console.error("Booking request was not saved: Supabase service role is not configured.");
    throw new BookingRequestError("save");
  }

  let eventId: string | null = null;
  try {
    let available: readonly string[];
    try {
      available = await queryAvailableTimesForDate(input.requestedDate);
    } catch (error) {
      console.error("Booking availability lookup failed:", failureText(error));
      throw new BookingRequestError("calendar");
    }

    if (!available.includes(input.requestedTime)) {
      throw new BookingRequestError("unavailable");
    }

    const timeZone = getCalendarTimezone();
    const details = detailsFromInput(input, timeZone);
    const summary = eventSummary(input, details.companyName);
    let created;
    try {
      created = await insertBookingCalendarEvent({
        summary,
        description: calendarDescription(details, true),
        location: details.address ?? undefined,
        date: input.requestedDate,
        time: input.requestedTime,
        timeZone,
        status: "tentative",
      });
    } catch (error) {
      console.error("Tentative calendar event failed:", failureText(error));
      throw new BookingRequestError("calendar");
    }

    eventId = created.id;
    const token = await insertPendingRequest({
      place: input,
      details,
      summary,
      timeZone,
      calendarEventId: created.id,
      calendarHtmlLink: safeHttpUrl(created.htmlLink),
    });
    eventId = null;

    try {
      await sendShootRequestEmails({ ...details, calendarUrl: safeHttpUrl(created.htmlLink) }, token);
    } catch (error) {
      console.error("Booking request emails failed:", failureText(error));
    }
  } catch (error) {
    if (eventId) await removeTentative(eventId);
    if (error instanceof BookingRequestError) throw error;
    console.error("Booking request failed:", failureText(error));
    throw new BookingRequestError("save");
  }
}

async function loadByToken(token: string) {
  if (!isApprovalToken(token)) return null;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("approval_token_hash", hashApprovalToken(token))
    .maybeSingle();

  if (error) {
    console.error("Booking request lookup failed.", error.code);
    throw new Error("Booking request lookup failed.");
  }

  return data;
}

function pageForStatus(row: BookingRequestRow, token: string | null, action: DecisionAction): DecisionPageModel {
  const rows = adminDetailRows(detailsFromRow(row));
  if (!isShootStatus(row.status)) return { state: "failed", rows };

  switch (row.status) {
    case "pending":
      if (!token) return { state: "failed", rows };
      return { state: "confirm", action, token, rows };
    case "confirmed":
    case "declined":
      return { state: "already", status: row.status, rows };
    default: {
      const neverStatus: never = row.status;
      console.error("Unexpected booking status:", neverStatus);
      return { state: "failed", rows };
    }
  }
}

export async function previewShootDecision(action: DecisionAction, token: string): Promise<DecisionPageModel> {
  const row = await loadByToken(token);
  if (!row) return { state: "invalid" };
  return pageForStatus(row, token, action);
}

async function claimRequest(id: string, status: "confirmed" | "declined") {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("booking_requests")
    .update({ status, decided_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Booking decision could not be saved.", error.code);
    throw new Error("Booking decision could not be saved.");
  }

  return data;
}

async function reopenRequest(id: string, status: "confirmed" | "declined") {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("booking_requests")
    .update({ status: "pending", decided_at: null })
    .eq("id", id)
    .eq("status", status);

  if (error) console.error("Booking decision could not be reopened.", error.code);
}

async function finalizeCalendar(row: BookingRequestRow) {
  const details = detailsFromRow(row);
  const description = calendarDescription(details, false);
  if (row.calendar_event_id) {
    try {
      await confirmBookingCalendarEvent(row.calendar_event_id, row.event_summary, description);
      return details.calendarUrl;
    } catch (error) {
      if (!isMissingCalendarEvent(error)) throw error;
      console.error("Tentative calendar event was missing. Creating the confirmed event.");
    }
  }

  const created = await insertBookingCalendarEvent({
    summary: row.event_summary,
    description,
    location: details.address ?? undefined,
    date: details.requestedDate,
    time: details.requestedTime,
    timeZone: details.timeZone,
    status: "confirmed",
  });
  const link = safeHttpUrl(created.htmlLink);
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("booking_requests")
    .update({ calendar_event_id: created.id, calendar_html_link: link })
    .eq("id", row.id);
  if (error) console.error("Confirmed calendar event id could not be stored.", error.code);
  return link;
}

async function releaseCalendar(row: BookingRequestRow) {
  if (!row.calendar_event_id) return;
  await deleteBookingCalendarEvent(row.calendar_event_id);
}

export async function applyShootDecision(action: DecisionAction, token: string): Promise<DecisionPageModel> {
  const existing = await loadByToken(token);
  if (!existing) return { state: "invalid" };
  if (existing.status !== "pending") return pageForStatus(existing, null, action);

  const nextStatus = action === "approve" ? "confirmed" : "declined";
  const claimed = await claimRequest(existing.id, nextStatus);
  if (!claimed) {
    const current = await loadByToken(token);
    if (!current) return { state: "failed", rows: adminDetailRows(detailsFromRow(existing)) };
    return pageForStatus(current, null, action);
  }

  const details = detailsFromRow(claimed);
  try {
    switch (action) {
      case "approve":
        details.calendarUrl = await finalizeCalendar(claimed);
        break;
      case "decline":
        await releaseCalendar(claimed);
        break;
      default: {
        const neverAction: never = action;
        throw new Error(`Unexpected decision: ${String(neverAction)}`);
      }
    }
  } catch (error) {
    console.error("Booking calendar update failed:", failureText(error));
    await reopenRequest(claimed.id, nextStatus);
    return { state: "failed", rows: adminDetailRows(details) };
  }

  let emailSent = false;
  try {
    emailSent = await sendShootDecisionEmail(details, nextStatus);
  } catch (error) {
    console.error("Client decision email failed:", failureText(error));
  }

  return { state: "completed", action, emailSent, rows: adminDetailRows(details) };
}

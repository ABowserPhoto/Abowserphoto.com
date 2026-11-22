import { google } from "googleapis";
import {
  BOOKING_TIME_SLOTS,
  addCalendarDays,
  addOneHour,
  getSlotRange,
  normalizeTime,
  slotOverlapsBusy,
  zonedDateTimeToUtc,
} from "./booking";

function getPrivateKey() {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key || key.includes("...")) return undefined;
  return key.replace(/\\n/g, "\n");
}

export function getCalendarTimezone() {
  return process.env.BOOKING_TIMEZONE ?? "Europe/Berlin";
}

export function getCalendarClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const timeZone = getCalendarTimezone();

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

  return {
    calendar: google.calendar({ version: "v3", auth }),
    calendarId,
    timeZone,
  };
}

export async function queryAvailableTimesForDate(date: string) {
  const { calendar, calendarId, timeZone } = getCalendarClient();
  const timeMin = zonedDateTimeToUtc(date, "00:00:00", timeZone).toISOString();
  const timeMax = zonedDateTimeToUtc(addCalendarDays(date, 1), "00:00:00", timeZone).toISOString();

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone,
      items: [{ id: calendarId }],
    },
  });

  const calendars = response.data.calendars ?? {};
  const calendarBusy = calendars[calendarId] ?? Object.values(calendars)[0];
  if (calendarBusy?.errors?.length) {
    const reason = calendarBusy.errors.map((error) => error.reason).filter(Boolean).join(", ");
    throw new Error(reason || "Google Calendar free/busy lookup failed.");
  }

  const now = Date.now();
  const busy = (calendarBusy?.busy ?? [])
    .map((block) => ({
      start: block.start ? new Date(block.start) : null,
      end: block.end ? new Date(block.end) : null,
    }))
    .filter((block): block is { start: Date; end: Date } => Boolean(block.start && block.end));

  return BOOKING_TIME_SLOTS.filter((time) => {
    const { start } = getSlotRange(date, time, timeZone);
    if (start.getTime() <= now) return false;
    return !slotOverlapsBusy(date, time, busy, timeZone);
  });
}

/** Pending requests use this prefix and stay opaque, so free/busy keeps the slot held. */
export const REQUEST_EVENT_PREFIX = "ANFRAGE – ";

export type BookingCalendarStatus = "tentative" | "confirmed";

export type BookingCalendarEvent = {
  summary: string;
  description: string;
  location?: string;
  date: string;
  time: string;
  timeZone?: string;
  status: BookingCalendarStatus;
};

export function calendarSummary(summary: string, status: BookingCalendarStatus) {
  const base = summary.startsWith(REQUEST_EVENT_PREFIX)
    ? summary.slice(REQUEST_EVENT_PREFIX.length)
    : summary;
  switch (status) {
    case "tentative":
      return `${REQUEST_EVENT_PREFIX}${base}`;
    case "confirmed":
      return base;
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

export function isMissingCalendarEvent(error: unknown) {
  if (typeof error !== "object" || error === null) return false;
  const record = error as { code?: unknown; status?: unknown; response?: { status?: unknown } };
  const codes = [record.code, record.status, record.response?.status];
  return codes.some((code) => code === 404 || code === 410 || code === "404" || code === "410");
}

export async function insertBookingCalendarEvent(input: BookingCalendarEvent) {
  const { calendar, calendarId, timeZone } = getCalendarClient();
  const zone = input.timeZone || timeZone;
  const startTime = normalizeTime(input.time);
  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: calendarSummary(input.summary, input.status),
      description: input.description,
      ...(input.location ? { location: input.location } : {}),
      status: input.status,
      transparency: "opaque",
      start: { dateTime: `${input.date}T${startTime}`, timeZone: zone },
      end: { dateTime: `${input.date}T${addOneHour(input.time)}`, timeZone: zone },
    },
  });

  const id = response.data.id;
  if (!id) throw new Error("Google Calendar did not return an event id.");
  return { id, htmlLink: response.data.htmlLink ?? null, timeZone: zone };
}

export async function confirmBookingCalendarEvent(eventId: string, summary: string, description: string) {
  const { calendar, calendarId } = getCalendarClient();
  await calendar.events.patch({
    calendarId,
    eventId,
    requestBody: {
      summary: calendarSummary(summary, "confirmed"),
      description,
      status: "confirmed",
      transparency: "opaque",
    },
  });
}

export async function deleteBookingCalendarEvent(eventId: string) {
  const { calendar, calendarId } = getCalendarClient();
  try {
    await calendar.events.delete({ calendarId, eventId });
  } catch (error) {
    if (isMissingCalendarEvent(error)) return;
    throw error;
  }
}

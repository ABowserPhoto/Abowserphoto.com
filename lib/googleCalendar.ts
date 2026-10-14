import { google } from "googleapis";
import {
  BOOKING_TIME_SLOTS,
  addCalendarDays,
  getSlotRange,
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

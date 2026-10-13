export const BOOKING_QUERY_KEY = "book";
export const BOOKING_QUERY_VALUE = "1";
export const BOOKING_HREF = `?${BOOKING_QUERY_KEY}=${BOOKING_QUERY_VALUE}`;
export const BOOKING_OPEN_EVENT = "abowser:open-booking";

export function bookingHref(pathname: string) {
  return `${pathname}?${BOOKING_QUERY_KEY}=${BOOKING_QUERY_VALUE}`;
}

export function requestOpenBooking() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BOOKING_OPEN_EVENT));
  }
}

export const PROPERTY_STATUSES = ["Empty", "Occupied", "Clean", "Messy"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const BOOKING_TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
] as const;

export function isPropertyStatus(value: string): value is PropertyStatus {
  return (PROPERTY_STATUSES as readonly string[]).includes(value);
}

export function extractCity(locationAddress: string) {
  const trimmed = locationAddress.trim().replace(/,+$/, "");
  const lastSegment = (trimmed.split(",").pop() ?? trimmed).trim();
  const zipThenCity = lastSegment.match(/^\d{4,6}\s+(.+)$/);
  if (zipThenCity?.[1]) {
    return zipThenCity[1].trim();
  }

  const words = lastSegment.split(/\s+/).filter(Boolean);
  return words[words.length - 1] || lastSegment;
}

export function isBookingRoute(pathname: string) {
  return pathname === "/book" || pathname === "/booking";
}

export function todayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

import { getLocaleFromPathname, stripLocaleFromPathname } from "./i18n/config";
import { resolveCategorySegment } from "./routes";

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

export const REAL_ESTATE_PATH_SLUGS = new Set(["real-estate", "immobilien", "immobilienfotografie"]);

export const INQUIRY_CATEGORY_LABELS = {
  wedding: "Wedding",
  "business-portraits": "Business Portraits",
  studio: "Application & Passport Photos",
  food: "Food",
  cinematography: "Cinematography",
  "social-media-management": "Social Media Management",
  commercial: "Commercial",
  general: "General",
} as const;

export type InquiryCategorySlug = keyof typeof INQUIRY_CATEGORY_LABELS;

export type InquiryCategory = {
  slug: InquiryCategorySlug;
  label: string;
};

export function getPathSlug(pathname: string) {
  const clean = stripLocaleFromPathname(pathname);
  return clean.split("/").filter(Boolean)[0] ?? "";
}

export function isRealEstateBookingPath(pathname: string) {
  return REAL_ESTATE_PATH_SLUGS.has(getPathSlug(pathname));
}

function isInquiryCategorySlug(value: string): value is InquiryCategorySlug {
  return value in INQUIRY_CATEGORY_LABELS;
}

export function getInquiryCategory(pathname: string): InquiryCategory {
  const resolved = resolveCategorySegment(getPathSlug(pathname));
  const slug = resolved ?? getPathSlug(pathname);
  if (isInquiryCategorySlug(slug) && slug !== "general") {
    return { slug, label: INQUIRY_CATEGORY_LABELS[slug] };
  }

  return { slug: "general", label: "General" };
}

export function resolveInquiryCategoryLabel(slug: string) {
  const cleaned = slug.trim();
  if (!isInquiryCategorySlug(cleaned)) return null;
  return INQUIRY_CATEGORY_LABELS[cleaned];
}

export const PROPERTY_STATUSES = ["Empty", "Occupied", "Clean", "Messy"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const BOOKING_SERVICES = [
  "Interior",
  "Exterior",
  "Drohne",
  "360 Degree Tour",
  "Digital Homestaging",
  "Highlight Video",
] as const;
export type BookingService = (typeof BOOKING_SERVICES)[number];

export const PHOTO_PACKAGES = [
  {
    id: "bis-5-zimmer",
    label: "Bis 5 Zimmer (Min. 10 Fotos) - €129",
  },
  {
    id: "bis-7-zimmer",
    label: "Bis 7 Zimmer (Min. 15 Fotos) - €189",
  },
  {
    id: "bis-10-zimmer",
    label: "Bis 10 Zimmer (Min. 25 Fotos) - €229",
  },
  {
    id: "30-fotos",
    label: "30 Fotos - Preis nach Absprache",
  },
  {
    id: "40-fotos",
    label: "40 Fotos - Preis nach Absprache",
  },
  {
    id: "50-fotos",
    label: "50 Fotos - Preis nach Absprache",
  },
] as const;
export type PhotoPackage = (typeof PHOTO_PACKAGES)[number]["id"];

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
export type BookingTimeSlot = (typeof BOOKING_TIME_SLOTS)[number];
export const BOOKING_SLOT_DURATION_MINUTES = 60;

export function isPropertyStatus(value: string): value is PropertyStatus {
  return (PROPERTY_STATUSES as readonly string[]).includes(value);
}

export function isBookingService(value: string): value is BookingService {
  return (BOOKING_SERVICES as readonly string[]).includes(value);
}

export function isPhotoPackage(value: string): value is PhotoPackage {
  return PHOTO_PACKAGES.some((photoPackage) => photoPackage.id === value);
}

export function getPhotoPackageLabel(value: PhotoPackage) {
  return PHOTO_PACKAGES.find((photoPackage) => photoPackage.id === value)?.label ?? value;
}

export function parseBookingServices(values: string[]): BookingService[] {
  const selected = new Set(values.map((value) => value.trim()).filter(isBookingService));
  return BOOKING_SERVICES.filter((service) => selected.has(service));
}

export function isBookingTimeSlot(value: string): value is BookingTimeSlot {
  return (BOOKING_TIME_SLOTS as readonly string[]).includes(value);
}

export function isValidBookingDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function addCalendarDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return [
    String(next.getUTCFullYear()),
    String(next.getUTCMonth() + 1).padStart(2, "0"),
    String(next.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function normalizeTime(value: string) {
  const [hours = "00", minutes = "00"] = value.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
}

export function addOneHour(value: string) {
  const [hours = "0", minutes = "00"] = value.split(":");
  const nextHour = (Number(hours) + 1) % 24;
  return `${String(nextHour).padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
}

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function zonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }

  let hour = Number(map.hour);
  if (hour === 24) hour = 0;

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour,
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

export function zonedDateTimeToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second = 0] = normalizeTime(time).split(":").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const asZone = zonedParts(new Date(utcGuess), timeZone);
  const asUtcFromZone = Date.UTC(
    asZone.year,
    asZone.month - 1,
    asZone.day,
    asZone.hour,
    asZone.minute,
    asZone.second
  );
  return new Date(utcGuess - (asUtcFromZone - utcGuess));
}

export function getSlotRange(
  date: string,
  time: string,
  timeZone: string,
  durationMinutes = BOOKING_SLOT_DURATION_MINUTES
) {
  const start = zonedDateTimeToUtc(date, time, timeZone);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { start, end };
}

export function slotOverlapsBusy(
  date: string,
  time: string,
  busy: Array<{ start: Date; end: Date }>,
  timeZone: string
) {
  const { start, end } = getSlotRange(date, time, timeZone);
  return busy.some((block) => start < block.end && block.start < end);
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
  const clean = stripLocaleFromPathname(pathname);
  return clean === "/book" || clean === "/booking";
}

export function getLocaleFromBookingPath(pathname: string) {
  return getLocaleFromPathname(pathname);
}

export function todayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

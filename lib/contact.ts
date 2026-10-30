/**
 * Official public contact details for Aaron Bowser Photography.
 * Phone, email, studio addresses, and Hagen opening hours live here.
 * Visible copy and JSON-LD should read these values, not repeat them.
 */

export type ContactLocale = "de" | "en";

/** Public studio mailbox. */
export const CONTACT_EMAIL = "info@aaronbowser-photography.com";

/** Shown in the interface, with spaces. */
export const CONTACT_PHONE_DISPLAY = "+49 179 5392188";

/**
 * E.164 form for `tel:` links and schema.org `telephone`.
 * Same number as `CONTACT_PHONE_DISPLAY`.
 */
export const CONTACT_PHONE_TEL = "+491795392188";

/** @see CONTACT_PHONE_TEL */
export const CONTACT_PHONE_E164 = CONTACT_PHONE_TEL;

export function contactPhoneHref() {
  return `tel:${CONTACT_PHONE_TEL}`;
}

export function contactEmailHref() {
  return `mailto:${CONTACT_EMAIL}`;
}

export type StudioAddress = {
  street: string;
  postalCode: string;
  city: string;
  countryCode: "DE";
};

/** Main studio. */
export const HAGEN_ADDRESS: StudioAddress = {
  street: "Eckeseyer Str. 133",
  postalCode: "58089",
  city: "Hagen",
  countryCode: "DE",
};

/** Larger studio. No public opening hours. */
export const SOLINGEN_ADDRESS: StudioAddress = {
  street: "Merscheider Str. 112",
  postalCode: "42699",
  city: "Solingen",
  countryCode: "DE",
};

export function formatAddressLine(address: Pick<StudioAddress, "street" | "postalCode" | "city">) {
  return `${address.street}, ${address.postalCode} ${address.city}`;
}

export const SCHEMA_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type SchemaDay = (typeof SCHEMA_DAYS)[number];

export type OpeningHoursRange = {
  dayOfWeek: readonly SchemaDay[];
  opens: string;
  closes: string;
};

/** Public counter hours for Studio Hagen. Studio Solingen has none. */
export const HAGEN_OPENING_HOURS: readonly OpeningHoursRange[] = [
  {
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "20:00",
  },
  {
    dayOfWeek: ["Sunday"],
    opens: "09:00",
    closes: "12:00",
  },
];

const DAY_SHORT: Record<ContactLocale, Record<SchemaDay, string>> = {
  de: {
    Monday: "Mo",
    Tuesday: "Di",
    Wednesday: "Mi",
    Thursday: "Do",
    Friday: "Fr",
    Saturday: "Sa",
    Sunday: "So",
  },
  en: {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  },
};

function formatDaySpan(days: readonly SchemaDay[], locale: ContactLocale) {
  const indexes = days.map((day) => SCHEMA_DAYS.indexOf(day));
  const labels = days.map((day) => DAY_SHORT[locale][day]);
  const contiguous =
    labels.length > 1 &&
    indexes.every((index, position) => position === 0 || index === indexes[position - 1] + 1);

  if (contiguous) return `${labels[0]}\u2013${labels[labels.length - 1]}`;
  return labels.join(", ");
}

/** `Mo–Sa 10:00–20:00, So 09:00–12:00` or the English equivalent. */
export function formatHagenOpeningHours(locale: ContactLocale) {
  return HAGEN_OPENING_HOURS.map(
    (range) => `${formatDaySpan(range.dayOfWeek, locale)} ${range.opens}\u2013${range.closes}`
  ).join(", ");
}

export function hagenHoursLine(locale: ContactLocale) {
  const hours = formatHagenOpeningHours(locale);
  return locale === "de" ? `Öffnungszeiten: ${hours}` : `Opening hours: ${hours}`;
}

/** schema.org OpeningHoursSpecification for Studio Hagen only. */
export function hagenOpeningHoursSpecification() {
  return HAGEN_OPENING_HOURS.map((range) => ({
    "@type": "OpeningHoursSpecification" as const,
    dayOfWeek: range.dayOfWeek.length === 1 ? range.dayOfWeek[0] : [...range.dayOfWeek],
    opens: range.opens,
    closes: range.closes,
  }));
}

const APPOINTMENT_ONLY: Record<ContactLocale, string> = {
  de: "Nur nach Vereinbarung",
  en: "By appointment only",
};

/** Standalone label. Pass `sentence: false` for use inside a sentence. */
export function appointmentOnlyLabel(locale: ContactLocale, options?: { sentence?: boolean }) {
  const label = APPOINTMENT_ONLY[locale];
  if (options?.sentence === false) {
    return label.charAt(0).toLowerCase() + label.slice(1);
  }
  return label;
}

const CONTACT_TOKEN_VALUES = {
  hagenStreet: HAGEN_ADDRESS.street,
  solingenStreet: SOLINGEN_ADDRESS.street,
  hagenLine: formatAddressLine(HAGEN_ADDRESS),
  solingenLine: formatAddressLine(SOLINGEN_ADDRESS),
  phone: CONTACT_PHONE_DISPLAY,
  email: CONTACT_EMAIL,
  appointmentDe: APPOINTMENT_ONLY.de,
  appointmentEn: APPOINTMENT_ONLY.en,
  appointmentDeLower: appointmentOnlyLabel("de", { sentence: false }),
  appointmentEnLower: appointmentOnlyLabel("en", { sentence: false }),
} as const;

/** Replaces `{hagenStreet}` and the other contact tokens in stored copy. */
export function fillContactTokens(value: string) {
  return value.replace(
    /\{(hagenStreet|solingenStreet|hagenLine|solingenLine|phone|email|appointmentDe|appointmentEn|appointmentDeLower|appointmentEnLower)\}/g,
    (match, key: keyof typeof CONTACT_TOKEN_VALUES) => CONTACT_TOKEN_VALUES[key] ?? match
  );
}

import {
  addOneHour,
  getIndividualPhotoLabel,
  getPhotoPackageLabel,
  isBookingService,
  isIndividualPhotoCount,
  isPhotoPackage,
  isPropertyStatus,
  normalizeTime,
  zonedDateTimeToUtc,
  type BookingService,
  type IndividualPhotoCount,
  type PhotoPackage,
  type PropertyStatus,
} from "./booking";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "./contact";
import type { Locale } from "./i18n/config";
import { getBookingCopy } from "./i18n/messages";
import { BRAND_NAME } from "./site";

export type ShootKind = "immobilien" | "inquiry";
export type ShootStatus = "pending" | "confirmed" | "declined";

export type RequestDetails = {
  kind: ShootKind;
  locale: Locale;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  accountEmail: string | null;
  address: string | null;
  propertyStatus: PropertyStatus | null;
  services: BookingService[];
  photoPackage: PhotoPackage | null;
  individualPhotoCount: IndividualPhotoCount | null;
  categorySlug: string | null;
  notes: string | null;
  requestedDate: string;
  requestedTime: string;
  timeZone: string;
  calendarUrl: string | null;
};

export type DetailRow = {
  label: string;
  value: string;
};

const INQUIRY_SERVICES: Record<Locale, Record<string, string>> = {
  de: {
    wedding: "Hochzeitsfotografie",
    "business-portraits": "Business-Porträts",
    studio: "Bewerbungsfotos und Passbilder",
    food: "Food-Fotografie",
    cinematography: "Film und Video",
    "social-media-management": "Social Media",
    commercial: "Commercial-Fotografie",
    general: "Allgemeine Anfrage",
  },
  en: {
    wedding: "Wedding photography",
    "business-portraits": "Business portraits",
    studio: "Application and passport photos",
    food: "Food photography",
    cinematography: "Film and video",
    "social-media-management": "Social media",
    commercial: "Commercial photography",
    general: "General inquiry",
  },
};

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function textToHtml(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

export function singleLine(value: string, max = 300) {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function keepLines(value: string, max = 4000) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().slice(0, max);
}

export function safeHttpUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isShootKind(value: string): value is ShootKind {
  return value === "immobilien" || value === "inquiry";
}

export function isShootStatus(value: string): value is ShootStatus {
  return value === "pending" || value === "confirmed" || value === "declined";
}

export function photoPackageName(id: PhotoPackage, locale: Locale) {
  return getPhotoPackageLabel(id, locale).replace(/\s+[—–-]\s+.*$/u, "").trim();
}

export function photoChoiceRows(
  details: Pick<RequestDetails, "photoPackage" | "individualPhotoCount">,
  locale: Locale
): DetailRow[] {
  if (details.photoPackage) {
    return [
      {
        label: locale === "de" ? "Fotopaket" : "Photo package",
        value: photoPackageName(details.photoPackage, locale),
      },
    ];
  }
  if (details.individualPhotoCount) {
    return [
      {
        label: locale === "de" ? "Einzelfotos" : "Individual photos",
        value: getIndividualPhotoLabel(details.individualPhotoCount, locale),
      },
    ];
  }
  return [];
}

export function formatClock(value: string) {
  const [hours = "00", minutes = "00"] = normalizeTime(value).split(":");
  return `${hours}:${minutes}`;
}

export function formatBookingWhen(date: string, time: string, locale: Locale, timeZone: string) {
  const instant = zonedDateTimeToUtc(date, time, timeZone);
  const datePart = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(instant);
  const clock = `${formatClock(time)}\u2013${formatClock(addOneHour(time))}`;
  if (locale === "de") return `${datePart}, ${clock} Uhr (${timeZone})`;
  return `${datePart}, ${clock} (${timeZone})`;
}

export function serviceLabel(details: Pick<RequestDetails, "kind" | "services" | "categorySlug">, locale: Locale) {
  switch (details.kind) {
    case "immobilien": {
      const copy = getBookingCopy(locale);
      const labels = details.services.map((service) => copy.serviceLabels[service] ?? service);
      return labels.join(", ") || (locale === "de" ? "Immobilienfotografie" : "Real estate photography");
    }
    case "inquiry": {
      const names = INQUIRY_SERVICES[locale];
      const slug = details.categorySlug ?? "";
      if (Object.prototype.hasOwnProperty.call(names, slug)) return names[slug] ?? names.general;
      return locale === "de" ? "Allgemeine Anfrage" : "General inquiry";
    }
    default: {
      const neverKind: never = details.kind;
      return neverKind;
    }
  }
}

export function studioContactLines(locale: Locale) {
  if (locale === "de") {
    return [BRAND_NAME, `Telefon: ${CONTACT_PHONE_DISPLAY}`, `E-Mail: ${CONTACT_EMAIL}`];
  }
  return [BRAND_NAME, `Phone: ${CONTACT_PHONE_DISPLAY}`, `Email: ${CONTACT_EMAIL}`];
}

export function adminDetailRows(details: RequestDetails): DetailRow[] {
  const copy = getBookingCopy("de");
  const rows: DetailRow[] = [
    { label: "Art", value: details.kind === "immobilien" ? "Immobilienfotografie" : "Anfrage" },
    { label: "Leistung", value: serviceLabel(details, "de") },
    { label: "Firma", value: details.companyName },
    { label: "Kontakt", value: details.contactName },
    { label: "E-Mail", value: details.contactEmail },
  ];

  if (details.accountEmail && details.accountEmail.toLowerCase() !== details.contactEmail.toLowerCase()) {
    rows.push({ label: "Konto-E-Mail", value: details.accountEmail });
  }

  rows.push({ label: "Telefon", value: details.contactPhone });
  if (details.address) rows.push({ label: "Adresse", value: details.address });
  rows.push({
    label: "Termin",
    value: formatBookingWhen(details.requestedDate, details.requestedTime, "de", details.timeZone),
  });
  rows.push({ label: "Zeitzone", value: details.timeZone });

  if (details.propertyStatus) {
    rows.push({ label: "Objektstatus", value: copy.propertyStatuses[details.propertyStatus] });
  }

  rows.push(...photoChoiceRows(details, "de"));
  if (details.notes) rows.push({ label: "Notizen", value: details.notes });
  if (details.calendarUrl) rows.push({ label: "Kalender", value: details.calendarUrl });
  return rows;
}

export function clientDetailRows(details: RequestDetails): DetailRow[] {
  const locale = details.locale;
  const rows: DetailRow[] = [
    {
      label: locale === "de" ? "Termin" : "Time",
      value: formatBookingWhen(details.requestedDate, details.requestedTime, locale, details.timeZone),
    },
  ];
  if (details.address) rows.push({ label: locale === "de" ? "Adresse" : "Address", value: details.address });
  rows.push({ label: locale === "de" ? "Leistung" : "Service", value: serviceLabel(details, locale) });
  rows.push(...photoChoiceRows(details, locale));
  return rows;
}

export function servicesFromRow(values: string[] | null) {
  return (values ?? []).filter(isBookingService);
}

export function propertyStatusFromRow(value: string | null) {
  return value && isPropertyStatus(value) ? value : null;
}

export function photoPackageFromRow(value: string | null) {
  return value && isPhotoPackage(value) ? value : null;
}

export function individualPhotoCountFromRow(value: number | null) {
  return value != null && isIndividualPhotoCount(value) ? value : null;
}

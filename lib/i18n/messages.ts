import { defaultLocale, isLocale, type Locale } from "./config";
import { getDictionarySync, type Dictionary } from "./getDictionary";

export function resolveLocale(value?: string | null): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

export function getAuthCopy(locale?: string | null): Dictionary["auth"] {
  return getDictionarySync(resolveLocale(locale)).auth;
}

export function getBookingCopy(locale?: string | null): Dictionary["booking"] {
  return getDictionarySync(resolveLocale(locale)).booking;
}

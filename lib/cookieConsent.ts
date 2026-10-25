/** localStorage key written by the cookie banner. */
export const COOKIE_CONSENT_STORAGE_KEY = "cookie-consent";

/** Fired in the same tab after the banner stores a choice. */
export const COOKIE_CONSENT_CHANGE_EVENT = "cookie-consent-change";

export type CookieConsentChoice = "all" | "essential";

export function isCookieConsentChoice(value: string | null): value is CookieConsentChoice {
  return value === "all" || value === "essential";
}

export function readCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return isCookieConsentChoice(value) ? value : null;
  } catch {
    return null;
  }
}

/** Google Analytics runs only after "Alle akzeptieren" (`all`). */
export function hasAnalyticsConsent(choice: CookieConsentChoice | null = readCookieConsent()) {
  return choice === "all";
}

export function writeCookieConsent(choice: CookieConsentChoice) {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, { detail: choice }));
}

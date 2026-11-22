import type { Locale } from "./i18n/config";
import { withLocale } from "./i18n/config";

/** Same minimum the sign-up form already enforces. */
export const MIN_PASSWORD_LENGTH = 6;

export type PasswordIssue = "too-short" | "mismatch";

export function forgotPasswordPath(locale: Locale) {
  return withLocale("/forgot-password", locale);
}

export function resetPasswordPath(locale: Locale) {
  return withLocale("/reset-password", locale);
}

/** Origin of the request host, including a dev port. Niche hosts stay niche hosts. */
export function requestOrigin(host: string) {
  const trimmed = host.trim();
  const hostname = (
    trimmed.startsWith("[") ? trimmed.slice(1, trimmed.indexOf("]")) : trimmed.split(":")[0]
  ).toLowerCase();
  const local =
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1" ||
    hostname === "::1";
  return `${local ? "http" : "https"}://${trimmed}`;
}

/**
 * `redirectTo` for `resetPasswordForEmail`. `origin` is the page origin
 * (`window.location.origin`), never the canonical marketing host.
 */
export function passwordResetRedirectUrl(origin: string, locale: Locale) {
  const base = origin.replace(/\/$/, "");
  return `${base}${resetPasswordPath(locale)}`;
}

export function isPasswordResetPath(pathname: string) {
  return pathname.split("/").filter(Boolean).includes("reset-password");
}

export function passwordIssue(password: string, confirmation: string): PasswordIssue | null {
  if (password.length < MIN_PASSWORD_LENGTH) return "too-short";
  if (password !== confirmation) return "mismatch";
  return null;
}

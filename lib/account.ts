export const ACCOUNT_QUERY_KEY = "account";
export const ACCOUNT_QUERY_VALUE = "1";
export const ACCOUNT_OPEN_EVENT = "abowser:open-account";

export function accountHref(pathname: string) {
  const url = new URL(pathname, "http://local.invalid");
  url.searchParams.set(ACCOUNT_QUERY_KEY, ACCOUNT_QUERY_VALUE);
  return `${url.pathname}?${url.searchParams.toString()}`;
}

export function requestOpenAccount() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ACCOUNT_OPEN_EVENT));
  }
}

export type AccountTab = "profile" | "bookings" | "invoices";

export function isAccountTab(value: string): value is AccountTab {
  return value === "profile" || value === "bookings" || value === "invoices";
}

"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  hasAnalyticsConsent,
  readCookieConsent,
  type CookieConsentChoice,
} from "../lib/cookieConsent";
import { GA_MEASUREMENT_ID } from "../lib/site";

const GA_INIT_ID = "google-analytics";
const GA_SRC_ID = "google-analytics-src";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function disableFlag() {
  return `ga-disable-${GA_MEASUREMENT_ID}`;
}

function analyticsWindow() {
  return window as unknown as Record<string, unknown>;
}

function setAnalyticsDisabled(disabled: boolean) {
  analyticsWindow()[disableFlag()] = disabled;
}

function analyticsAllowed() {
  return hasAnalyticsConsent() && analyticsWindow()[disableFlag()] !== true;
}

function clearGoogleAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim() ?? "")
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  if (names.length === 0) return;

  const host = window.location.hostname;
  const domains = [host];
  if (host.includes(".")) {
    domains.push(`.${host}`);
    const parts = host.split(".");
    if (parts.length >= 2) domains.push(`.${parts.slice(-2).join(".")}`);
  }

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
    }
  }
}

function sendPageView(pagePath: string) {
  if (!analyticsAllowed() || typeof window.gtag !== "function") return false;
  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
  return true;
}

/**
 * Loads the Google tag only after the cookie banner stores "all"
 * ("Alle akzeptieren"). "Nur essenzielle" never loads the tag, and a later
 * switch to essential stops further hits and clears `_ga` cookies.
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const lastHref = useRef<string | null>(null);

  useEffect(() => {
    function apply(choice: CookieConsentChoice | null = readCookieConsent()) {
      const granted = hasAnalyticsConsent(choice);
      setAnalyticsDisabled(!granted);
      if (!granted) {
        lastHref.current = null;
        clearGoogleAnalyticsCookies();
      }
      setEnabled(granted);
    }

    apply();

    function onConsent(event: Event) {
      const detail = (event as CustomEvent<CookieConsentChoice>).detail;
      apply(detail);
    }

    function onStorage(event: StorageEvent) {
      if (event.key !== COOKIE_CONSENT_STORAGE_KEY) return;
      apply();
    }

    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsent);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsent);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const href = window.location.href;
    if (lastHref.current === href) return;
    if (sendPageView(pathname)) lastHref.current = href;
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <>
      <Script id={GA_INIT_ID} strategy="afterInteractive">
        {`
          window['${disableFlag()}'] = window.localStorage.getItem('${COOKIE_CONSENT_STORAGE_KEY}') !== 'all';
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          if (!window['${disableFlag()}']) {
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
          }
        `}
      </Script>
      <Script
        id={GA_SRC_ID}
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          const href = window.location.href;
          if (lastHref.current === href) return;
          if (sendPageView(window.location.pathname)) lastHref.current = href;
        }}
      />
    </>
  );
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  writeCookieConsent,
  type CookieConsentChoice,
} from "../lib/cookieConsent";
import { useDictionary, useLocale } from "../lib/i18n/LocaleProvider";

export default function CookieConsent() {
  const { localizePath } = useLocale();
  const { footer } = useDictionary();
  const banner = footer.cookieBanner;
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    setIsOpen(!saved);
    setIsReady(true);
  }, []);

  useEffect(() => {
    function syncBooking() {
      setBookingOpen(document.documentElement.dataset.bookingOpen === "1");
    }
    syncBooking();
    window.addEventListener("abowser:booking-open", syncBooking);
    return () => window.removeEventListener("abowser:booking-open", syncBooking);
  }, []);

  function handleConsent(choice: CookieConsentChoice) {
    writeCookieConsent(choice);
    setIsOpen(false);
  }

  function reopenBanner() {
    setIsOpen(true);
  }

  if (!isReady) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && !bookingOpen ? (
          <motion.aside
            key="cookie-consent-banner"
            className="fixed inset-x-3 bottom-3 z-[100] mx-auto w-auto max-w-3xl rounded-2xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur-md sm:inset-x-6 sm:p-5"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            role="dialog"
            aria-live="polite"
            aria-label={banner.dialogLabel}
          >
            <h2 className="text-base font-semibold text-[#322B2B]">{banner.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#322B2B]">
              {banner.body}{" "}
              <Link href={localizePath("/cookie-richtlinie")} className="underline underline-offset-2">
                {banner.cookiePolicy}
              </Link>
              {" · "}
              <Link href={localizePath("/datenschutz")} className="underline underline-offset-2">
                {banner.privacyPolicy}
              </Link>
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => handleConsent("all")}
                className="rounded-md bg-[#322B2B] px-4 py-2 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
              >
                {banner.accept}
              </button>
              <button
                type="button"
                onClick={() => handleConsent("essential")}
                className="rounded-md border border-[#322B2B]/25 bg-transparent px-4 py-2 text-sm font-semibold text-[#322B2B] transition-colors duration-300 hover:bg-[#322B2B]/5"
              >
                {banner.essential}
              </button>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={reopenBanner}
        className="fixed bottom-3 left-3 z-[90] rounded-full border border-[#322B2B]/25 bg-white/80 p-2 text-[#322B2B] opacity-50 shadow-sm backdrop-blur transition-opacity duration-300 hover:opacity-90"
        aria-label={banner.reopen}
        title={banner.reopen}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="9" r="1.2" fill="currentColor" />
          <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" />
          <circle cx="14" cy="14.5" r="1.2" fill="currentColor" />
        </svg>
      </button>
    </>
  );
}

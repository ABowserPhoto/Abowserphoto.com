"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type ConsentPreference = "all" | "essential";

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setIsOpen(!saved);
    setIsReady(true);
  }, []);

  function handleConsent(choice: ConsentPreference) {
    window.localStorage.setItem(STORAGE_KEY, choice);
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
        {isOpen ? (
          <motion.aside
            key="cookie-consent-banner"
            className="fixed inset-x-3 bottom-3 z-[100] mx-auto w-auto max-w-3xl rounded-2xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur-md sm:inset-x-6 sm:p-5"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            role="dialog"
            aria-live="polite"
            aria-label="Cookie-Einwilligung"
          >
            <h2 className="text-base font-semibold text-[#322B2B]">Ihre Privatsphäre ist uns wichtig</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#322B2B]">
              Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und den Website-Traffic zu analysieren.
              Details finden Sie in unserer{" "}
              <Link href="/datenschutzerklaerung" className="underline underline-offset-2">
                Datenschutzerklärung
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => handleConsent("all")}
                className="rounded-md bg-[#322B2B] px-4 py-2 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
              >
                Alle akzeptieren
              </button>
              <button
                type="button"
                onClick={() => handleConsent("essential")}
                className="rounded-md border border-[#322B2B]/25 bg-transparent px-4 py-2 text-sm font-semibold text-[#322B2B] transition-colors duration-300 hover:bg-[#322B2B]/5"
              >
                Nur essenzielle
              </button>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={reopenBanner}
        className="fixed bottom-3 left-3 z-[90] rounded-full border border-[#322B2B]/25 bg-white/80 p-2 text-[#322B2B] opacity-50 shadow-sm backdrop-blur transition-opacity duration-300 hover:opacity-90"
        aria-label="Cookie-Einstellungen öffnen"
        title="Cookie-Einstellungen"
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

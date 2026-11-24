"use client";

import { useState, useTransition } from "react";
import { submitGuestEnquiry } from "../actions/submitGuestEnquiry";
import {
  CONTACT_PHONE_DISPLAY,
  contactPhoneHref,
  contactWhatsAppHref,
} from "../lib/contact";
import { useDictionary, useLocale } from "../lib/i18n/LocaleProvider";

type GuestEnquiryProps = {
  topic: string;
  variant?: "light" | "dark";
  /** Hide the account-note line when the parent already prints it. */
  showNote?: boolean;
};

export default function GuestEnquiry({ topic, variant = "light", showNote = true }: GuestEnquiryProps) {
  const { locale } = useLocale();
  const { booking } = useDictionary();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dark = variant === "dark";
  const fieldId = `${variant}-${topic.replace(/\s+/g, "-")}`;
  const labelClass = dark
    ? "mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
    : "mb-2 block text-xs uppercase tracking-[0.14em] text-[#322B2B]/60";
  const inputClass = dark
    ? "w-full rounded-none border border-gray-800 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F4F1ED] outline-none placeholder:text-[#F4F1ED]/40 focus:border-[#F4F1ED]/60"
    : "w-full rounded-none border border-[#322B2B]/15 bg-white px-4 py-3 text-sm text-[#322B2B] outline-none placeholder:text-[#322B2B]/40 focus:border-[#322B2B]/50";
  const linkClass = dark
    ? "underline underline-offset-2 text-[#F4F1ED]"
    : "underline underline-offset-2 text-[#322B2B]";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await submitGuestEnquiry({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        message: String(formData.get("message") ?? ""),
        website: String(formData.get("website") ?? ""),
        topic,
        locale,
      });
      if (result.success) {
        setIsSuccess(true);
        return;
      }
      setErrorMessage(result.message);
    });
  }

  return (
    <div>
      {showNote ? (
        <p className={dark ? "text-sm leading-relaxed text-[#F4F1ED]/80" : "text-sm leading-relaxed text-[#322B2B]/80"}>
          {booking.accountNote}
        </p>
      ) : null}
      <p className={`${showNote ? "mt-4" : ""} text-sm leading-relaxed ${dark ? "text-[#F4F1ED]/80" : "text-[#322B2B]/80"}`}>
        <a href={contactPhoneHref()} className={linkClass}>
          {locale === "de" ? "Anrufen" : "Call"} {CONTACT_PHONE_DISPLAY}
        </a>
        <span aria-hidden> · </span>
        <a href={contactWhatsAppHref()} className={linkClass} target="_blank" rel="noopener noreferrer">
          {booking.whatsapp}
        </a>
      </p>

      {isSuccess ? (
        <p className={`mt-6 text-sm leading-relaxed ${dark ? "text-[#F4F1ED]" : "text-[#322B2B]"}`}>
          {booking.enquirySent}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <p className={`text-xs uppercase tracking-[0.2em] ${dark ? "text-[#F4F1ED]/60" : "text-[#322B2B]/55"}`}>
            {booking.enquireWithoutAccount}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`guest-name-${fieldId}`} className={labelClass}>
                {booking.contactName}
              </label>
              <input id={`guest-name-${fieldId}`} name="name" required autoComplete="name" className={inputClass} />
            </div>
            <div>
              <label htmlFor={`guest-phone-${fieldId}`} className={labelClass}>
                {booking.contactPhone}
              </label>
              <input id={`guest-phone-${fieldId}`} name="phone" required autoComplete="tel" className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor={`guest-email-${fieldId}`} className={labelClass}>
              {booking.contactEmail}
            </label>
            <input
              id={`guest-email-${fieldId}`}
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`guest-message-${fieldId}`} className={labelClass}>
              {booking.yourMessage}
            </label>
            <textarea id={`guest-message-${fieldId}`} name="message" required rows={4} className={inputClass} />
          </div>
          <div className="hidden" aria-hidden>
            <label htmlFor={`guest-website-${fieldId}`}>Website</label>
            <input id={`guest-website-${fieldId}`} name="website" tabIndex={-1} autoComplete="off" />
          </div>
          {errorMessage ? (
            <p className={`text-sm ${dark ? "text-red-300" : "text-red-700"}`} role="alert">
              {errorMessage}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isPending}
            className={
              dark
                ? "rounded-none border border-[#F4F1ED] bg-[#F4F1ED] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                : "rounded-none bg-[#322B2B] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            }
          >
            {isPending ? booking.submitting : booking.sendEnquiry}
          </button>
        </form>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { submitGeneralInquiry } from "../actions/submitGeneralInquiry";
import { todayInputValue, type InquiryCategory } from "../lib/booking";
import { useDictionary, useLocale } from "../lib/i18n/LocaleProvider";
import { createClient } from "../lib/supabase/client";
import { useAvailableTimes } from "../lib/useAvailableTimes";
import DarkSelect from "./DarkSelect";

const inputClassName =
  "w-full rounded-none border border-gray-800 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F4F1ED] outline-none transition-colors duration-300 placeholder:text-[#F4F1ED]/40 focus:border-[#F4F1ED]/60";

type GeneralInquiryFormProps = {
  category: InquiryCategory;
  userEmail?: string | null;
  onClose?: () => void;
  onSignedOut?: () => void;
};

export default function GeneralInquiryForm({
  category,
  userEmail,
  onClose,
  onSignedOut,
}: GeneralInquiryFormProps) {
  const { locale } = useLocale();
  const { auth, booking } = useDictionary();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const { availableTimes, isCheckingTimes, availabilityMessage } = useAvailableTimes(selectedDate, locale);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    onSignedOut?.();
    setIsSigningOut(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    if (isCheckingTimes) {
      setErrorMessage(booking.waitAvailability);
      return;
    }

    const requestedTime = String(formData.get("requestedTime") ?? "");
    if (!requestedTime || !availableTimes.includes(requestedTime)) {
      setErrorMessage(availableTimes.length === 0 ? booking.noTimes : booking.selectAvailableTime);
      return;
    }

    const details = String(formData.get("details") ?? "").trim();
    if (!details) {
      setErrorMessage(booking.addDetails);
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitGeneralInquiry({
          categorySlug: category.slug,
          requestedDate: selectedDate,
          requestedTime,
          contactName: String(formData.get("contactName") ?? ""),
          contactEmail: String(formData.get("contactEmail") ?? ""),
          contactPhone: String(formData.get("contactPhone") ?? ""),
          details,
          locale,
        });
        if (result.success) {
          setIsSuccess(true);
          return;
        }
        setErrorMessage(result.message);
      } catch (error) {
        const message = error instanceof Error ? error.message : booking.inquiryError;
        console.error("Inquiry submission failed:", error);
        setErrorMessage(message);
      }
    });
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">
          {category.label} {booking.inquirySuffix}
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">{booking.successTitle}</h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[#F4F1ED]/80 sm:text-base">
          {booking.inquirySuccess}
        </p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-8 inline-flex rounded-none border border-gray-800 px-5 py-2.5 text-sm font-semibold text-[#F4F1ED] transition-colors duration-300 hover:border-[#F4F1ED]/60"
          >
            {booking.close}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">
        {category.label} {booking.inquirySuffix}
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">{booking.requestAShoot}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/75">{booking.inquiryIntro}</p>
      {userEmail ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-gray-800 px-4 py-3">
          <p className="text-xs text-[#F4F1ED]/70">
            {auth.signedInAs} <span className="text-[#F4F1ED]">{userEmail}</span>
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/70 underline-offset-4 hover:text-[#F4F1ED] hover:underline disabled:opacity-60"
          >
            {isSigningOut ? auth.signingOut : auth.signOut}
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="booking-form mt-8 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="requestedDate"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {booking.selectDate} *
            </label>
            <input
              id="requestedDate"
              name="requestedDate"
              type="date"
              required
              min={todayInputValue()}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className={`${inputClassName} [color-scheme:dark]`}
            />
          </div>
          <div>
            <label
              htmlFor="requestedTime"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {booking.time} *
            </label>
            <DarkSelect
              id="requestedTime"
              name="requestedTime"
              placeholder={selectedDate ? booking.selectTime : booking.selectDateFirst}
              options={availableTimes.map((time) => ({ value: time, label: time }))}
              disabled={!selectedDate || isCheckingTimes || availableTimes.length === 0}
              loading={isCheckingTimes}
              loadingLabel={booking.checkingAvailability}
              emptyLabel={booking.noTimes}
              resetKey={selectedDate}
            />
            {availabilityMessage && !isCheckingTimes ? (
              <p className="mt-2 text-sm text-[#F4F1ED]/70" role="status">
                {availabilityMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="contactName"
            className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
          >
            {booking.contactName} *
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            autoComplete="name"
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contactEmail"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {booking.contactEmail} *
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              required
              autoComplete="email"
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="contactPhone"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {booking.contactPhone} *
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              required
              autoComplete="tel"
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="details" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            {booking.details} *
          </label>
          <textarea
            id="details"
            name="details"
            rows={5}
            required
            maxLength={4000}
            placeholder={booking.detailsPlaceholder}
            className={`${inputClassName} min-h-[8rem] resize-y`}
          />
        </div>

        {errorMessage ? (
          <p className="text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending || isCheckingTimes || !selectedDate || availableTimes.length === 0}
          className="w-full rounded-none border border-[#F4F1ED] bg-[#F4F1ED] px-5 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? booking.submitting
            : isCheckingTimes
              ? booking.checkingAvailability
              : booking.confirmBooking}
        </button>
      </form>
    </div>
  );
}

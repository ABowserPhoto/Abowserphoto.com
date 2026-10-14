"use client";

import { useState, useTransition } from "react";
import { submitBooking, type BookingFormData } from "../actions/submitBooking";
import {
  BOOKING_SERVICES,
  PHOTO_PACKAGES,
  PROPERTY_STATUSES,
  isPhotoPackage,
  isPropertyStatus,
  parseBookingServices,
  todayInputValue,
} from "../lib/booking";
import { createClient } from "../lib/supabase/client";
import { useAvailableTimes } from "../lib/useAvailableTimes";
import DarkSelect from "./DarkSelect";

const inputClassName =
  "w-full rounded-none border border-gray-800 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F4F1ED] outline-none transition-colors duration-300 placeholder:text-[#F4F1ED]/40 focus:border-[#F4F1ED]/60";

const choiceClassName =
  "flex cursor-pointer items-center gap-3 rounded-none border border-gray-800 bg-[#1A1A1A] px-4 py-3 text-sm text-[#F4F1ED] transition-colors duration-300 has-[:checked]:border-[#F4F1ED]/60";

type BookingFormProps = {
  userEmail?: string | null;
  onClose?: () => void;
  onSignedOut?: () => void;
};

export default function BookingForm({ userEmail, onClose, onSignedOut }: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const { availableTimes, isCheckingTimes, availabilityMessage } = useAvailableTimes(selectedDate);

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
      setErrorMessage("Please wait while we check availability.");
      return;
    }

    const requestedTime = String(formData.get("requestedTime") ?? "");
    if (!requestedTime || !availableTimes.includes(requestedTime)) {
      setErrorMessage(
        availableTimes.length === 0
          ? "No available times for this date"
          : "Please select an available time."
      );
      return;
    }

    const propertyStatus = String(formData.get("propertyStatus") ?? "");
    if (!isPropertyStatus(propertyStatus)) {
      setErrorMessage("Please select a property status.");
      return;
    }

    const services = parseBookingServices(formData.getAll("services").map(String));
    if (services.length === 0) {
      setErrorMessage("Please select at least one service.");
      return;
    }

    const photoPackage = String(formData.get("photoPackage") ?? "");
    if (!isPhotoPackage(photoPackage)) {
      setErrorMessage("Please select a photo package.");
      return;
    }

    const payload: BookingFormData = {
      locationAddress: String(formData.get("locationAddress") ?? ""),
      requestedDate: String(formData.get("requestedDate") ?? ""),
      requestedTime,
      propertyStatus,
      contactName: String(formData.get("contactName") ?? ""),
      contactNumber: String(formData.get("contactNumber") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? ""),
      services,
      photoPackage,
      additionalDetails: String(formData.get("additionalDetails") ?? ""),
    };

    startTransition(async () => {
      try {
        const result = await submitBooking(payload);
        if (result.success) {
          setIsSuccess(true);
          return;
        }
        setErrorMessage(result.message);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Booking submission failed.";
        console.error("Booking submission failed:", error);
        setErrorMessage(message);
      }
    });
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">Booking Request</p>
        <h2 className="mt-4 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">Thank you</h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[#F4F1ED]/80 sm:text-base">
          Your request has been received. We will review your details and be in touch shortly.
        </p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-8 inline-flex rounded-none border border-gray-800 px-5 py-2.5 text-sm font-semibold text-[#F4F1ED] transition-colors duration-300 hover:border-[#F4F1ED]/60"
          >
            Close
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">Real Estate Booking</p>
      <h2 className="mt-3 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">Request a Shoot</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/75">
        Share the property details and your preferred time. We will confirm availability shortly.
      </p>
      {userEmail ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-gray-800 px-4 py-3">
          <p className="text-xs text-[#F4F1ED]/70">
            Signed in as <span className="text-[#F4F1ED]">{userEmail}</span>
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/70 underline-offset-4 hover:text-[#F4F1ED] hover:underline disabled:opacity-60"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="booking-form mt-8 space-y-5">
        <div>
          <label
            htmlFor="locationAddress"
            className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
          >
            Photoshoot Location Address *
          </label>
          <input
            id="locationAddress"
            name="locationAddress"
            type="text"
            required
            autoComplete="street-address"
            placeholder="Street, house number, ZIP, city"
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="requestedDate"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              Requested Date *
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
              Requested Time *
            </label>
            <DarkSelect
              id="requestedTime"
              name="requestedTime"
              placeholder={selectedDate ? "Select a time" : "Select a date first"}
              options={availableTimes.map((time) => ({ value: time, label: time }))}
              disabled={!selectedDate || isCheckingTimes || availableTimes.length === 0}
              loading={isCheckingTimes}
              loadingLabel="Checking availability..."
              emptyLabel="No available times for this date"
              resetKey={selectedDate}
            />
            {availabilityMessage && !isCheckingTimes ? (
              <p className="mt-2 text-sm text-[#F4F1ED]/70" role="status">
                {availabilityMessage}
              </p>
            ) : null}
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            Property Status *
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_STATUSES.map((status) => (
              <label
                key={status}
                className={choiceClassName}
              >
                <input
                  type="radio"
                  name="propertyStatus"
                  value={status}
                  required={status === PROPERTY_STATUSES[0]}
                  className="accent-[#F4F1ED]"
                />
                {status}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="contactName"
            className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
          >
            Contact Name *
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
              htmlFor="contactNumber"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              Contact Number *
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              required
              autoComplete="tel"
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="contactEmail"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              Contact Email Address *
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
        </div>

        <fieldset>
          <legend className="mb-3 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            Services *
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BOOKING_SERVICES.map((service) => (
              <label
                key={service}
                className={choiceClassName}
              >
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  className="accent-[#F4F1ED]"
                />
                {service}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="photoPackage"
            className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
          >
            Photo Package *
          </label>
          <DarkSelect
            id="photoPackage"
            name="photoPackage"
            placeholder="Select a photo package"
            options={PHOTO_PACKAGES.map((photoPackage) => ({
              value: photoPackage.id,
              label: photoPackage.label,
            }))}
          />
        </div>

        <div>
          <label
            htmlFor="additionalDetails"
            className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
          >
            Additional Details
          </label>
          <textarea
            id="additionalDetails"
            name="additionalDetails"
            rows={4}
            maxLength={2000}
            placeholder="Access notes, timing preferences, or anything else we should know"
            className={`${inputClassName} min-h-[7rem] resize-y`}
          />
        </div>

        {errorMessage ? (
          <p className="text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={
            isPending ||
            isCheckingTimes ||
            !selectedDate ||
            availableTimes.length === 0
          }
          className="w-full rounded-none border border-[#F4F1ED] bg-[#F4F1ED] px-5 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Submitting..." : isCheckingTimes ? "Checking availability..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

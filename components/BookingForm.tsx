"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { submitBooking, type BookingFormData } from "../actions/submitBooking";

const serviceOptions = [
  "Mini Session",
  "Portrait Session",
  "Product",
  "Lifestyle",
  "Other",
];

const inputClassName =
  "w-full rounded-none border border-gray-800 bg-transparent px-4 py-3 text-sm text-[#F4F1ED] outline-none transition-colors duration-300 placeholder:text-[#F4F1ED]/40 focus:border-[#F4F1ED]/60";

export default function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload: BookingFormData = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      requestedDate: String(formData.get("requestedDate") ?? ""),
      service: String(formData.get("service") ?? ""),
      description: String(formData.get("description") ?? ""),
    };

    startTransition(async () => {
      const result = await submitBooking(payload);
      if (result.success) {
        setIsSuccess(true);
        return;
      }
      setErrorMessage(result.message);
    });
  }

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl border border-gray-800 bg-black px-6 py-16 text-center sm:px-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">Booking Request</p>
        <h1 className="mt-4 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">Thank you</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[#F4F1ED]/80 sm:text-base">
          Your request has been received. We will review your details and be in touch shortly.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-none border border-gray-800 px-5 py-2.5 text-sm font-semibold text-[#F4F1ED] transition-colors duration-300 hover:border-[#F4F1ED]/60"
        >
          Back to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl border border-gray-800 bg-black px-6 py-10 sm:px-10 sm:py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">Booking Inquiry</p>
      <h1 className="mt-3 text-3xl font-semibold text-[#F4F1ED] sm:text-4xl">Request a Session</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/75">
        Share your project details and preferred date. We will review your request and follow up shortly.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="fullName" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            Full Name *
          </label>
          <input id="fullName" name="fullName" type="text" required className={inputClassName} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
              Email Address *
            </label>
            <input id="email" name="email" type="email" required className={inputClassName} />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
              Phone Number *
            </label>
            <input id="phone" name="phone" type="tel" required className={inputClassName} />
          </div>
        </div>

        <div>
          <label htmlFor="requestedDate" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            Requested Date *
          </label>
          <input
            id="requestedDate"
            name="requestedDate"
            type="date"
            required
            className={`${inputClassName} [color-scheme:dark]`}
          />
        </div>

        <fieldset>
          <legend className="mb-3 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            Services Needed *
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {serviceOptions.map((service) => (
              <label
                key={service}
                className="flex cursor-pointer items-center gap-3 rounded-none border border-gray-800 px-4 py-3 text-sm text-[#F4F1ED] transition-colors duration-300 has-[:checked]:border-[#F4F1ED]/60"
              >
                <input
                  type="radio"
                  name="service"
                  value={service}
                  required={service === serviceOptions[0]}
                  className="accent-[#F4F1ED]"
                />
                {service}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="description" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            Project Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className={`${inputClassName} resize-y`}
            placeholder="Tell us about your vision, location, timeline, and any references."
          />
        </div>

        {errorMessage ? (
          <p className="text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-none border border-[#F4F1ED] bg-[#F4F1ED] px-5 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

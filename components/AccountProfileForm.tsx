"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "../actions/updateProfile";

const inputClassName =
  "w-full rounded-none border border-gray-800 bg-transparent px-4 py-3 text-sm text-[#F4F1ED] outline-none transition-colors duration-300 placeholder:text-[#F4F1ED]/40 focus:border-[#F4F1ED]/60";

export type AccountProfileValues = {
  firstName: string;
  lastName: string;
  companyName: string;
  companyAddress: string;
  phoneNumber: string;
};

type AccountProfileFormProps = {
  email: string;
  isApproved: boolean;
  initialValues: AccountProfileValues;
};

export default function AccountProfileForm({ email, isApproved, initialValues }: AccountProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState(initialValues.firstName);
  const [lastName, setLastName] = useState(initialValues.lastName);
  const [companyName, setCompanyName] = useState(initialValues.companyName);
  const [companyAddress, setCompanyAddress] = useState(initialValues.companyAddress);
  const [phoneNumber, setPhoneNumber] = useState(initialValues.phoneNumber);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        const result = await updateProfile({
          firstName,
          lastName,
          companyName,
          companyAddress,
          phoneNumber,
        });
        if (result.success) {
          setSuccessMessage(result.message);
          return;
        }
        setErrorMessage(result.message);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Profile update failed.";
        console.error("Profile update failed:", error);
        setErrorMessage(message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-gray-800 px-4 py-3">
        <p className="text-xs text-[#F4F1ED]/70">
          Signed in as <span className="text-[#F4F1ED]">{email}</span>
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/60">
          {isApproved ? "Approved to book" : "Pending admin approval"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="account-first-name" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            First Name *
          </label>
          <input
            id="account-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="account-last-name" className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65">
            Last Name *
          </label>
          <input
            id="account-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="account-company-name"
          className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
        >
          Company Name *
        </label>
        <input
          id="account-company-name"
          name="companyName"
          type="text"
          autoComplete="organization"
          required
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="account-company-address"
          className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
        >
          Company Address *
        </label>
        <textarea
          id="account-company-address"
          name="companyAddress"
          required
          rows={3}
          autoComplete="street-address"
          value={companyAddress}
          onChange={(event) => setCompanyAddress(event.target.value)}
          className={`${inputClassName} resize-y`}
        />
      </div>

      <div>
        <label
          htmlFor="account-phone-number"
          className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
        >
          Telephone Number *
        </label>
        <input
          id="account-phone-number"
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
          required
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          className={inputClassName}
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-300" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className="text-sm text-emerald-300" role="status">
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-none border border-[#F4F1ED] bg-[#F4F1ED] px-5 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

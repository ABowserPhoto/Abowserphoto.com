"use client";

import { useState } from "react";
import { notifyAdminOfRegistration } from "../../actions/notifyAdminOfRegistration";
import { BOOKING_QUERY_KEY, BOOKING_QUERY_VALUE } from "../../lib/booking";
import { useDictionary, useLocale } from "../../lib/i18n/LocaleProvider";
import { createClient } from "../../lib/supabase/client";

const inputClassName =
  "w-full rounded-none border border-gray-800 bg-transparent px-4 py-3 text-sm text-[#F4F1ED] outline-none transition-colors duration-300 placeholder:text-[#F4F1ED]/40 focus:border-[#F4F1ED]/60";

type ClientAuthProps = {
  onAuthenticated: () => void;
  onSignupStart?: () => void;
  onSignupComplete?: () => void;
  onSignupFailed?: () => void;
};

export default function ClientAuth({
  onAuthenticated,
  onSignupStart,
  onSignupComplete,
  onSignupFailed,
}: ClientAuthProps) {
  const { locale } = useLocale();
  const { auth } = useDictionary();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        `${window.location.pathname}?${BOOKING_QUERY_KEY}=${BOOKING_QUERY_VALUE}`
      )}`;

      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrorMessage(error.message);
          return;
        }
        onAuthenticated();
        return;
      }

      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !companyName.trim() ||
        !companyAddress.trim() ||
        !phoneNumber.trim()
      ) {
        setErrorMessage(auth.requiredFields);
        return;
      }

      onSignupStart?.();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`,
            company_name: companyName.trim(),
            company_address: companyAddress.trim(),
            phone_number: phoneNumber.trim(),
            preferred_locale: locale,
          },
        },
      });

      if (error) {
        onSignupFailed?.();
        setErrorMessage(error.message);
        return;
      }

      const isNewUser = Boolean(data.user) && (data.user?.identities?.length ?? 1) > 0;
      if (isNewUser) {
        try {
          await notifyAdminOfRegistration({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            companyName: companyName.trim(),
            email: email.trim(),
            locale,
          });
        } catch (notifyError) {
          console.error("Admin registration email failed:", notifyError);
        }
      }

      setInfoMessage(auth.signupSuccess);
      onSignupComplete?.();
      if (data.session) {
        await supabase.auth.signOut();
      }
    } catch {
      onSignupFailed?.();
      setErrorMessage(auth.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">{auth.clientAccess}</p>
      <h2 className="mt-3 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">
        {mode === "sign-in" ? auth.signInToBook : auth.createYourAccount}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/75">{auth.intro}</p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("sign-in");
            setErrorMessage(null);
            setInfoMessage(null);
          }}
          className={`rounded-none border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
            mode === "sign-in"
              ? "border-[#F4F1ED] bg-[#F4F1ED] text-black"
              : "border-gray-800 text-[#F4F1ED]/80"
          }`}
        >
          {auth.signIn}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("sign-up");
            setErrorMessage(null);
            setInfoMessage(null);
          }}
          className={`rounded-none border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
            mode === "sign-up"
              ? "border-[#F4F1ED] bg-[#F4F1ED] text-black"
              : "border-gray-800 text-[#F4F1ED]/80"
          }`}
        >
          {auth.signUp}
        </button>
      </div>

      {infoMessage ? (
        <div className="mt-6 space-y-5">
          <p className="text-sm leading-relaxed text-[#F4F1ED]/80">{infoMessage}</p>
          <button
            type="button"
            onClick={() => {
              setMode("sign-in");
              setInfoMessage(null);
            }}
            className="w-full rounded-none border border-[#F4F1ED] bg-[#F4F1ED] px-5 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-90"
          >
            {auth.backToSignIn}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {mode === "sign-up" ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="booking-first-name"
                    className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
                  >
                    {auth.firstName} *
                  </label>
                  <input
                    id="booking-first-name"
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
                  <label
                    htmlFor="booking-last-name"
                    className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
                  >
                    {auth.lastName} *
                  </label>
                  <input
                    id="booking-last-name"
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
                  htmlFor="booking-company-name"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
                >
                  {auth.companyName} *
                </label>
                <input
                  id="booking-company-name"
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
                  htmlFor="booking-company-address"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
                >
                  {auth.companyAddress} *
                </label>
                <textarea
                  id="booking-company-address"
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
                  htmlFor="booking-phone-number"
                  className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
                >
                  {auth.telephone} *
                </label>
                <input
                  id="booking-phone-number"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className={inputClassName}
                />
              </div>
            </>
          ) : null}

          <div>
            <label
              htmlFor="booking-email"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {auth.email} *
            </label>
            <input
              id="booking-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="booking-password"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/65"
            >
              {auth.password} *
            </label>
            <input
              id="booking-password"
              name="password"
              type="password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClassName}
            />
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-300" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-none border border-[#F4F1ED] bg-[#F4F1ED] px-5 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? auth.pleaseWait : mode === "sign-in" ? auth.signIn : auth.signUp}
          </button>
        </form>
      )}
    </div>
  );
}

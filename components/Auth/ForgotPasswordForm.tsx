"use client";

import Link from "next/link";
import { useState } from "react";
import { bookingHref } from "../../lib/booking";
import { withLocale } from "../../lib/i18n/config";
import { useDictionary, useLocale } from "../../lib/i18n/LocaleProvider";
import { passwordResetRedirectUrl } from "../../lib/passwordReset";
import { createClient } from "../../lib/supabase/client";
import { isSupabaseConfigured } from "../../lib/supabase/env";
import AuthScreen from "./AuthScreen";
import {
  authInputClassName,
  authLabelClassName,
  authPrimaryButtonClassName,
  authTextLinkClassName,
} from "./fieldStyles";

export default function ForgotPasswordForm() {
  const { locale } = useLocale();
  const { auth } = useDictionary();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const signInHref = bookingHref(withLocale("/", locale));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setErrorMessage(auth.accountNotConfigured);
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const redirectTo = passwordResetRedirectUrl(window.location.origin, locale);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (error) {
        console.error("Password reset request was not confirmed.");
      }
    } catch {
      console.error("Password reset request failed.");
    } finally {
      setIsSubmitting(false);
      setSent(true);
    }
  }

  return (
    <AuthScreen>
      <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">{auth.clientAccess}</p>
      <h1 className="mt-3 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">{auth.forgotPasswordTitle}</h1>
      {sent ? (
        <div className="mt-6 space-y-5">
          <p className="text-sm leading-relaxed text-[#F4F1ED]/80" role="status">
            {auth.resetLinkSent}
          </p>
          <Link href={signInHref} className={`${authPrimaryButtonClassName} block text-center`}>
            {auth.backToSignIn}
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/75">{auth.forgotPasswordIntro}</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="forgot-email" className={authLabelClassName}>
                {auth.email} *
              </label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={authInputClassName}
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
              className={authPrimaryButtonClassName}
            >
              {isSubmitting ? auth.pleaseWait : auth.sendResetLink}
            </button>
            <Link href={signInHref} className={authTextLinkClassName}>
              {auth.backToSignIn}
            </Link>
          </form>
        </>
      )}
    </AuthScreen>
  );
}

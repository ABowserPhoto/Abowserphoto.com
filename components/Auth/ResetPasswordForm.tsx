"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingHref } from "../../lib/booking";
import type { Dictionary } from "../../lib/i18n/getDictionary";
import { withLocale } from "../../lib/i18n/config";
import { useDictionary, useLocale } from "../../lib/i18n/LocaleProvider";
import {
  MIN_PASSWORD_LENGTH,
  forgotPasswordPath,
  passwordIssue,
  type PasswordIssue,
} from "../../lib/passwordReset";
import { createClient } from "../../lib/supabase/client";
import { isSupabaseConfigured } from "../../lib/supabase/env";
import AuthScreen from "./AuthScreen";
import {
  authInputClassName,
  authLabelClassName,
  authPrimaryButtonClassName,
  authTextLinkClassName,
} from "./fieldStyles";

type RecoveryStatus = "checking" | "ready" | "invalid" | "unconfigured";

const codeExchanges = new Map<string, Promise<boolean>>();

function hashParams() {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  return new URLSearchParams(hash);
}

function passwordIssueMessage(issue: PasswordIssue, auth: Dictionary["auth"]) {
  switch (issue) {
    case "too-short":
      return auth.passwordTooShort;
    case "mismatch":
      return auth.passwordMismatch;
    default: {
      const unreachable: never = issue;
      return unreachable;
    }
  }
}

/**
 * PKCE links are exchanged in `proxy.ts` and come back as `?recovery=1`.
 * Implicit links keep the session in the hash and emit PASSWORD_RECOVERY.
 * A `code` that is still on the URL is exchanged here once.
 */
function establishRecovery(supabase: SupabaseClient, code: string) {
  const existing = codeExchanges.get(code);
  if (existing) return existing;

  const pending = (async () => {
    let sawRecovery = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") sawRecovery = true;
    });

    try {
      await supabase.auth.getSession();
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
      if (sawRecovery) return true;

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return true;

      const { data } = await supabase.auth.getUser();
      return Boolean(data.user) && sawRecovery;
    } finally {
      subscription.unsubscribe();
    }
  })();

  codeExchanges.set(code, pending);
  return pending;
}

export function ResetPasswordFallback() {
  const { auth } = useDictionary();
  return (
    <AuthScreen>
      <p className="pr-10 text-sm text-[#F4F1ED]/70">{auth.checkingResetLink}</p>
    </AuthScreen>
  );
}

export default function ResetPasswordForm() {
  const { locale } = useLocale();
  const { auth } = useDictionary();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const recoveryParam = searchParams.get("recovery");
  const codeParam = searchParams.get("code");
  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestLink = forgotPasswordPath(locale);
  const signInHref = bookingHref(withLocale("/", locale));

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStatus("unconfigured");
      return;
    }

    let active = true;
    const supabase = createClient();
    let sawRecovery = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") sawRecovery = true;
    });

    async function resolveStatus() {
      const hash = hashParams();
      const linkFailed = Boolean(errorParam || hash.get("error") || hash.get("error_code"));
      if (linkFailed) {
        if (active) setStatus("invalid");
        return;
      }

      if (codeParam) {
        const recovered = await establishRecovery(supabase, codeParam);
        if (!active) return;
        if (!recovered) {
          setStatus("invalid");
          return;
        }
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.set("recovery", "1");
        url.hash = "";
        window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
        setStatus("ready");
        return;
      }

      const hashRecovery = hash.get("type") === "recovery" || hash.has("access_token");
      if (hashRecovery) {
        await supabase.auth.getSession();
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
        if (!active) return;
        const { data } = await supabase.auth.getUser();
        const recovered = Boolean(data.user) && (sawRecovery || hash.get("type") === "recovery");
        setStatus(recovered ? "ready" : "invalid");
        return;
      }

      if (recoveryParam === "1") {
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        setStatus(data.user ? "ready" : "invalid");
        return;
      }

      if (active) setStatus("invalid");
    }

    void resolveStatus().catch(() => {
      if (active) setStatus("invalid");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [codeParam, errorParam, recoveryParam]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const issue = passwordIssue(password, confirmation);
    if (issue) {
      setErrorMessage(passwordIssueMessage(issue, auth));
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        const missingSession =
          error.code === "session_not_found" || /auth session missing/i.test(error.message);
        if (missingSession) {
          setStatus("invalid");
          return;
        }
        setErrorMessage(error.message);
        return;
      }
      window.location.assign(signInHref);
    } catch {
      setErrorMessage(auth.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen>
      {status === "checking" ? (
        <p className="pr-10 text-sm text-[#F4F1ED]/70">{auth.checkingResetLink}</p>
      ) : status === "unconfigured" ? (
        <p className="pr-10 text-sm leading-relaxed text-[#F4F1ED]/80">{auth.accountNotConfigured}</p>
      ) : status === "invalid" ? (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">{auth.clientAccess}</p>
          <h1 className="mt-3 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">{auth.resetPasswordTitle}</h1>
          <p className="mt-6 text-sm leading-relaxed text-[#F4F1ED]/80" role="alert">
            {auth.invalidResetLink}
          </p>
          <Link href={requestLink} className={`${authPrimaryButtonClassName} mt-6 block text-center`}>
            {auth.requestNewLink}
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">{auth.clientAccess}</p>
          <h1 className="mt-3 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">{auth.resetPasswordTitle}</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/75">{auth.resetPasswordIntro}</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="reset-password" className={authLabelClassName}>
                {auth.newPassword} *
              </label>
              <input
                id="reset-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={authInputClassName}
              />
            </div>
            <div>
              <label htmlFor="reset-password-confirm" className={authLabelClassName}>
                {auth.confirmPassword} *
              </label>
              <input
                id="reset-password-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className={authInputClassName}
              />
            </div>
            {errorMessage ? (
              <p className="text-sm text-red-300" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <button type="submit" disabled={isSubmitting} className={authPrimaryButtonClassName}>
              {isSubmitting ? auth.pleaseWait : auth.updatePassword}
            </button>
          </form>
        </div>
      )}
    </AuthScreen>
  );
}

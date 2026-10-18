"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { AccountProfileValues } from "./AccountProfileForm";
import AccountPortal from "./AccountPortal";
import { useDictionary } from "../lib/i18n/LocaleProvider";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/env";

type AccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AccountSessionData = {
  email: string;
  isApproved: boolean;
  initialValues: AccountProfileValues;
};

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { auth } = useDictionary();
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<AccountSessionData | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !isOpen) return;

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [hasMounted, isOpen, onClose]);

  useEffect(() => {
    if (!hasMounted || !isOpen) return;

    if (!isSupabaseConfigured()) {
      setSessionData(null);
      setErrorMessage(auth.accountNotConfigured);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    const supabase = createClient();

    async function loadAccount() {
      setIsLoading(true);
      setErrorMessage(null);

      const { data: userData } = await supabase.auth.getUser();
      if (!isActive) return;

      if (!userData.user) {
        setSessionData(null);
        setErrorMessage(auth.signInToViewAccount);
        setIsLoading(false);
        return;
      }

      const [{ data: client }, { data: profile }] = await Promise.all([
        supabase
          .from("clients")
          .select(
            "first_name, last_name, company_name, company_address, billing_address, phone_number, is_approved"
          )
          .eq("user_id", userData.user.id)
          .maybeSingle(),
        supabase.from("profiles").select("full_name").eq("id", userData.user.id).maybeSingle(),
      ]);

      if (!isActive) return;

      setSessionData({
        email: userData.user.email ?? "",
        isApproved: Boolean(client?.is_approved),
        initialValues: {
          firstName: client?.first_name || profile?.full_name?.split(/\s+/)[0] || "",
          lastName:
            client?.last_name || profile?.full_name?.split(/\s+/).slice(1).join(" ") || "",
          companyName: client?.company_name || "",
          companyAddress: client?.company_address || client?.billing_address || "",
          phoneNumber: client?.phone_number || "",
        },
      });
      setIsLoading(false);
    }

    void loadAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSessionData(null);
        setErrorMessage(auth.signInToViewAccount);
        setIsLoading(false);
        return;
      }
      void loadAccount();
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [auth.accountNotConfigured, auth.signInToViewAccount, hasMounted, isOpen]);

  if (!hasMounted) return null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="account-modal-title"
        >
          <motion.div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-gray-800 bg-black px-6 py-10 sm:px-10 sm:py-12"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={auth.closeModal}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-gray-800 text-lg leading-none text-[#F4F1ED] transition-colors duration-300 hover:border-[#F4F1ED]/60"
            >
              X
            </button>

            <h2 id="account-modal-title" className="sr-only">
              {auth.account}
            </h2>

            {isLoading ? (
              <p className="pr-10 text-sm text-[#F4F1ED]/70">{auth.loadingAccount}</p>
            ) : errorMessage || !sessionData ? (
              <p className="pr-10 text-sm leading-relaxed text-[#F4F1ED]/80">
                {errorMessage ?? auth.unableToLoadAccount}
              </p>
            ) : (
              <AccountPortal
                compact
                email={sessionData.email}
                isApproved={sessionData.isApproved}
                initialValues={sessionData.initialValues}
              />
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

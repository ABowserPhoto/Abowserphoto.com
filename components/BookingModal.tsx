"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "../lib/supabase/env";
import { createClient } from "../lib/supabase/client";
import type { InquiryCategory } from "../lib/booking";
import ClientAuth from "./Auth/ClientAuth";
import BookingForm from "./BookingForm";
import GeneralInquiryForm from "./GeneralInquiryForm";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isRealEstate: boolean;
  inquiryCategory: InquiryCategory;
};

const SIGNUP_SUCCESS_MESSAGE =
  "Please check your email to verify your account. Once verified, your account will be manually reviewed.";

function SignupSuccessMessage({ onBackToSignIn }: { onBackToSignIn: () => void }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">Client Access</p>
      <h2 className="mt-3 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">Check your email</h2>
      <p className="mt-6 text-sm leading-relaxed text-[#F4F1ED]/80">{SIGNUP_SUCCESS_MESSAGE}</p>
      <button
        type="button"
        onClick={onBackToSignIn}
        className="mt-6 w-full rounded-none border border-[#F4F1ED] bg-[#F4F1ED] px-5 py-3 text-sm font-semibold text-black transition-opacity duration-300 hover:opacity-90"
      >
        Back to Sign In
      </button>
    </div>
  );
}

function PendingApprovalMessage({
  userEmail,
  onSignedOut,
}: {
  userEmail?: string | null;
  onSignedOut: () => void;
}) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    onSignedOut();
    setIsSigningOut(false);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">Account Review</p>
      <h2 className="mt-3 text-2xl font-semibold text-[#F4F1ED] sm:text-3xl">Booking unavailable</h2>
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
      <p className="mt-6 text-sm leading-relaxed text-[#F4F1ED]/80">
        Your account is currently being reviewed. You will be able to book photoshoots once approved.
      </p>
    </div>
  );
}

export default function BookingModal({ isOpen, onClose, isRealEstate, inquiryCategory }: BookingModalProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);
  const ignoreAuthChangesRef = useRef(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !isOpen) return;

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
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
      setUser(null);
      setIsCheckingSession(false);
      return;
    }

    setShowSignupSuccess(false);

    let isActive = true;
    const supabase = createClient();

    async function loadApproval(nextUser: User | null) {
      if (ignoreAuthChangesRef.current) {
        return;
      }

      if (!nextUser) {
        if (isActive) {
          setUser(null);
          setIsApproved(false);
          setIsCheckingSession(false);
        }
        return;
      }

      const { data: client, error } = await supabase
        .from("clients")
        .select("is_approved")
        .eq("user_id", nextUser.id)
        .maybeSingle();

      if (ignoreAuthChangesRef.current || !isActive) {
        return;
      }

      setUser(nextUser);
      setIsApproved(Boolean(client?.is_approved) && !error);
      setIsCheckingSession(false);
    }

    async function loadSession() {
      setIsCheckingSession(true);
      const { data } = await supabase.auth.getUser();
      await loadApproval(data.user ?? null);
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (ignoreAuthChangesRef.current) {
        if (!session) {
          ignoreAuthChangesRef.current = false;
        }
        return;
      }
      void loadApproval(session?.user ?? null);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [hasMounted, isOpen]);

  if (!hasMounted) {
    return null;
  }

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
          aria-labelledby="booking-modal-title"
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
              aria-label="Close booking modal"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-gray-800 text-lg leading-none text-[#F4F1ED] transition-colors duration-300 hover:border-[#F4F1ED]/60"
            >
              X
            </button>

            <h2 id="booking-modal-title" className="sr-only">
              Booking
            </h2>

            {!isSupabaseConfigured() ? (
              <p className="pr-10 text-sm leading-relaxed text-[#F4F1ED]/80">
                Booking is not configured yet. Add the Supabase project URL and publishable key to
                enable sign-in and requests.
              </p>
            ) : isCheckingSession && !showSignupSuccess ? (
              <p className="pr-10 text-sm text-[#F4F1ED]/70">Checking your account...</p>
            ) : showSignupSuccess ? (
              <SignupSuccessMessage
                onBackToSignIn={() => {
                  ignoreAuthChangesRef.current = false;
                  setShowSignupSuccess(false);
                }}
              />
            ) : !user ? (
              <ClientAuth
                onSignupStart={() => {
                  ignoreAuthChangesRef.current = true;
                }}
                onSignupFailed={() => {
                  ignoreAuthChangesRef.current = false;
                }}
                onSignupComplete={() => {
                  ignoreAuthChangesRef.current = true;
                  setShowSignupSuccess(true);
                  setUser(null);
                  setIsApproved(false);
                  setIsCheckingSession(false);
                }}
                onAuthenticated={async () => {
                  ignoreAuthChangesRef.current = false;
                  setShowSignupSuccess(false);
                  setIsCheckingSession(true);
                  const supabase = createClient();
                  const { data } = await supabase.auth.getUser();
                  if (!data.user) {
                    setUser(null);
                    setIsApproved(false);
                    setIsCheckingSession(false);
                    return;
                  }

                  const { data: client } = await supabase
                    .from("clients")
                    .select("is_approved")
                    .eq("user_id", data.user.id)
                    .maybeSingle();

                  setUser(data.user);
                  setIsApproved(Boolean(client?.is_approved));
                  setIsCheckingSession(false);
                }}
              />
            ) : user && isApproved ? (
              isRealEstate ? (
                <BookingForm
                  userEmail={user.email}
                  onClose={onClose}
                  onSignedOut={() => {
                    setUser(null);
                    setIsApproved(false);
                  }}
                />
              ) : (
                <GeneralInquiryForm
                  category={inquiryCategory}
                  userEmail={user.email}
                  onClose={onClose}
                  onSignedOut={() => {
                    setUser(null);
                    setIsApproved(false);
                  }}
                />
              )
            ) : (
              <PendingApprovalMessage
                userEmail={user.email}
                onSignedOut={() => {
                  setUser(null);
                  setIsApproved(false);
                }}
              />
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getClientBookings, type ClientBookingRecord } from "../actions/getClientBookings";
import type { AccountTab } from "../lib/account";
import { useDictionary } from "../lib/i18n/LocaleProvider";
import AccountBookingsPanel from "./AccountBookingsPanel";
import AccountProfileForm, { type AccountProfileValues } from "./AccountProfileForm";

type AccountPortalProps = {
  email: string;
  isApproved: boolean;
  initialValues: AccountProfileValues;
  initialTab?: AccountTab;
  compact?: boolean;
};

export default function AccountPortal({
  email,
  isApproved,
  initialValues,
  initialTab = "profile",
  compact = false,
}: AccountPortalProps) {
  const { auth } = useDictionary();
  const tabs: Array<{ id: AccountTab; label: string }> = [
    { id: "profile", label: auth.tabProfile },
    { id: "bookings", label: auth.tabBookings },
    { id: "invoices", label: auth.tabInvoices },
  ];
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);
  const [bookings, setBookings] = useState<ClientBookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [hasLoadedBookings, setHasLoadedBookings] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === "profile" || hasLoadedBookings) return;

    let cancelled = false;
    setIsLoadingBookings(true);
    setBookingsError(null);

    getClientBookings()
      .then((result) => {
        if (cancelled) return;
        if (!result.success) {
          setBookings([]);
          setBookingsError(result.message ?? auth.couldNotLoadBookings);
          return;
        }
        setBookings(result.bookings);
        setHasLoadedBookings(true);
      })
      .catch((error) => {
        if (cancelled) return;
        setBookingsError(error instanceof Error ? error.message : auth.couldNotLoadBookings);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBookings(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, auth.couldNotLoadBookings, hasLoadedBookings]);

  const activeTabLabel =
    activeTab === "bookings" ? auth.tabBookings : activeTab === "invoices" ? auth.tabInvoices : auth.tabProfile;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">{auth.clientAccount}</p>
      <h2 className={`mt-3 font-semibold text-[#F4F1ED] ${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>
        {auth.yourAccount}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#F4F1ED]/75">{auth.accountIntro}</p>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-gray-800 pb-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                isActive
                  ? "border border-[#F4F1ED] bg-[#F4F1ED] text-black"
                  : "border border-gray-800 bg-[#1A1A1A] text-[#F4F1ED]/75 hover:border-[#F4F1ED]/40 hover:text-[#F4F1ED]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {activeTab === "profile" ? (
          <AccountProfileForm email={email} isApproved={isApproved} initialValues={initialValues} />
        ) : null}

        {activeTab === "bookings" || activeTab === "invoices" ? (
          isLoadingBookings ? (
            <p className="text-sm text-[#F4F1ED]/70">
              {auth.loadingTab.replace("{tab}", activeTabLabel.toLowerCase())}
            </p>
          ) : bookingsError ? (
            <p className="text-sm text-red-300" role="alert">
              {bookingsError}
            </p>
          ) : (
            <AccountBookingsPanel
              bookings={bookings}
              mode={activeTab}
              emptyMessage={activeTab === "bookings" ? auth.noBookings : auth.noInvoices}
            />
          )
        ) : null}
      </div>
    </div>
  );
}

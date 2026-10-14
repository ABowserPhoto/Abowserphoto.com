"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  BOOKING_OPEN_EVENT,
  BOOKING_QUERY_KEY,
  BOOKING_QUERY_VALUE,
  getInquiryCategory,
  isBookingRoute,
  isRealEstateBookingPath,
} from "../lib/booking";
import BookingModal from "./BookingModal";

export default function BookingModalHost() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isQueryOpen = searchParams.get(BOOKING_QUERY_KEY) === BOOKING_QUERY_VALUE;
  const isRouteOpen = isBookingRoute(pathname);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(isQueryOpen || isRouteOpen);
  }, [isQueryOpen, isRouteOpen]);

  useEffect(() => {
    function onOpenRequest() {
      setIsOpen(true);
    }

    window.addEventListener(BOOKING_OPEN_EVENT, onOpenRequest);
    return () => window.removeEventListener(BOOKING_OPEN_EVENT, onOpenRequest);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);

    if (isRouteOpen) {
      if (document.referrer) {
        try {
          const referrer = new URL(document.referrer);
          if (
            referrer.origin === window.location.origin &&
            !isBookingRoute(referrer.pathname) &&
            referrer.searchParams.get(BOOKING_QUERY_KEY) !== BOOKING_QUERY_VALUE
          ) {
            router.back();
            return;
          }
        } catch {
          // Fall through to a safe home redirect.
        }
      }
      router.push("/");
      return;
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete(BOOKING_QUERY_KEY);
    const nextPath = `${nextUrl.pathname}${nextUrl.search}`;
    window.history.replaceState(window.history.state, "", nextPath);
    router.replace(nextPath, { scroll: false });
  }, [isRouteOpen, router]);

  return (
    <BookingModal
      isOpen={isOpen}
      onClose={closeModal}
      isRealEstate={isRealEstateBookingPath(pathname)}
      inquiryCategory={getInquiryCategory(pathname)}
    />
  );
}

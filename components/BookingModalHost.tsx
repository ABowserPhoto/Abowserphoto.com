"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  BOOKING_OPEN_EVENT,
  BOOKING_QUERY_KEY,
  BOOKING_QUERY_VALUE,
  isBookingRoute,
  resolveBookingContext,
} from "../lib/booking";
import { getLocaleFromPathname, withLocale } from "../lib/i18n/config";
import { useLocale } from "../lib/i18n/LocaleProvider";
import BookingModal from "./BookingModal";

function stripBookingParam(href = window.location.href) {
  const nextUrl = new URL(href);
  nextUrl.searchParams.delete(BOOKING_QUERY_KEY);
  const search = nextUrl.searchParams.toString();
  return `${nextUrl.pathname}${search ? `?${search}` : ""}${nextUrl.hash}`;
}

export default function BookingModalHost() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { publicHost } = useLocale();
  const bookingContext = resolveBookingContext(pathname, publicHost);
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

    // Dedicated /book and /booking routes have no underlying page. Prefer history back
    // so users return to wherever they came from, instead of forcing home.
    if (isRouteOpen) {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        return;
      }
      const locale = getLocaleFromPathname(pathname) ?? "en";
      const nextPath = stripBookingParam(`${window.location.origin}${withLocale("/", locale)}`);
      window.history.replaceState(window.history.state, "", nextPath);
      router.replace(nextPath, { scroll: false });
      return;
    }

    const nextPath = stripBookingParam();
    window.history.replaceState(window.history.state, "", nextPath);
    router.replace(nextPath, { scroll: false });
  }, [isRouteOpen, pathname, router]);

  return (
    <BookingModal
      isOpen={isOpen}
      onClose={closeModal}
      isRealEstate={bookingContext.isRealEstate}
      inquiryCategory={bookingContext.inquiryCategory}
    />
  );
}

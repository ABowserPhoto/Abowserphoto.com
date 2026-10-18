"use client";

import { useEffect, useState } from "react";
import { getAvailableTimes } from "../actions/getAvailableTimes";
import type { Locale } from "./i18n/config";
import { getBookingCopy } from "./i18n/messages";

export function useAvailableTimes(selectedDate: string, locale?: Locale) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isCheckingTimes, setIsCheckingTimes] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      setIsCheckingTimes(false);
      setAvailabilityMessage(null);
      return;
    }

    let cancelled = false;
    setAvailableTimes([]);
    setIsCheckingTimes(true);
    setAvailabilityMessage(null);
    const copy = getBookingCopy(locale);

    getAvailableTimes(selectedDate, locale)
      .then((result) => {
        if (cancelled) return;
        if (!result.success) {
          setAvailableTimes([]);
          setAvailabilityMessage(result.message ?? copy.calendarUnavailable);
          return;
        }
        setAvailableTimes(result.times);
        setAvailabilityMessage(result.times.length === 0 ? copy.noTimes : null);
      })
      .catch((error) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : copy.calendarUnavailable;
        setAvailableTimes([]);
        setAvailabilityMessage(message);
      })
      .finally(() => {
        if (!cancelled) setIsCheckingTimes(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, locale]);

  return { availableTimes, isCheckingTimes, availabilityMessage };
}

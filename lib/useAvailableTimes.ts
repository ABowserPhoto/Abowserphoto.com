"use client";

import { useEffect, useState } from "react";
import { getAvailableTimes } from "../actions/getAvailableTimes";

export function useAvailableTimes(selectedDate: string) {
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

    getAvailableTimes(selectedDate)
      .then((result) => {
        if (cancelled) return;
        if (!result.success) {
          setAvailableTimes([]);
          setAvailabilityMessage(result.message ?? "We could not check calendar availability.");
          return;
        }
        setAvailableTimes(result.times);
        setAvailabilityMessage(
          result.times.length === 0 ? "No available times for this date" : null
        );
      })
      .catch((error) => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "We could not check calendar availability.";
        setAvailableTimes([]);
        setAvailabilityMessage(message);
      })
      .finally(() => {
        if (!cancelled) setIsCheckingTimes(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  return { availableTimes, isCheckingTimes, availabilityMessage };
}

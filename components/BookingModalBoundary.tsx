"use client";

import { Suspense } from "react";
import BookingModalHost from "./BookingModalHost";

export default function BookingModalBoundary() {
  return (
    <Suspense fallback={null}>
      <BookingModalHost />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import AccountModalHost from "./AccountModalHost";

export default function AccountModalBoundary() {
  return (
    <Suspense fallback={null}>
      <AccountModalHost />
    </Suspense>
  );
}

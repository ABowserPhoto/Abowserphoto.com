"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ACCOUNT_OPEN_EVENT,
  ACCOUNT_QUERY_KEY,
  ACCOUNT_QUERY_VALUE,
} from "../lib/account";
import AccountModal from "./AccountModal";

function stripAccountParam(href = window.location.href) {
  const nextUrl = new URL(href);
  nextUrl.searchParams.delete(ACCOUNT_QUERY_KEY);
  const search = nextUrl.searchParams.toString();
  return `${nextUrl.pathname}${search ? `?${search}` : ""}${nextUrl.hash}`;
}

export default function AccountModalHost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isQueryOpen = searchParams.get(ACCOUNT_QUERY_KEY) === ACCOUNT_QUERY_VALUE;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(isQueryOpen);
  }, [isQueryOpen]);

  useEffect(() => {
    function onOpenRequest() {
      setIsOpen(true);
    }

    window.addEventListener(ACCOUNT_OPEN_EVENT, onOpenRequest);
    return () => window.removeEventListener(ACCOUNT_OPEN_EVENT, onOpenRequest);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    const nextPath = stripAccountParam();
    window.history.replaceState(window.history.state, "", nextPath);
    router.replace(nextPath, { scroll: false });
  }, [router]);

  return <AccountModal isOpen={isOpen} onClose={closeModal} />;
}

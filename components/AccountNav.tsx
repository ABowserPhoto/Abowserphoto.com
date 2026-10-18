"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ACCOUNT_QUERY_KEY, ACCOUNT_QUERY_VALUE, accountHref, requestOpenAccount } from "../lib/account";
import { stripLocaleFromPathname } from "../lib/i18n/config";
import { useDictionary } from "../lib/i18n/LocaleProvider";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/env";

type AccountNavProps = {
  variant?: "desktop" | "mobile";
  onNavigated?: () => void;
};

export default function AccountNav({ variant = "desktop", onNavigated }: AccountNavProps) {
  const { auth } = useDictionary();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cleanPath = stripLocaleFromPathname(pathname);
  const isAccountPage = cleanPath === "/account";
  const resolvedAccountHref = accountHref(isAccountPage ? pathname.replace(/\/account$/, "") || "/" : pathname);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsReady(true);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setIsSignedIn(Boolean(data.user));
      setIsReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session?.user));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isMenuOpen]);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign(pathname || "/");
  }

  function openAccount() {
    setIsMenuOpen(false);
    onNavigated?.();
    if (isAccountPage) {
      return;
    }
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set(ACCOUNT_QUERY_KEY, ACCOUNT_QUERY_VALUE);
    const search = nextUrl.searchParams.toString();
    const nextPath = `${nextUrl.pathname}?${search}`;
    router.replace(nextPath, { scroll: false });
    requestOpenAccount();
  }

  if (!isReady || !isSignedIn) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <div className="mt-2 space-y-1 border-t border-[#322B2B]/10 pt-2">
        {isAccountPage ? (
          <Link
            href={pathname}
            onClick={onNavigated}
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-[#322B2B]/90"
          >
            {auth.account}
          </Link>
        ) : (
          <Link
            href={resolvedAccountHref}
            scroll={false}
            onClick={(event) => {
              event.preventDefault();
              openAccount();
            }}
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-[#322B2B]/90"
          >
            {auth.account}
          </Link>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-[#322B2B]/90 disabled:opacity-60"
        >
          {isSigningOut ? auth.signingOut : auth.signOut}
        </button>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsMenuOpen((value) => !value)}
        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        {auth.account}
      </button>
      {isMenuOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-3 min-w-[10.5rem] border border-gray-800 bg-black/95 py-1 shadow-xl"
        >
          {isAccountPage ? (
            <Link
              href={pathname}
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                onNavigated?.();
              }}
              className="block px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F4F1ED]/85 transition-colors hover:text-[#F4F1ED]"
            >
              {auth.profile}
            </Link>
          ) : (
            <Link
              href={resolvedAccountHref}
              role="menuitem"
              scroll={false}
              onClick={(event) => {
                event.preventDefault();
                openAccount();
              }}
              className="block px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F4F1ED]/85 transition-colors hover:text-[#F4F1ED]"
            >
              {auth.account}
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="block w-full px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F4F1ED]/85 transition-colors hover:text-[#F4F1ED] disabled:opacity-60"
          >
            {isSigningOut ? auth.signingOut : auth.signOut}
          </button>
        </div>
      ) : null}
    </div>
  );
}

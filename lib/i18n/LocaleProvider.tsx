"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./getDictionary";
import { withLocale } from "./config";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  /** Request host, including a niche subdomain such as `immo.example.com`. */
  publicHost: string;
  localizePath: (pathname: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  publicHost = "",
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  publicHost?: string;
  children: React.ReactNode;
}) {
  const parent = useContext(LocaleContext);
  const resolvedHost = publicHost || parent?.publicHost || "";
  const value = useMemo(
    () => ({
      locale,
      dictionary,
      publicHost: resolvedHost,
      localizePath: (pathname: string) => withLocale(pathname, locale),
    }),
    [locale, dictionary, resolvedHost]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useDictionary() {
  return useLocale().dictionary;
}

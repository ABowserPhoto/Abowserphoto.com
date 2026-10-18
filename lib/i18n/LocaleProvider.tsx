"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./getDictionary";
import { withLocale } from "./config";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  localizePath: (pathname: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      locale,
      dictionary,
      localizePath: (pathname: string) => withLocale(pathname, locale),
    }),
    [locale, dictionary]
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

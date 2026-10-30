import type { Metadata } from "next";
import { headers } from "next/headers";
import AccountModalBoundary from "../components/AccountModalBoundary";
import BookingModalBoundary from "../components/BookingModalBoundary";
import ContactClickListener from "../components/ContactClickListener";
import CookieConsent from "../components/CookieConsent";
import GoogleAnalytics from "../components/GoogleAnalytics";
import JsonLd from "../components/JsonLd";
import { defaultLocale, isLocale } from "../lib/i18n/config";
import { getDictionary } from "../lib/i18n/getDictionary";
import { LocaleProvider } from "../lib/i18n/LocaleProvider";
import { buildRootMetadata } from "../lib/i18n/seo";
import "./globals.css";

export const metadata: Metadata = buildRootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-locale");
  const lang = headerLocale && isLocale(headerLocale) ? headerLocale : defaultLocale;
  const dictionary = await getDictionary(lang);
  const publicHost = headerStore.get("host") ?? "";

  return (
    <html lang={lang}>
      <body className="overflow-x-hidden bg-black text-[#F4F1ED] antialiased">
        <LocaleProvider locale={lang} dictionary={dictionary} publicHost={publicHost}>
          <JsonLd />
          {children}
          <BookingModalBoundary />
          <AccountModalBoundary />
          <CookieConsent />
          <GoogleAnalytics />
          <ContactClickListener />
        </LocaleProvider>
      </body>
    </html>
  );
}

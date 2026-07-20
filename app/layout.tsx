import type { Metadata } from "next";
import CookieConsent from "../components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abowser Photo Portfolio",
  description: "Multi-niche photography portfolio built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden bg-black text-[#F4F1ED] antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}

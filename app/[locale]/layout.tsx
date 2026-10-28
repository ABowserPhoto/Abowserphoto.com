import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { LocaleProvider } from "../../lib/i18n/LocaleProvider";
import { isLocale, locales, type Locale } from "../../lib/i18n/config";
import { getDictionary } from "../../lib/i18n/getDictionary";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  let icon = "/favicon-main.ico";
  let apple = "/apple-icon-main.png";

  if (host.startsWith("immo.")) {
    icon = "/favicon-immo.ico";
    apple = "/apple-icon-immo.png";
  } else if (host.startsWith("food.")) {
    icon = "/favicon-food.ico";
    apple = "/apple-icon-food.png";
  }

  return {
    icons: {
      icon,
      apple,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      {children}
    </LocaleProvider>
  );
}

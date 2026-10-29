import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import CommercialPortfolioArchive from "../../../../components/CommercialPortfolioArchive";
import { categoryContentMap } from "../../../../lib/content";
import { readPortfolio } from "../../../../lib/gallery";
import { isLocale, locales, type Locale } from "../../../../lib/i18n/config";
import { getDictionary } from "../../../../lib/i18n/getDictionary";
import { buildSimplePageMetadata } from "../../../../lib/i18n/seo";
import { categorySegment, resolveCategorySegment } from "../../../../lib/routes";

type PageProps = {
  params: Promise<{ locale: string; category: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
    category: categorySegment("commercial", locale),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, category } = await params;
  if (!isLocale(rawLocale) || resolveCategorySegment(category) !== "commercial") return {};
  const host = (await headers()).get("host");
  return buildSimplePageMetadata(rawLocale, "commercial-portfolio", host);
}

export default async function CommercialPortfolioPage({ params }: PageProps) {
  const { locale: rawLocale, category } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const slug = resolveCategorySegment(category);
  if (slug !== "commercial") notFound();
  if (category !== categorySegment("commercial", locale)) {
    permanentRedirect(`/${locale}/${categorySegment("commercial", locale)}/portfolio`);
  }

  const dictionary = await getDictionary(locale);

  return (
    <CommercialPortfolioArchive
      images={readPortfolio("commercial", locale)}
      themeColor={categoryContentMap.commercial.themeColor}
      locale={locale}
      dictionary={dictionary}
    />
  );
}

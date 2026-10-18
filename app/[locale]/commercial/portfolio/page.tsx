import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommercialPortfolioArchive from "../../../../components/CommercialPortfolioArchive";
import { categoryContentMap } from "../../../../lib/content";
import { isLocale, type Locale } from "../../../../lib/i18n/config";
import { getDictionary } from "../../../../lib/i18n/getDictionary";
import { buildSimplePageMetadata } from "../../../../lib/i18n/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  return buildSimplePageMetadata(rawLocale, "commercial-portfolio");
}

export default async function CommercialPortfolioPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);
  const category = categoryContentMap.commercial;
  const directoryPath = path.join(process.cwd(), "public", "commercial", "portfolio");
  let portfolioImages: string[] = [];

  try {
    const files = fs.readdirSync(directoryPath);
    portfolioImages = files
      .filter((file) => !file.startsWith("."))
      .map((file) => `/commercial/portfolio/${file}`);
  } catch {
    portfolioImages = [];
  }

  return (
    <CommercialPortfolioArchive
      images={portfolioImages}
      themeColor={category.themeColor}
      locale={locale}
      dictionary={dictionary}
    />
  );
}

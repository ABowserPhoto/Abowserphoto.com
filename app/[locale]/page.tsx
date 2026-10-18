import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePortal from "../../components/HomePortal";
import { getCategoryHeroes, getLogoUrl } from "../../lib/cms";
import { categoryNavigation } from "../../lib/content";
import { isLocale, type Locale } from "../../lib/i18n/config";
import { getDictionary } from "../../lib/i18n/getDictionary";
import { buildHomeMetadata } from "../../lib/i18n/seo";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  return buildHomeMetadata(rawLocale);
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);
  const categorySlugs = categoryNavigation.map((item) => item.slug);
  const categoryHeroes = getCategoryHeroes(categorySlugs);
  const logoUrl = getLogoUrl();

  return (
    <HomePortal
      categoryHeroes={categoryHeroes}
      logoUrl={logoUrl}
      locale={locale}
      dictionary={dictionary}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePortal from "../../components/HomePortal";
import { getLogoUrl } from "../../lib/cms";
import { readHomeBaseImages, readHomeIntroVideo, readPortalHeroSets } from "../../lib/gallery";
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
  const logoUrl = getLogoUrl();
  const introVideoUrl = readHomeIntroVideo(locale);
  const baseImages = readHomeBaseImages(locale);
  const portalHeroes = readPortalHeroSets(locale);

  return (
    <HomePortal
      logoUrl={logoUrl}
      introVideoUrl={introVideoUrl}
      baseImages={baseImages}
      portalHeroes={portalHeroes}
      locale={locale}
      dictionary={dictionary}
    />
  );
}

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import OfferPage from "../../../components/OfferPage";
import { getLogoUrl } from "../../../lib/cms";
import { isLocale, withLocale, type Locale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/getDictionary";
import { buildOfferMetadata } from "../../../lib/i18n/seo";
import { printsPath } from "../../../lib/routes";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildOfferMetadata(locale, "prints");
}

export default async function WallArtPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  if (rawLocale !== "en") {
    permanentRedirect(withLocale(printsPath("de"), "de"));
  }
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);
  return (
    <OfferPage kind="prints" locale={locale} dictionary={dictionary} logoUrl={getLogoUrl()} />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalDocument from "../../../components/LegalDocument";
import { getLogoUrl } from "../../../lib/cms";
import { isLocale, type Locale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/getDictionary";
import { buildLegalMetadata } from "../../../lib/i18n/seo";
import { getLegalDocument } from "../../../lib/legalContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildLegalMetadata(locale, "impressum");
}

export default async function ImpressumPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <LegalDocument
      document={getLegalDocument("/impressum", locale)}
      locale={locale}
      dictionary={dictionary}
      logoUrl={getLogoUrl()}
    />
  );
}

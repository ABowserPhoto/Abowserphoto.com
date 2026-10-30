import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import SolingenStudioPage from "../../../components/SolingenStudioPage";
import { getLogoUrl } from "../../../lib/cms";
import { isLocale, type Locale } from "../../../lib/i18n/config";
import { withLocale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/getDictionary";
import { buildSolingenStudioMetadata } from "../../../lib/i18n/seo";
import { solingenStudioPath } from "../../../lib/routes";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildSolingenStudioMetadata(locale);
}

export default async function EnglishSolingenStudioPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  if (rawLocale !== "en") {
    permanentRedirect(withLocale(solingenStudioPath("de"), "de"));
  }
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);
  const publicHost = (await headers()).get("host") ?? "";

  return (
    <SolingenStudioPage
      locale={locale}
      dictionary={dictionary}
      logoUrl={getLogoUrl()}
      publicHost={publicHost}
    />
  );
}

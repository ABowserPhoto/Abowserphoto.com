import type { Metadata } from "next";
import { isLocale } from "../../../lib/i18n/config";
import { buildSimplePageMetadata } from "../../../lib/i18n/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildSimplePageMetadata(locale, "book");
}

export default function BookPage() {
  return <main className="min-h-screen bg-[#000000]" />;
}

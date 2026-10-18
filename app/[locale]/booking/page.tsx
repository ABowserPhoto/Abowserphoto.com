import { redirect } from "next/navigation";
import { isLocale, withLocale } from "../../../lib/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BookingRedirectPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    redirect("/en/book");
  }
  redirect(withLocale("/book", locale));
}

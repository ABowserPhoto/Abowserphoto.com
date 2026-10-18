import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AccountNav from "../../../components/AccountNav";
import AccountPortal from "../../../components/AccountPortal";
import SiteLogo from "../../../components/SiteLogo";
import { bookingHref } from "../../../lib/booking";
import { getLogoUrl } from "../../../lib/cms";
import { isLocale, withLocale, type Locale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/getDictionary";
import { buildSimplePageMetadata } from "../../../lib/i18n/seo";
import { createClient } from "../../../lib/supabase/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  return buildSimplePageMetadata(rawLocale, "account");
}

export default async function AccountPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect(withLocale("/", locale));
  }

  const user = userData.user;
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select(
      "first_name, last_name, contact_name, company_name, company_address, billing_address, phone_number, is_approved"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (clientError) {
    throw new Error(clientError.message);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  const logoUrl = getLogoUrl();
  const homeHref = withLocale("/", locale);
  const bookHref = bookingHref(withLocale("/account", locale));

  return (
    <main className="min-h-screen bg-black text-[#F4F1ED]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-3xl items-center justify-between px-5 sm:px-8">
          <SiteLogo
            logoUrl={logoUrl}
            href={homeHref}
            className="flex items-center gap-2.5 text-[#F4F1ED]"
            imageClassName="h-9 w-9 object-contain brightness-0 invert"
            labelClassName="sr-only"
          />
          <nav className="flex items-center gap-6">
            <Link
              href={homeHref}
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#F4F1ED]/80"
            >
              {dictionary.nav.home}
            </Link>
            <Link
              href={bookHref}
              scroll={false}
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F4F1ED]"
            >
              {dictionary.nav.book}
            </Link>
            <AccountNav />
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <AccountPortal
          email={user.email ?? ""}
          isApproved={Boolean(client?.is_approved)}
          initialValues={{
            firstName: client?.first_name || profile?.full_name?.split(/\s+/)[0] || "",
            lastName:
              client?.last_name || profile?.full_name?.split(/\s+/).slice(1).join(" ") || "",
            companyName: client?.company_name || "",
            companyAddress: client?.company_address || client?.billing_address || "",
            phoneNumber: client?.phone_number || "",
          }}
        />
      </section>
    </main>
  );
}

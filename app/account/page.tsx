import Link from "next/link";
import { redirect } from "next/navigation";
import AccountNav from "../../components/AccountNav";
import AccountProfileForm from "../../components/AccountProfileForm";
import SiteLogo from "../../components/SiteLogo";
import { bookingHref } from "../../lib/booking";
import { getLogoUrl } from "../../lib/cms";
import { createClient } from "../../lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/");
  }

  const user = userData.user;
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("first_name, last_name, contact_name, company_name, company_address, billing_address, phone_number, is_approved")
    .eq("user_id", user.id)
    .maybeSingle();

  if (clientError) {
    throw new Error(clientError.message);
  }

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
  const logoUrl = getLogoUrl();
  const bookHref = bookingHref("/account");

  return (
    <main className="min-h-screen bg-black text-[#F4F1ED]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-3xl items-center justify-between px-5 sm:px-8">
          <SiteLogo
            logoUrl={logoUrl}
            className="flex items-center gap-2.5 text-[#F4F1ED]"
            imageClassName="h-9 w-9 object-contain brightness-0 invert"
            labelClassName="sr-only"
          />
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#F4F1ED]/80">
              Home
            </Link>
            <Link href={bookHref} scroll={false} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F4F1ED]">
              Book
            </Link>
            <AccountNav />
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-xl px-5 py-16 sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#F4F1ED]/60">Client Account</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Your profile</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#F4F1ED]/75">
          Update the details used for bookings, invoices, and calendar events.
        </p>

        <div className="mt-10">
          <AccountProfileForm
            email={user.email ?? ""}
            isApproved={Boolean(client?.is_approved)}
            initialValues={{
              firstName: client?.first_name || profile?.full_name?.split(/\s+/)[0] || "",
              lastName: client?.last_name || profile?.full_name?.split(/\s+/).slice(1).join(" ") || "",
              companyName: client?.company_name || "",
              companyAddress: client?.company_address || client?.billing_address || "",
              phoneNumber: client?.phone_number || "",
            }}
          />
        </div>
      </section>
    </main>
  );
}

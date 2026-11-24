import Link from "next/link";
import { bookingHref } from "../lib/booking";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  contactEmailHref,
  contactWhatsAppHref,
} from "../lib/contact";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";

type QuoteCloseProps = {
  locale: Locale;
  mode: "shoot" | "consult";
};

export default function QuoteClose({ locale, mode }: QuoteCloseProps) {
  const de = locale === "de";
  const action =
    mode === "consult"
      ? de
        ? "Beratung anfragen"
        : "Request a consultation"
      : de
        ? "Shooting buchen"
        : "Book a shoot";
  const formHref = bookingHref(withLocale("/", locale));
  const linkClass =
    "underline decoration-[#322B2B]/40 underline-offset-[3px] transition-colors duration-300 hover:text-[#E18400]";

  return (
    <p className="mt-8 text-sm leading-relaxed text-[#322B2B]/90">
      <span className="font-medium">{de ? "Angebot anfragen" : "Request a quote"}: </span>
      {de ? "per " : "by "}
      <Link href={formHref} scroll={false} className={linkClass}>
        {de ? "Kontaktformular" : "contact form"}
      </Link>
      {de ? ", E-Mail an " : ", email at "}
      <a href={contactEmailHref()} className={linkClass}>
        {CONTACT_EMAIL}
      </a>
      {de ? " oder WhatsApp " : " or WhatsApp "}
      <a href={contactWhatsAppHref()} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {CONTACT_PHONE_DISPLAY}
      </a>
      {de ? ". Oder direkt: " : ". Or go straight to: "}
      <Link href={formHref} scroll={false} className={linkClass}>
        {action}
      </Link>
      .
    </p>
  );
}

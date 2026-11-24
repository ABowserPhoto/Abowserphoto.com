"use server";

import { sendGuestEnquiryEmail } from "../lib/mail";
import { getBookingCopy, resolveLocale } from "../lib/i18n/messages";

export type GuestEnquiryInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  topic: string;
  locale?: string;
  /** Left empty by people. Filled by bots. */
  website?: string;
};

export type GuestEnquiryResult = {
  success: boolean;
  message: string;
};

function sanitizeLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitGuestEnquiry(input: GuestEnquiryInput): Promise<GuestEnquiryResult> {
  const locale = resolveLocale(input.locale);
  const booking = getBookingCopy(locale);

  if ((input.website ?? "").trim()) {
    return { success: true, message: booking.enquirySent };
  }

  const name = sanitizeLine(input.name ?? "");
  const email = sanitizeLine(input.email ?? "");
  const phone = sanitizeLine(input.phone ?? "");
  const message = (input.message ?? "").replace(/\r\n/g, "\n").trim().slice(0, 4000);
  const topic = sanitizeLine(input.topic ?? "").slice(0, 80);

  if (!name || !email || !phone || !message || !isValidEmail(email)) {
    return { success: false, message: booking.completeFields };
  }

  const sent = await sendGuestEnquiryEmail({ name, email, phone, message, topic, locale });
  if (!sent) {
    return { success: false, message: booking.enquiryFailed };
  }

  return { success: true, message: booking.enquirySent };
}

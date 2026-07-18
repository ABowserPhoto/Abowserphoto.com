"use server";

import { google } from "googleapis";
import nodemailer from "nodemailer";

export type BookingFormData = {
  fullName: string;
  email: string;
  phone: string;
  requestedDate: string;
  service: string;
  description: string;
};

export type SubmitBookingResult = {
  success: boolean;
  message: string;
};

function getPrivateKey() {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

async function createCalendarEvent(data: BookingFormData) {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!clientEmail || !privateKey || !calendarId) {
    throw new Error("Google Calendar environment variables are not configured.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });
  const startDate = new Date(`${data.requestedDate}T10:00:00`);
  const endDate = new Date(`${data.requestedDate}T11:00:00`);

  await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `${data.fullName} — Booking Request`,
      description: [
        `Name: ${data.fullName}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Requested Date: ${data.requestedDate}`,
        `Service: ${data.service}`,
        "",
        "Project Description:",
        data.description || "No additional details provided.",
      ].join("\n"),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: process.env.BOOKING_TIMEZONE ?? "Europe/Berlin",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: process.env.BOOKING_TIMEZONE ?? "Europe/Berlin",
      },
    },
  });
}

async function sendBookingEmail(data: BookingFormData) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL ?? user;

  if (!host || !user || !pass || !notifyEmail) {
    throw new Error("Email notification environment variables are not configured.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const body = [
    "New booking request received:",
    "",
    `Full Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Requested Date: ${data.requestedDate}`,
    `Service: ${data.service}`,
    "",
    "Project Description:",
    data.description || "No additional details provided.",
  ].join("\n");

  await transporter.sendMail({
    from: user,
    to: notifyEmail,
    replyTo: data.email,
    subject: `New Booking Request — ${data.fullName}`,
    text: body,
  });
}

export async function submitBooking(data: BookingFormData): Promise<SubmitBookingResult> {
  if (!data.fullName.trim() || !data.email.trim() || !data.phone.trim() || !data.requestedDate || !data.service.trim()) {
    return { success: false, message: "Please complete all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    await Promise.all([createCalendarEvent(data), sendBookingEmail(data)]);
    return {
      success: true,
      message: "Your request has been received. We will review your details and be in touch shortly.",
    };
  } catch (error) {
    console.error("Booking submission failed:", error);
    return {
      success: false,
      message: "We could not submit your request right now. Please try again shortly.",
    };
  }
}

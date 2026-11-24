import nodemailer from "nodemailer";
import {
  buildBusinessRequestEmail,
  buildClientConfirmedEmail,
  buildClientDeclinedEmail,
  buildClientReceivedEmail,
  studioReplyTo,
} from "./bookingEmails";
import type { RequestDetails } from "./bookingDetails";

export type NewClientRegistrationDetails = {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  locale?: string;
};

function sanitize(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function headerValue(value: string) {
  return value.replace(/[\r\n]+/g, "").trim();
}

function uniqueEmails(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const cleaned = headerValue(value ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(cleaned);
  }
  return result;
}

function openSmtp() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? 587);
  if (!host || !user || !pass || !Number.isFinite(port)) return null;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    socketTimeout: 20_000,
  });

  const from =
    user.includes("@") && !/[\r\n]/.test(user)
      ? { name: "Aaron Bowser Photography", address: user }
      : user;

  return { transporter, user, from };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "send failed";
}

export async function sendAdminRegistrationEmail(details: NewClientRegistrationDetails) {
  try {
    const smtp = openSmtp();
    const to = headerValue(process.env.BOOKING_NOTIFY_EMAIL || smtp?.user || "");
    const crmUrl = (process.env.CRM_APP_URL ?? "").replace(/\/$/, "");

    if (!smtp || !to) {
      console.error("Admin registration email skipped: SMTP is not configured.");
      return;
    }

    const firstName = sanitize(details.firstName);
    const lastName = sanitize(details.lastName);
    const companyName = sanitize(details.companyName);
    const email = sanitize(details.email);
    const reminder = crmUrl
      ? `Please log into the Workflow CRM to review and approve this client: ${crmUrl}`
      : "Please log into the Workflow CRM to review and approve this client.";
    const preferredLocale = sanitize(details.locale ?? "en").toUpperCase();

    const text = [
      "A new client has registered on the website and is pending approval.",
      "",
      `First Name: ${firstName}`,
      `Last Name: ${lastName}`,
      `Company Name: ${companyName}`,
      `Email Address: ${email}`,
      `Preferred Language: ${preferredLocale}`,
      "",
      reminder,
    ].join("\n");

    const html = `
      <p>A new client has registered on the website and is pending approval.</p>
      <p>
        <strong>First Name:</strong> ${escapeHtml(firstName)}<br />
        <strong>Last Name:</strong> ${escapeHtml(lastName)}<br />
        <strong>Company Name:</strong> ${escapeHtml(companyName)}<br />
        <strong>Email Address:</strong> ${escapeHtml(email)}<br />
        <strong>Preferred Language:</strong> ${escapeHtml(preferredLocale)}
      </p>
      <p>${
        crmUrl
          ? `Please log into the <a href="${escapeHtml(crmUrl)}">Workflow CRM</a> to review and approve this client.`
          : "Please log into the Workflow CRM to review and approve this client."
      }</p>
    `.trim();

    await smtp.transporter.sendMail({
      from: smtp.user,
      to,
      subject: "New Client Registration: Pending Approval",
      text,
      html,
    });
  } catch (error) {
    console.error("Admin registration email failed:", error);
  }
}

export async function sendShootRequestEmails(details: RequestDetails, token: string) {
  const smtp = openSmtp();
  if (!smtp) {
    console.error("Booking request emails skipped: SMTP is not configured.");
    return;
  }

  const notify = headerValue(process.env.BOOKING_NOTIFY_EMAIL ?? "");
  if (!notify) {
    console.error("Business booking email skipped: BOOKING_NOTIFY_EMAIL is not set.");
  } else {
    try {
      const message = buildBusinessRequestEmail(details, token);
      await smtp.transporter.sendMail({
        from: smtp.from,
        to: notify,
        replyTo: headerValue(details.contactEmail),
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
    } catch (error) {
      console.error("Business booking email failed:", errorMessage(error));
    }
  }

  const recipients = uniqueEmails([details.contactEmail, details.accountEmail]);
  if (recipients.length === 0) {
    console.error("Client request email skipped: no recipient address.");
    return;
  }

  try {
    const message = buildClientReceivedEmail(details);
    await smtp.transporter.sendMail({
      from: smtp.from,
      to: recipients,
      replyTo: studioReplyTo(),
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  } catch (error) {
    console.error("Client request email failed:", errorMessage(error));
  }
}

function decisionMessage(details: RequestDetails, decision: "confirmed" | "declined") {
  switch (decision) {
    case "confirmed":
      return buildClientConfirmedEmail(details);
    case "declined":
      return buildClientDeclinedEmail(details);
    default: {
      const neverDecision: never = decision;
      throw new Error(`Unexpected decision email: ${String(neverDecision)}`);
    }
  }
}

export async function sendGuestEnquiryEmail(details: {
  name: string;
  email: string;
  phone: string;
  message: string;
  topic: string;
  locale: string;
}) {
  const smtp = openSmtp();
  const to = headerValue(process.env.BOOKING_NOTIFY_EMAIL || smtp?.user || "");
  if (!smtp || !to) {
    console.error("Guest enquiry email skipped: SMTP is not configured.");
    return false;
  }

  const name = sanitize(details.name);
  const email = headerValue(details.email);
  const phone = sanitize(details.phone);
  const topic = sanitize(details.topic) || "Allgemein";
  const message = details.message.replace(/\r\n/g, "\n").trim().slice(0, 4000);
  const locale = sanitize(details.locale).toUpperCase();

  const text = [
    "Anfrage ohne Kundenkonto",
    "",
    `Thema: ${topic}`,
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone}`,
    `Sprache: ${locale}`,
    "",
    message,
  ].join("\n");

  const html = `
    <p>Anfrage ohne Kundenkonto</p>
    <p>
      <strong>Thema:</strong> ${escapeHtml(topic)}<br />
      <strong>Name:</strong> ${escapeHtml(name)}<br />
      <strong>E-Mail:</strong> ${escapeHtml(email)}<br />
      <strong>Telefon:</strong> ${escapeHtml(phone)}<br />
      <strong>Sprache:</strong> ${escapeHtml(locale)}
    </p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `.trim();

  try {
    await smtp.transporter.sendMail({
      from: smtp.from,
      to,
      replyTo: email,
      subject: `Anfrage ohne Konto: ${topic}`,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error("Guest enquiry email failed:", errorMessage(error));
    return false;
  }
}

export async function sendShootDecisionEmail(
  details: RequestDetails,
  decision: "confirmed" | "declined"
) {
  const smtp = openSmtp();
  if (!smtp) {
    console.error("Client decision email skipped: SMTP is not configured.");
    return false;
  }

  const recipients = uniqueEmails([details.contactEmail, details.accountEmail]);
  if (recipients.length === 0) {
    console.error("Client decision email skipped: no recipient address.");
    return false;
  }

  const message = decisionMessage(details, decision);

  try {
    await smtp.transporter.sendMail({
      from: smtp.from,
      to: recipients,
      replyTo: studioReplyTo(),
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return true;
  } catch (error) {
    console.error("Client decision email failed:", errorMessage(error));
    return false;
  }
}

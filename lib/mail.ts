import nodemailer from "nodemailer";

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

export async function sendAdminRegistrationEmail(details: NewClientRegistrationDetails) {
  try {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const to = process.env.BOOKING_NOTIFY_EMAIL || smtpUser;
    const crmUrl = (process.env.CRM_APP_URL ?? "").replace(/\/$/, "");

    if (!host || !smtpUser || !smtpPass || !to) {
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

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpUser,
      to,
      subject: "New Client Registration: Pending Approval",
      text,
      html,
    });
  } catch (error) {
    console.error("Admin registration email failed:", error);
  }
}

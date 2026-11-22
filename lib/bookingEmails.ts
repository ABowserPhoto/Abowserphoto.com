import {
  adminDetailRows,
  clientDetailRows,
  escapeHtml,
  safeHttpUrl,
  studioContactLines,
  textToHtml,
  type DetailRow,
  type RequestDetails,
} from "./bookingDetails";
import { CONTACT_EMAIL } from "./contact";
import { SITE_URL } from "./site";

export type EmailMessage = {
  subject: string;
  text: string;
  html: string;
};

const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'Major Mono Display', 'Courier New', Courier, monospace";

export function requestActionOrigin() {
  if (process.env.VERCEL_ENV === "preview") {
    const host = (process.env.VERCEL_URL ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (host) return `https://${host}`;
  }
  return SITE_URL;
}

export function decisionUrls(token: string) {
  const origin = requestActionOrigin().replace(/\/$/, "");
  const query = encodeURIComponent(token);
  return {
    approve: `${origin}/api/booking/approve?token=${query}`,
    decline: `${origin}/api/booking/decline?token=${query}`,
  };
}

function rowsToText(rows: DetailRow[]) {
  return rows.map((row) => `${row.label}: ${row.value}`).join("\n");
}

function renderValue(value: string) {
  const url = safeHttpUrl(value);
  if (url && url === value) {
    const safe = escapeHtml(url);
    return `<a href="${safe}" style="color:#322B2B;">${safe}</a>`;
  }
  return textToHtml(value);
}

function renderRows(rows: DetailRow[]) {
  return rows
    .map(
      (row) => `
        <tr>
          <td style="padding:8px 16px 8px 0;vertical-align:top;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(50,43,43,0.62);white-space:nowrap;">${escapeHtml(row.label)}</td>
          <td style="padding:8px 0;vertical-align:top;font-size:15px;line-height:1.5;color:#322B2B;">${renderValue(row.value)}</td>
        </tr>`
    )
    .join("");
}

function renderActions(actions: Array<{ href: string; label: string; tone: "primary" | "secondary" }>) {
  if (actions.length === 0) return "";
  const cells = actions
    .map((action, index) => {
      const gap = index === 0 ? "" : `<td style="width:12px;font-size:0;line-height:0;">&nbsp;</td>`;
      const link =
        action.tone === "primary"
          ? `<a href="${escapeHtml(action.href)}" style="display:inline-block;padding:14px 22px;background:#322B2B;color:#F4F1ED;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;">${escapeHtml(action.label)}</a>`
          : `<a href="${escapeHtml(action.href)}" style="display:inline-block;padding:13px 22px;border:1px solid #322B2B;color:#322B2B;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;">${escapeHtml(action.label)}</a>`;
      return `${gap}<td style="vertical-align:middle;">${link}</td>`;
    })
    .join("");

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
      <tr>${cells}</tr>
    </table>
    <p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:rgba(50,43,43,0.72);">Der Link öffnet eine Seite. Erst der Button auf der Seite entscheidet. Das Öffnen der E-Mail ändert nichts.</p>`;
}

function documentFor(input: {
  lang: "de" | "en";
  preheader: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  rows: DetailRow[];
  actions?: Array<{ href: string; label: string; tone: "primary" | "secondary" }>;
  footer: string[];
}) {
  const paragraphHtml = input.paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#322B2B;">${textToHtml(paragraph)}</p>`
    )
    .join("");
  const footerHtml = input.footer
    .map(
      (line) =>
        `<p style="margin:0;font-size:13px;line-height:1.6;color:rgba(50,43,43,0.72);">${textToHtml(line)}</p>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="${input.lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&amp;display=swap" />
    <title>${escapeHtml(input.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#F4F1ED;color:#322B2B;font-family:${FONT};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1ED;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#F4F1ED;">
            <tr>
              <td style="padding:8px 0 28px;border-bottom:1px solid rgba(50,43,43,0.12);">
                <div style="font-family:${MONO};font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#322B2B;">Aaron Bowser</div>
                <div style="margin-top:6px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(50,43,43,0.62);">Photography</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 0 0;">
                <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(50,43,43,0.62);">${escapeHtml(input.eyebrow)}</p>
                <h1 style="margin:12px 0 20px;font-size:32px;line-height:1.15;font-weight:300;letter-spacing:-0.02em;color:#322B2B;">${escapeHtml(input.title)}</h1>
                ${paragraphHtml}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">${renderRows(input.rows)}</table>
                ${renderActions(input.actions ?? [])}
                <div style="margin-top:28px;padding-top:18px;border-top:1px solid rgba(50,43,43,0.12);">${footerHtml}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    input.title,
    "",
    ...input.paragraphs,
    "",
    rowsToText(input.rows),
    ...(input.actions ?? []).flatMap((action) => ["", `${action.label}: ${action.href}`]),
    "",
    ...input.footer,
  ].join("\n");

  return { html, text };
}

function subjectWhen(details: RequestDetails) {
  return details.companyName;
}

export function buildBusinessRequestEmail(details: RequestDetails, token: string): EmailMessage {
  const links = decisionUrls(token);
  const when = adminDetailRows(details).find((row) => row.label === "Termin")?.value ?? details.requestedDate;
  const { html, text } = documentFor({
    lang: "de",
    preheader: "Neue Buchungsanfrage, noch nicht bestätigt.",
    eyebrow: "Buchung",
    title: "Neue Buchungsanfrage",
    paragraphs: [
      "Eine neue Anfrage wartet auf Ihre Entscheidung. Der Termin ist im Kalender als ANFRAGE vorgemerkt und noch nicht bestätigt.",
    ],
    rows: adminDetailRows(details),
    actions: [
      { href: links.approve, label: "Annehmen", tone: "primary" },
      { href: links.decline, label: "Ablehnen", tone: "secondary" },
    ],
    footer: studioContactLines("de"),
  });

  return {
    subject: `Neue Buchungsanfrage: ${subjectWhen(details)} – ${when}`,
    html,
    text,
  };
}

export function buildClientReceivedEmail(details: RequestDetails): EmailMessage {
  const de = details.locale === "de";
  const { html, text } = documentFor({
    lang: details.locale,
    preheader: de ? "Ihre Anfrage ist eingegangen und noch nicht bestätigt." : "Your request has been received and is not confirmed yet.",
    eyebrow: de ? "Anfrage" : "Request",
    title: de ? "Anfrage erhalten" : "Request received",
    paragraphs: de
      ? [
          `Guten Tag ${details.contactName},`,
          "wir haben Ihre Anfrage erhalten. Der Termin ist noch nicht bestätigt. Wir prüfen die Angaben und melden uns in Kürze.",
          "Dies ist eine Eingangsbestätigung, keine Terminbestätigung.",
        ]
      : [
          `Hello ${details.contactName},`,
          "we have received your request. The time is not confirmed yet. We will review it and write to you shortly.",
          "This message only confirms that we received your request. It is not a booking confirmation.",
        ],
    rows: clientDetailRows(details),
    footer: studioContactLines(details.locale),
  });

  return {
    subject: de ? "Anfrage erhalten" : "Request received",
    html,
    text,
  };
}

export function buildClientConfirmedEmail(details: RequestDetails): EmailMessage {
  const de = details.locale === "de";
  const { html, text } = documentFor({
    lang: details.locale,
    preheader: de ? "Ihr Termin ist bestätigt." : "Your booking is confirmed.",
    eyebrow: de ? "Buchung" : "Booking",
    title: de ? "Termin bestätigt" : "Your booking is confirmed",
    paragraphs: de
      ? [`Guten Tag ${details.contactName},`, "Ihr Termin ist bestätigt. Wir freuen uns auf das Shooting."]
      : [`Hello ${details.contactName},`, "Your booking is confirmed. We look forward to the shoot."],
    rows: clientDetailRows(details),
    footer: studioContactLines(details.locale),
  });

  return {
    subject: de ? "Termin bestätigt" : "Your booking is confirmed",
    html,
    text,
  };
}

export function buildClientDeclinedEmail(details: RequestDetails): EmailMessage {
  const de = details.locale === "de";
  const when = clientDetailRows(details).find((row) => row.label === "Termin" || row.label === "Time")?.value ?? "";
  const { html, text } = documentFor({
    lang: details.locale,
    preheader: de ? "Bitte wählen Sie eine andere Zeit." : "Please choose another time.",
    eyebrow: de ? "Anfrage" : "Request",
    title: de ? "Zum Wunschtermin" : "About your requested time",
    paragraphs: de
      ? [
          `Guten Tag ${details.contactName},`,
          `vielen Dank für Ihre Anfrage. Den gewünschten Termin (${when}) können wir leider nicht bestätigen.`,
          "Bitte wählen Sie eine andere Zeit über die Website. Wir helfen gern bei einem neuen Termin.",
        ]
      : [
          `Hello ${details.contactName},`,
          `thank you for your request. We are not able to confirm the time you asked for (${when}).`,
          "Please choose another time on the website. We would be glad to find a new one with you.",
        ],
    rows: clientDetailRows(details),
    footer: studioContactLines(details.locale),
  });

  return {
    subject: de ? "Zum Wunschtermin" : "About your requested time",
    html,
    text,
  };
}

export function studioReplyTo() {
  return CONTACT_EMAIL;
}

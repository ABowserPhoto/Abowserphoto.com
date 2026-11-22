import { escapeHtml, safeHttpUrl, textToHtml, type DetailRow } from "./bookingDetails";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, contactEmailHref, contactPhoneHref } from "./contact";
import { BRAND_NAME, SITE_URL } from "./site";

export type DecisionAction = "approve" | "decline";

export type DecisionPageModel =
  | { state: "confirm"; action: DecisionAction; token: string; rows: DetailRow[] }
  | { state: "completed"; action: DecisionAction; emailSent: boolean; rows: DetailRow[] }
  | { state: "already"; status: "confirmed" | "declined"; rows: DetailRow[] }
  | { state: "invalid" }
  | { state: "failed"; rows: DetailRow[] | null };

const ACTION_COPY = {
  approve: {
    title: "Anfrage annehmen",
    intro:
      "Der Termin ist noch eine Anfrage. Erst der Button auf dieser Seite bestätigt ihn und schreibt dem Kunden. Das Öffnen des Links allein ändert nichts.",
    button: "Anfrage annehmen",
    done: "Die Anfrage ist angenommen. Der Termin ist bestätigt.",
  },
  decline: {
    title: "Anfrage ablehnen",
    intro:
      "Der Termin ist noch eine Anfrage. Erst der Button auf dieser Seite lehnt ihn ab, gibt die Uhrzeit frei und bittet den Kunden, eine andere Zeit zu wählen.",
    button: "Anfrage ablehnen",
    done: "Die Anfrage ist abgelehnt. Die Uhrzeit ist wieder frei.",
  },
} as const;

function actionPath(action: DecisionAction) {
  switch (action) {
    case "approve":
      return "/api/booking/approve";
    case "decline":
      return "/api/booking/decline";
    default: {
      const neverAction: never = action;
      return neverAction;
    }
  }
}

function renderValue(value: string) {
  const url = safeHttpUrl(value);
  if (url && url === value) return `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`;
  return textToHtml(value);
}

function renderRows(rows: DetailRow[]) {
  if (rows.length === 0) return "";
  const items = rows
    .map(
      (row) => `
        <div style="padding:12px 0;border-top:1px solid rgba(50,43,43,0.12);">
          <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(50,43,43,0.62);">${escapeHtml(row.label)}</div>
          <div style="margin-top:4px;font-size:16px;line-height:1.5;">${renderValue(row.value)}</div>
        </div>`
    )
    .join("");
  return `<div style="margin-top:28px;">${items}</div>`;
}

export function renderDecisionPage(model: DecisionPageModel) {
  const home = `${SITE_URL}/de`;
  let title = "Buchungsanfrage";
  let intro = "";
  let extra = "";
  let rows: DetailRow[] = [];
  let form = "";

  switch (model.state) {
    case "confirm": {
      const copy = ACTION_COPY[model.action];
      title = copy.title;
      intro = copy.intro;
      rows = model.rows;
      form = `<form method="post" action="${actionPath(model.action)}" style="margin-top:32px;">
        <input type="hidden" name="token" value="${escapeHtml(model.token)}" autocomplete="off" />
        <button type="submit" style="appearance:none;border:0;background:#322B2B;color:#F4F1ED;padding:14px 22px;font:inherit;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;">${escapeHtml(copy.button)}</button>
      </form>`;
      break;
    }
    case "completed": {
      const copy = ACTION_COPY[model.action];
      title = copy.title;
      intro = copy.done;
      rows = model.rows;
      if (!model.emailSent) {
        extra =
          "Die E-Mail an den Kunden konnte nicht gesendet werden. Bitte schreiben Sie der Kontaktperson direkt.";
      }
      break;
    }
    case "already":
      title = model.status === "confirmed" ? "Bereits angenommen" : "Bereits abgelehnt";
      intro =
        model.status === "confirmed"
          ? "Diese Anfrage wurde bereits angenommen."
          : "Diese Anfrage wurde bereits abgelehnt.";
      rows = model.rows;
      break;
    case "invalid":
      title = "Link ungültig";
      intro = "Dieser Link ist ungültig.";
      break;
    case "failed":
      title = "Entscheidung offen";
      intro =
        "Die Entscheidung konnte nicht abgeschlossen werden. Die Anfrage ist weiterhin offen. Bitte öffnen Sie den Link aus der E-Mail erneut.";
      rows = model.rows ?? [];
      break;
    default: {
      const neverModel: never = model;
      title = neverModel;
    }
  }

  const extraHtml = extra
    ? `<p style="margin:16px 0 0;padding:12px 14px;border:1px solid rgba(50,43,43,0.2);font-size:14px;line-height:1.5;">${escapeHtml(extra)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="referrer" content="no-referrer" />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&amp;display=swap" />
    <title>${escapeHtml(title)} · ${escapeHtml(BRAND_NAME)}</title>
    <style>
      body {
        margin: 0;
        background: #F4F1ED;
        color: #322B2B;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
      }
      a { color: inherit; }
      header, main, footer { box-sizing: border-box; }
    </style>
  </head>
  <body>
    <header style="border-bottom:1px solid rgba(50,43,43,0.1);">
      <div style="max-width:40rem;margin:0 auto;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px;">
        <a href="${escapeHtml(home)}" style="text-decoration:none;">
          <span style="font-family:'Major Mono Display','Courier New',Courier,monospace;letter-spacing:0.16em;font-size:12px;text-transform:uppercase;">Aaron Bowser</span>
        </a>
        <a href="${escapeHtml(home)}" style="font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;">Start</a>
      </div>
    </header>
    <main style="max-width:40rem;margin:0 auto;padding:56px 24px 72px;">
      <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(50,43,43,0.62);">Buchung</p>
      <h1 style="margin:12px 0 0;font-size:2.25rem;font-weight:300;letter-spacing:-0.02em;line-height:1.15;">${escapeHtml(title)}</h1>
      <p style="margin:20px 0 0;font-size:16px;line-height:1.6;">${escapeHtml(intro)}</p>
      ${extraHtml}
      ${renderRows(rows)}
      ${form}
    </main>
    <footer style="border-top:1px solid rgba(50,43,43,0.15);">
      <div style="max-width:40rem;margin:0 auto;padding:28px 24px 40px;font-size:14px;line-height:1.6;">
        <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(50,43,43,0.7);">Kontakt</div>
        <p style="margin:8px 0 0;">${escapeHtml(BRAND_NAME)}</p>
        <p style="margin:4px 0 0;"><a href="${escapeHtml(contactPhoneHref())}" style="text-decoration:none;">${escapeHtml(CONTACT_PHONE_DISPLAY)}</a></p>
        <p style="margin:4px 0 0;"><a href="${escapeHtml(contactEmailHref())}" style="text-decoration:none;">${escapeHtml(CONTACT_EMAIL)}</a></p>
      </div>
    </footer>
  </body>
</html>`;
}

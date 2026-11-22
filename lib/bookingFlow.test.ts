import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createApprovalToken, hashApprovalToken, isApprovalToken } from "./approvalToken";
import { photoPackageName, type RequestDetails } from "./bookingDetails";
import { respondToDecisionPost } from "./bookingDecisionHttp";
import { renderDecisionPage } from "./bookingDecisionPage";
import {
  buildBusinessRequestEmail,
  buildClientConfirmedEmail,
  buildClientDeclinedEmail,
  buildClientReceivedEmail,
} from "./bookingEmails";
import { calendarSummary, REQUEST_EVENT_PREFIX } from "./googleCalendar";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const details: RequestDetails = {
  kind: "immobilien",
  locale: "de",
  companyName: "Muster GmbH",
  contactName: "Ada Beispiel",
  contactEmail: "ada@example.com",
  contactPhone: "+49 170 0000000",
  accountEmail: "office@example.com",
  address: "Beispielstraße 1, 58089 Hagen",
  propertyStatus: "Empty",
  services: ["Interior", "Drohne"],
  photoPackage: "bis-5-zimmer",
  categorySlug: null,
  notes: "Bitte klingeln",
  requestedDate: "2026-11-22",
  requestedTime: "10:00",
  timeZone: "Europe/Berlin",
  calendarUrl: "https://calendar.google.com/calendar/event?eid=abc",
};

function money(value: string) {
  return /€|\bEUR\b|\bEuro\b|\bPreis\b/i.test(value);
}

test("approval tokens are random, hashed, and single-shape", () => {
  const first = createApprovalToken();
  const second = createApprovalToken();
  assert.equal(first.token.length, 43);
  assert.equal(isApprovalToken(first.token), true);
  assert.equal(isApprovalToken("short"), false);
  assert.equal(first.hash, hashApprovalToken(first.token));
  assert.equal(first.hash.length, 64);
  assert.notEqual(first.hash, first.token);
  assert.notEqual(first.token, second.token);
});

test("calendar requests are marked ANFRAGE until they are confirmed", () => {
  assert.equal(REQUEST_EVENT_PREFIX, "ANFRAGE – ");
  assert.equal(calendarSummary("Immobilien - Muster", "tentative"), "ANFRAGE – Immobilien - Muster");
  assert.equal(calendarSummary("ANFRAGE – Immobilien - Muster", "confirmed"), "Immobilien - Muster");
});

test("package names used in mail do not carry a price", () => {
  assert.equal(photoPackageName("bis-5-zimmer", "de"), "Bis 5 Zimmer (Min. 10 Fotos)");
  assert.equal(photoPackageName("bis-5-zimmer", "en"), "Up to 5 rooms (min. 10 photos)");
  assert.equal(money(photoPackageName("bis-5-zimmer", "de")), false);
});

test("the studio email asks Aaron to approve and does not publish a price", () => {
  const message = buildBusinessRequestEmail(details, "a".repeat(43));
  assert.match(message.subject, /^Neue Buchungsanfrage:/);
  assert.match(message.text, /Muster GmbH/);
  assert.match(message.text, /Ada Beispiel/);
  assert.match(message.text, /ada@example.com/);
  assert.match(message.text, /Beispielstraße 1/);
  assert.match(message.text, /Bitte klingeln/);
  assert.match(message.text, /10:00/);
  assert.match(message.text, /Europe\/Berlin/);
  assert.match(message.html, /\/api\/booking\/approve\?token=/);
  assert.match(message.html, /\/api\/booking\/decline\?token=/);
  assert.match(message.text, /Annehmen:/);
  assert.match(message.text, /Ablehnen:/);
  assert.equal(money(message.html + message.text), false);
});

test("the client first hears that the request was received, not that it is confirmed", () => {
  const german = buildClientReceivedEmail(details);
  const english = buildClientReceivedEmail({ ...details, locale: "en" });
  assert.equal(german.subject, "Anfrage erhalten");
  assert.match(german.text, /keine Terminbestätigung/);
  assert.match(german.text, /\+49 179 5392188/);
  assert.match(german.text, /info@aaronbowser-photography.com/);
  assert.doesNotMatch(german.html, /\/api\/booking\/approve/);
  assert.doesNotMatch(german.text, /Bitte klingeln/);
  assert.equal(english.subject, "Request received");
  assert.match(english.text, /not a booking confirmation/);
  assert.equal(money(german.html + german.text + english.html + english.text), false);
});

test("approval and decline mail tell the client what happened and never include a price", () => {
  const confirmed = buildClientConfirmedEmail(details);
  const declined = buildClientDeclinedEmail(details);
  const declinedEn = buildClientDeclinedEmail({ ...details, locale: "en" });
  assert.equal(confirmed.subject, "Termin bestätigt");
  assert.match(confirmed.text, /Beispielstraße 1/);
  assert.match(confirmed.text, /Innenaufnahmen/);
  assert.match(confirmed.text, /\+49 179 5392188/);
  assert.match(confirmed.text, /info@aaronbowser-photography.com/);
  assert.doesNotMatch(confirmed.html, /\/api\/booking\//);
  assert.match(declined.text, /andere Zeit/);
  assert.match(declinedEn.text, /another time/);
  assert.equal(money(confirmed.html + confirmed.text + declined.html + declined.text), false);
});

test("the decision page requires a confirm click and explains an earlier decision", () => {
  const token = "b".repeat(43);
  const confirm = renderDecisionPage({
    state: "confirm",
    action: "approve",
    token,
    rows: [{ label: "Firma", value: "Muster GmbH" }],
  });
  assert.match(confirm, /method="post"/);
  assert.match(confirm, /Anfrage annehmen/);
  assert.match(confirm, new RegExp(`value="${token}"`));
  assert.doesNotMatch(confirm, /<script/i);
  assert.match(confirm, /Major Mono Display/);

  const done = renderDecisionPage({
    state: "already",
    status: "declined",
    rows: [{ label: "Firma", value: "Muster GmbH" }],
  });
  assert.match(done, /bereits abgelehnt/);
  assert.doesNotMatch(done, /<form/i);
  assert.doesNotMatch(done, /token/);
});

test("posting the email link without the confirm form does not decide the request", async () => {
  const token = "c".repeat(43);
  const response = await respondToDecisionPost(
    "approve",
    new Request(`https://preview.example/api/booking/approve?token=${token}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "",
    })
  );
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(body, /Dieser Link ist ungültig/);
  assert.doesNotMatch(body, /<form/i);
});

test("the booking request migration only adds a staff-readable table", () => {
  const sql = fs.readFileSync(
    path.join(ROOT, "supabase/migrations/20261122200000_booking_requests.sql"),
    "utf8"
  );
  const lowered = sql.toLowerCase();
  assert.match(lowered, /create table public\.booking_requests/);
  assert.match(lowered, /enable row level security/);
  assert.match(sql, /private\.is_staff\(\)/);
  assert.equal(lowered.includes("drop table"), false);
  assert.equal(lowered.includes("drop column"), false);
  assert.equal(lowered.includes("approval_token_hash"), true);
});

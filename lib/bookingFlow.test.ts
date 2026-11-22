import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createApprovalToken, hashApprovalToken, isApprovalToken } from "./approvalToken";
import {
  getIndividualPhotoLabel,
  getPhotoPackageLabel,
  resolveImmobilienSelection,
  resolvePhotoChoice,
} from "./booking";
import { buildPriceSnapshot, formatEstimatedTotal, tierLabel, type PriceCatalog, type PriceRow } from "./clientPricing";
import { bundleFromRow, photoPackageName, servicesFromRow, type RequestDetails } from "./bookingDetails";
import { getDictionarySync } from "./i18n/getDictionary";
import { getLocalizedCategory } from "./i18n/localizeContent";
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
  individualPhotoCount: null,
  bundle: null,
  highlightRoom: null,
  homestagingPhotoCount: null,
  categorySlug: null,
  notes: "Bitte klingeln",
  requestedDate: "2026-11-22",
  requestedTime: "10:00",
  timeZone: "Europe/Berlin",
  calendarUrl: "https://calendar.google.com/calendar/event?eid=abc",
  priceSnapshot: null,
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
  assert.equal(photoPackageName("bis-5-zimmer", "de"), "10-Foto-Paket");
  assert.equal(photoPackageName("bis-5-zimmer", "en"), "10 photo package");
  assert.equal(photoPackageName("bis-7-zimmer", "de"), "15-Foto-Paket");
  assert.equal(photoPackageName("bis-10-zimmer", "en"), "25 photo package");
  assert.equal(photoPackageName("30-fotos", "de"), "30-Foto-Paket");
  assert.equal(photoPackageName("40-fotos", "en"), "40 photo package");
  assert.equal(photoPackageName("50-fotos", "de"), "50-Foto-Paket");
  assert.equal(money(getPhotoPackageLabel("bis-5-zimmer", "de")), false);
  assert.equal(/preis|price|anfrage|request|€/i.test(photoPackageName("bis-5-zimmer", "de")), false);
});

test("a package and an individual quantity cannot be selected together", () => {
  assert.deepEqual(resolvePhotoChoice("bis-7-zimmer", null), {
    photoPackage: "bis-7-zimmer",
    individualPhotoCount: null,
  });
  assert.deepEqual(resolvePhotoChoice(null, 3), {
    photoPackage: null,
    individualPhotoCount: 3,
  });
  assert.equal(resolvePhotoChoice("bis-7-zimmer", 3), null);
  assert.equal(resolvePhotoChoice("", null), null);
  assert.equal(resolvePhotoChoice(null, 0), null);
  assert.equal(resolvePhotoChoice(null, 10), null);
  assert.equal(getIndividualPhotoLabel(1, "en"), "1 photo");
  assert.equal(getIndividualPhotoLabel(9, "de"), "9 Fotos");
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
  assert.match(message.text, /10-Foto-Paket/);
  assert.match(message.text, /Innenaufnahmen/);
  assert.doesNotMatch(message.text, /Preisklasse/);
  assert.doesNotMatch(message.text, /Geschätzte Summe/);
  assert.equal(money(message.html + message.text), false);
});

test("individual photos and the new video services are named in both emails", () => {
  const individual: RequestDetails = {
    ...details,
    photoPackage: null,
    individualPhotoCount: 3,
    services: ["Interior", "Walk Thru Video", "Agent Branding Video"],
  };
  const studio = buildBusinessRequestEmail(individual, "d".repeat(43));
  const client = buildClientReceivedEmail(individual);
  const confirmed = buildClientConfirmedEmail(individual);
  const clientEn = buildClientReceivedEmail({ ...individual, locale: "en" });
  assert.match(studio.text, /Einzelfotos/);
  assert.match(studio.text, /3 Fotos/);
  assert.match(studio.text, /Walk-Through-Video/);
  assert.match(studio.text, /Makler-Branding-Video/);
  assert.doesNotMatch(studio.text, /Fotopaket/);
  assert.match(client.text, /Einzelfotos/);
  assert.match(client.text, /3 Fotos/);
  assert.match(client.text, /Walk-Through-Video/);
  assert.match(client.text, /Makler-Branding-Video/);
  assert.match(confirmed.text, /Einzelfotos/);
  assert.match(confirmed.text, /3 Fotos/);
  assert.match(confirmed.text, /Walk-Through-Video/);
  assert.match(clientEn.text, /Individual photos/);
  assert.match(clientEn.text, /3 photos/);
  assert.match(clientEn.text, /Walk Thru Video/);
  assert.match(clientEn.text, /Agent Branding Video/);
  assert.doesNotMatch(clientEn.text, /Agent branding Video/);
  assert.equal(money(studio.text + client.text + clientEn.text), false);
});

test("a bundle stores the package size and room, and mail names both packages", () => {
  const premium = resolveImmobilienSelection({
    offer: "premium-home",
    services: ["Interior"],
    photoPackage: "30-fotos",
    individualPhotoCount: 4,
    highlightRoom: "  Wohnzimmer  ",
  });
  assert.equal(premium.ok, true);
  if (!premium.ok) return;
  assert.equal(premium.selection.bundle, "premium-home");
  assert.equal(premium.selection.photoPackage, "30-fotos");
  assert.equal(premium.selection.individualPhotoCount, null);
  assert.equal(premium.selection.highlightRoom, "Wohnzimmer");
  assert.deepEqual(premium.selection.services, ["Highlight Video", "Drohne"]);

  const luxury = resolveImmobilienSelection({
    offer: "luxury-makler",
    services: [],
    photoPackage: "bis-5-zimmer",
    individualPhotoCount: null,
    highlightRoom: "Wohnzimmer",
  });
  assert.equal(luxury.ok, true);
  if (!luxury.ok) return;
  assert.equal(luxury.selection.highlightRoom, null);
  assert.deepEqual(luxury.selection.services, ["Walk Thru Video", "Drohne"]);

  const missingPackage = resolveImmobilienSelection({
    offer: "premium-home",
    services: [],
    photoPackage: null,
    individualPhotoCount: null,
    highlightRoom: "",
  });
  assert.deepEqual(missingPackage, { ok: false, reason: "bundle-photos" });

  const custom = resolveImmobilienSelection({
    offer: "custom",
    services: ["Agent Branding Video"],
    photoPackage: null,
    individualPhotoCount: 2,
    highlightRoom: "Küche",
  });
  assert.equal(custom.ok, true);
  if (!custom.ok) return;
  assert.equal(custom.selection.bundle, null);
  assert.equal(custom.selection.highlightRoom, null);
  assert.deepEqual(custom.selection.services, ["Agent Branding Video"]);

  const premiumDetails: RequestDetails = {
    ...details,
    services: premium.selection.services,
    photoPackage: "30-fotos",
    bundle: "premium-home",
    highlightRoom: "Wohnzimmer",
  };
  const studio = buildBusinessRequestEmail(premiumDetails, "e".repeat(43));
  const received = buildClientReceivedEmail(premiumDetails);
  const confirmed = buildClientConfirmedEmail(premiumDetails);
  const receivedEn = buildClientReceivedEmail({
    ...premiumDetails,
    locale: "en",
    highlightRoom: "Living room",
  });
  const premiumDe =
    "Enthält ein Fotopaket Ihrer Wahl und ein Highlight-Video. Drohnenfotos und Drohnenaufnahmen sind ebenfalls enthalten: Die Drohnenfotos werden auf Ihr Fotopaket angerechnet, die Drohnenaufnahmen fließen in das Video ein.";
  const premiumEn =
    "Includes a photo package of your choice and a highlight video. Drone photos and video footage are also included: the drone photos count toward your photo package, and the drone footage is used in the video.";
  for (const message of [studio, received, confirmed]) {
    assert.match(message.text, /Premium Home Paket/);
    assert.match(message.text, /Wohnzimmer/);
    assert.match(message.text, new RegExp(premiumDe.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(message.text, /30-Foto-Paket/);
    assert.doesNotMatch(message.text, /Drohnenvideo/);
  }
  assert.match(receivedEn.text, /Premium Home package/);
  assert.match(receivedEn.text, /Living room/);
  assert.match(receivedEn.text, new RegExp(premiumEn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(receivedEn.text, /drone video/i);

  const luxuryDetails: RequestDetails = {
    ...details,
    locale: "en",
    services: luxury.selection.services,
    bundle: "luxury-makler",
    highlightRoom: null,
  };
  const luxuryMail = buildClientConfirmedEmail(luxuryDetails);
  const luxuryStudio = buildBusinessRequestEmail({ ...luxuryDetails, locale: "de" }, "f".repeat(43));
  assert.match(luxuryMail.text, /Luxury Makler package/);
  assert.match(
    luxuryMail.text,
    /Includes a photo package of your choice and a Walk Thru Video featuring the agent\. Drone photos and video footage are also included: the drone photos count toward your photo package, and the drone footage is used in the walkthrough video\./
  );
  assert.doesNotMatch(luxuryMail.text, /drone video/i);
  assert.doesNotMatch(luxuryMail.text, /Highlight room/);
  assert.match(luxuryStudio.text, /Luxury Makler Paket/);
  assert.match(
    luxuryStudio.text,
    /Enthält ein Fotopaket Ihrer Wahl und ein Walk-Through-Video mit dem Makler im Fokus\. Drohnenfotos und Drohnenaufnahmen sind ebenfalls enthalten: Die Drohnenfotos werden auf Ihr Fotopaket angerechnet, die Drohnenaufnahmen fließen in das Walk-Through-Video ein\./
  );
  assert.doesNotMatch(luxuryStudio.text, /Drohnenvideo/);
  assert.equal(
    money(studio.text + received.text + receivedEn.text + luxuryMail.text + luxuryStudio.text),
    false
  );
});

test("stored Agent branding Video rows still read as Agent Branding Video", () => {
  assert.deepEqual(servicesFromRow(["Agent branding Video", "Interior"]), [
    "Interior",
    "Agent Branding Video",
  ]);
  assert.equal(bundleFromRow("premium-home"), "premium-home");
  assert.equal(bundleFromRow("other"), null);
  const english = getDictionarySync("en").booking;
  const german = getDictionarySync("de").booking;
  assert.equal(english.serviceLabels["Agent Branding Video"], "Agent Branding Video");
  assert.equal(german.serviceLabels["Agent Branding Video"], "Makler-Branding-Video");
  assert.equal(
    english.bundles["premium-home"].description,
    "Includes a photo package of your choice and a highlight video. Drone photos and video footage are also included: the drone photos count toward your photo package, and the drone footage is used in the video."
  );
  assert.equal(
    german.bundles["premium-home"].description,
    "Enthält ein Fotopaket Ihrer Wahl und ein Highlight-Video. Drohnenfotos und Drohnenaufnahmen sind ebenfalls enthalten: Die Drohnenfotos werden auf Ihr Fotopaket angerechnet, die Drohnenaufnahmen fließen in das Video ein."
  );
  assert.equal(english.bundles["premium-home"].inclusions.includes("Drone video"), false);
  assert.equal(german.bundles["premium-home"].inclusions.includes("Drohnenvideo"), false);
  assert.equal(english.bundles["luxury-makler"].inclusions.includes("Drone video"), false);
  assert.equal(english.bundles["luxury-makler"].name, "Luxury Makler package");
  assert.equal(german.bundles["premium-home"].name, "Premium Home Paket");
});

test("the real-estate landing describes both bundles and does not publish a price", () => {
  const english = getLocalizedCategory("real-estate", "en");
  const german = getLocalizedCategory("real-estate", "de");
  const premiumEn = english.services.find((service) => service.title === "Premium Home package");
  const luxuryEn = english.services.find((service) => service.title === "Luxury Makler package");
  const premiumDe = german.services.find((service) => service.title === "Premium Home Paket");
  const luxuryDe = german.services.find((service) => service.title === "Luxury Makler Paket");
  assert.equal(
    premiumEn?.description,
    "Includes a photo package of your choice and a highlight video. Drone photos and video footage are also included: the drone photos count toward your photo package, and the drone footage is used in the video."
  );
  assert.equal(
    luxuryEn?.description,
    "Includes a photo package of your choice and a Walk Thru Video featuring the agent. Drone photos and video footage are also included: the drone photos count toward your photo package, and the drone footage is used in the walkthrough video."
  );
  assert.equal(
    premiumDe?.description,
    "Enthält ein Fotopaket Ihrer Wahl und ein Highlight-Video. Drohnenfotos und Drohnenaufnahmen sind ebenfalls enthalten: Die Drohnenfotos werden auf Ihr Fotopaket angerechnet, die Drohnenaufnahmen fließen in das Video ein."
  );
  assert.equal(
    luxuryDe?.description,
    "Enthält ein Fotopaket Ihrer Wahl und ein Walk-Through-Video mit dem Makler im Fokus. Drohnenfotos und Drohnenaufnahmen sind ebenfalls enthalten: Die Drohnenfotos werden auf Ihr Fotopaket angerechnet, die Drohnenaufnahmen fließen in das Walk-Through-Video ein."
  );
  assert.equal(`${premiumEn?.description} ${luxuryEn?.description}`.toLowerCase().includes("drone video"), false);
  assert.equal(`${premiumDe?.description} ${luxuryDe?.description}`.includes("Drohnenvideo"), false);
  assert.equal(
    money(
      `${premiumEn?.description ?? ""} ${luxuryEn?.description ?? ""} ${premiumDe?.description ?? ""} ${luxuryDe?.description ?? ""}`
    ),
    false
  );
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
  assert.match(german.text, /10-Foto-Paket/);
  assert.match(english.text, /10 photo package/);
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

test("a priced request tells Aaron and the client the tier and the net total", () => {
  const fee = 4 * 100;
  const pack = 10 * 100;
  const items: PriceRow[] = [
    {
      tier: "legacy",
      itemKey: "photo_package_10",
      labelDe: "10 Fotos",
      labelEn: "10 photos",
      unit: "flat",
      priceNetCents: pack,
      sortOrder: 10,
      active: true,
    },
    {
      tier: "legacy",
      itemKey: "booking_fee",
      labelDe: "Buchungsgebühr",
      labelEn: "Booking fee",
      unit: "flat",
      priceNetCents: fee,
      sortOrder: 80,
      active: true,
    },
  ];
  const prices: PriceCatalog = { tier: "legacy", items };
  const chosen = resolveImmobilienSelection({
    offer: "custom",
    services: ["Interior"],
    photoPackage: "bis-5-zimmer",
    individualPhotoCount: null,
    highlightRoom: "",
  });
  assert.equal(chosen.ok, true);
  if (!chosen.ok) return;
  const snapshot = buildPriceSnapshot(prices, chosen.selection);
  const priced = { ...details, priceSnapshot: snapshot };
  const studio = buildBusinessRequestEmail(priced, "g".repeat(43));
  const client = buildClientReceivedEmail(priced);
  const clientEn = buildClientReceivedEmail({ ...priced, locale: "en" });
  const confirmed = buildClientConfirmedEmail({ ...priced, locale: "en" });
  assert.match(studio.text, new RegExp(tierLabel(snapshot.tier)));
  assert.match(studio.text, /Preisklasse/);
  assert.match(studio.text, /Buchungsgebühr/);
  assert.match(studio.text, /10 Fotos/);
  assert.match(studio.text, new RegExp(formatEstimatedTotal(snapshot, "de").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(studio.text, /zzgl\. MwSt\. und ggf\. Fahrtkosten ab 30 km/);
  assert.match(client.text, /Preisklasse/);
  assert.match(client.text, new RegExp(formatEstimatedTotal(snapshot, "de").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(clientEn.text, /Pricing tier/);
  assert.match(clientEn.text, /Booking fee/);
  assert.match(clientEn.text, new RegExp(formatEstimatedTotal(snapshot, "en").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(clientEn.text, /plus VAT and travel costs beyond 30 km where applicable/);
  assert.match(confirmed.text, /Estimated total \(net\)/);
  assert.equal(money(buildBusinessRequestEmail(details, "h".repeat(43)).text), false);
});

test("homestaging quantity is named in both emails when no prices are shown", () => {
  const staged: RequestDetails = {
    ...details,
    services: ["Interior", "Digital Homestaging"],
    homestagingPhotoCount: 2,
  };
  const studio = buildBusinessRequestEmail(staged, "i".repeat(43));
  const client = buildClientReceivedEmail(staged);
  const clientEn = buildClientReceivedEmail({ ...staged, locale: "en" });
  assert.match(studio.text, /Anzahl Fotos für Homestaging: 2/);
  assert.match(client.text, /Anzahl Fotos für Homestaging: 2/);
  assert.match(clientEn.text, /Number of photos to stage: 2/);
  assert.equal(money(studio.text + client.text + clientEn.text), false);
});

test("the bundle migration only adds nullable columns", () => {
  const sql = fs.readFileSync(
    path.join(ROOT, "supabase/migrations/20261122224500_booking_request_bundles.sql"),
    "utf8"
  );
  const lowered = sql.toLowerCase();
  assert.match(lowered, /add column bundle text/);
  assert.match(lowered, /add column highlight_room text/);
  assert.match(lowered, /bundle is null or bundle in \('premium-home', 'luxury-makler'\)/);
  assert.equal(lowered.includes("drop table"), false);
  assert.equal(lowered.includes("drop column"), false);
  assert.equal(lowered.includes("€"), false);
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

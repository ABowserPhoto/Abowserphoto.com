import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { resolveImmobilienSelection } from "./booking";
import {
  buildPriceSnapshot,
  catalogFromRows,
  formatEuroAmount,
  formatNetPrice,
  formatSnapshotLine,
  onRequestLabel,
  optionPriceTexts,
  photoPackageItemKey,
  priceSnapshotFromJson,
  priceSnapshotToJson,
  servicePriceItemKeys,
  type PriceCatalog,
  type PriceItemKey,
  type PriceRow,
  type PriceUnit,
} from "./clientPricing";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function cents(euros: number, extra = 0) {
  return euros * 100 + extra;
}

function row(
  itemKey: PriceItemKey,
  priceNetCents: number | null,
  unit: PriceUnit = "flat",
  sortOrder = 0,
  tier: PriceRow["tier"] = "standard"
): PriceRow {
  return {
    tier,
    itemKey,
    labelDe: itemKey,
    labelEn: itemKey,
    unit,
    priceNetCents,
    sortOrder,
    active: true,
  };
}

function catalog(items: PriceRow[]): PriceCatalog {
  return { tier: "standard", items };
}

function selection(input: Parameters<typeof resolveImmobilienSelection>[0]) {
  const result = resolveImmobilienSelection(input);
  if (!result.ok) assert.fail(result.reason);
  return result.selection;
}

test("net prices use the german amount and an english amount, and null stays on request", () => {
  const whole = 100 + 20 + 9;
  assert.equal(formatNetPrice(cents(whole), "flat", "de"), `${whole} € zzgl. MwSt.`);
  assert.equal(formatNetPrice(cents(whole), "flat", "en"), `€${whole} plus VAT`);
  assert.equal(formatNetPrice(cents(whole), "per_photo", "de"), `${whole} € pro Foto`);
  assert.equal(formatNetPrice(cents(whole), "per_photo", "en"), `€${whole} per photo`);
  assert.equal(formatNetPrice(null, "flat", "de"), "Preis auf Anfrage");
  assert.equal(formatNetPrice(null, "per_photo", "en"), "Price on request");
  assert.equal(onRequestLabel("de"), "Preis auf Anfrage");

  const remainder = 5;
  const fractional = cents(whole, remainder);
  const frac = String(fractional % 100).padStart(2, "0");
  assert.equal(formatEuroAmount(fractional, "de"), `${whole},${frac} €`);
  assert.equal(formatEuroAmount(fractional, "en"), `€${whole}.${frac}`);

  const thousands = 1000 + 234;
  const grouped = `1${"."}234`;
  const groupedEn = `1${","}234`;
  assert.equal(formatEuroAmount(cents(thousands), "de"), `${grouped} €`);
  assert.equal(formatEuroAmount(cents(thousands), "en"), `€${groupedEn}`);
});

test("a custom drone selection prices both drone items, and a bundle does not", () => {
  const packageCents = cents(10);
  const feeCents = cents(4);
  const dronePhotoCents = cents(2);
  const droneVideoCents = cents(3);
  const bundleCents = cents(7);
  const highlightCents = cents(8);
  const prices = catalog([
    row("photo_package_10", packageCents, "flat", 10),
    row("drone_photos", dronePhotoCents, "flat", 90),
    row("drone_video", droneVideoCents, "flat", 100),
    row("highlight_video", highlightCents, "flat", 110),
    row("premium_home_package", bundleCents, "flat", 140),
    row("booking_fee", feeCents, "flat", 80),
  ]);

  const custom = buildPriceSnapshot(
    prices,
    selection({
      offer: "custom",
      services: ["Interior", "Drohne"],
      photoPackage: "bis-5-zimmer",
      individualPhotoCount: null,
      highlightRoom: "",
    })
  );
  assert.deepEqual(
    custom.lines.map((line) => line.itemKey),
    ["photo_package_10", "drone_photos", "drone_video", "booking_fee"]
  );
  assert.equal(custom.estimatedNetCents, packageCents + dronePhotoCents + droneVideoCents + feeCents);
  assert.equal(custom.partial, false);
  assert.equal(custom.onRequest, false);
  assert.equal(custom.tier, "standard");

  const bundled = buildPriceSnapshot(
    prices,
    selection({
      offer: "premium-home",
      services: ["Drohne", "Highlight Video", "Interior"],
      photoPackage: "bis-5-zimmer",
      individualPhotoCount: 4,
      highlightRoom: "Wohnzimmer",
    })
  );
  assert.deepEqual(
    bundled.lines.map((line) => line.itemKey),
    ["photo_package_10", "premium_home_package", "booking_fee"]
  );
  assert.equal(bundled.estimatedNetCents, packageCents + bundleCents + feeCents);
  assert.equal(bundled.lines.some((line) => line.itemKey === "drone_photos"), false);
  assert.equal(bundled.lines.some((line) => line.itemKey === "highlight_video"), false);
});

test("homestaging is priced for the staged quantity, not the whole package", () => {
  const each = cents(3);
  const stagingEach = cents(2);
  const feeCents = cents(4);
  const packageCents = cents(10);
  const prices = catalog([
    row("individual_photo", each, "per_photo", 70),
    row("homestaging", stagingEach, "per_photo", 170),
    row("booking_fee", feeCents, "flat", 80),
    row("photo_package_10", packageCents, "flat", 10),
  ]);
  const count = 3;
  const individual = buildPriceSnapshot(
    prices,
    selection({
      offer: "custom",
      services: ["Interior"],
      photoPackage: null,
      individualPhotoCount: count,
      highlightRoom: "",
    })
  );
  const photoLine = individual.lines.find((line) => line.itemKey === "individual_photo");
  assert.equal(photoLine?.quantity, count);
  assert.equal(photoLine?.lineNetCents, each * count);
  assert.equal(individual.estimatedNetCents, each * count + feeCents);
  assert.equal(individual.homestagingPhotoCount, null);
  assert.equal(
    formatSnapshotLine(photoLine!, "en"),
    `${count} × ${formatNetPrice(each, "per_photo", "en")} (${formatNetPrice(each * count, "flat", "en")})`
  );

  const stagedCount = 2;
  const staged = buildPriceSnapshot(
    prices,
    selection({
      offer: "custom",
      services: ["Digital Homestaging"],
      photoPackage: "bis-5-zimmer",
      individualPhotoCount: null,
      highlightRoom: "",
      homestagingPhotoCount: stagedCount,
    })
  );
  const stagingLine = staged.lines.find((line) => line.itemKey === "homestaging");
  assert.equal(stagingLine?.quantity, stagedCount);
  assert.equal(stagingLine?.lineNetCents, stagingEach * stagedCount);
  assert.equal(staged.homestagingPhotoCount, stagedCount);
  assert.equal(staged.estimatedNetCents, packageCents + stagingEach * stagedCount + feeCents);
  assert.equal(staged.partial, false);

  const tooMany = resolveImmobilienSelection({
    offer: "custom",
    services: ["Digital Homestaging"],
    photoPackage: "bis-5-zimmer",
    individualPhotoCount: null,
    highlightRoom: "",
    homestagingPhotoCount: 11,
  });
  assert.deepEqual(tooMany, { ok: false, reason: "homestaging" });

  const missing = resolveImmobilienSelection({
    offer: "custom",
    services: ["Digital Homestaging"],
    photoPackage: "bis-5-zimmer",
    individualPhotoCount: null,
    highlightRoom: "",
  });
  assert.deepEqual(missing, { ok: false, reason: "homestaging" });
});

test("an on-request line keeps the known sum and marks the total partial", () => {
  const feeCents = cents(4);
  const prices = catalog([
    row("photo_package_30", null, "flat", 40),
    row("booking_fee", feeCents, "flat", 80),
    row("walk_thru_video", null, "flat", 120),
  ]);
  const snapshot = buildPriceSnapshot(
    prices,
    selection({
      offer: "custom",
      services: ["Walk Thru Video"],
      photoPackage: "30-fotos",
      individualPhotoCount: null,
      highlightRoom: "",
    })
  );
  assert.equal(snapshot.onRequest, true);
  assert.equal(snapshot.partial, true);
  assert.equal(snapshot.estimatedNetCents, feeCents);
  assert.equal(snapshot.lines.find((line) => line.itemKey === "photo_package_30")?.lineNetCents, null);
  assert.equal(formatSnapshotLine(snapshot.lines[0], "de"), "Preis auf Anfrage");

  const parsed = priceSnapshotFromJson(priceSnapshotToJson(snapshot));
  assert.deepEqual(parsed, snapshot);
  assert.equal(priceSnapshotFromJson(null), null);
  assert.equal(priceSnapshotFromJson({ tier: "public" }), null);
});

test("catalog rows stay on the client tier and unknown keys are dropped", () => {
  const feeCents = cents(4);
  const parsed = catalogFromRows("legacy", [
    {
      tier: "corporate",
      item_key: "booking_fee",
      label_de: "Other",
      label_en: "Other",
      unit: "flat",
      price_net_cents: cents(99),
      sort_order: 1,
      active: true,
    },
    {
      tier: "legacy",
      item_key: "booking_fee",
      label_de: "Buchungsgebühr",
      label_en: "Booking fee",
      unit: "flat",
      price_net_cents: feeCents,
      sort_order: 80,
      active: true,
    },
    {
      tier: "legacy",
      item_key: "booking_fee",
      label_de: "Duplicate",
      label_en: "Duplicate",
      unit: "flat",
      price_net_cents: cents(1),
      sort_order: 81,
      active: true,
    },
    {
      tier: "legacy",
      item_key: "secret_price",
      label_de: "Secret",
      label_en: "Secret",
      unit: "flat",
      price_net_cents: cents(50),
      sort_order: 1,
      active: true,
    },
    {
      tier: "legacy",
      item_key: "tour_360",
      label_de: "360°-Tour",
      label_en: "360° tour",
      unit: "flat",
      price_net_cents: cents(6),
      sort_order: 2,
      active: false,
    },
  ]);
  assert.equal(parsed.tier, "legacy");
  assert.equal(parsed.items.length, 1);
  assert.equal(parsed.items[0]?.priceNetCents, feeCents);
  assert.equal(parsed.items[0]?.labelDe, "Buchungsgebühr");
  assert.equal(optionPriceTexts(null, ["booking_fee"], "de").length, 0);
  assert.equal(optionPriceTexts(parsed, ["tour_360"], "en").length, 0);
  assert.deepEqual(servicePriceItemKeys("Interior"), []);
  assert.deepEqual(servicePriceItemKeys("Drohne"), ["drone_photos", "drone_video"]);
  assert.equal(photoPackageItemKey("bis-10-zimmer"), "photo_package_25");
});

test("prices are read with the caller session and the service role only stores the snapshot", () => {
  const pricing = fs.readFileSync(path.join(ROOT, "lib/clientPricing.ts"), "utf8");
  const requests = fs.readFileSync(path.join(ROOT, "lib/bookingRequests.ts"), "utf8");
  const submit = fs.readFileSync(path.join(ROOT, "actions/submitBooking.ts"), "utf8");
  assert.equal(pricing.includes("SUPABASE_SERVICE_ROLE_KEY"), false);
  assert.equal(pricing.includes("createServiceClient"), false);
  assert.match(pricing, /from\("pricing_tier_prices"\)/);
  assert.equal(requests.includes("pricing_tier_prices"), false);
  assert.match(requests, /price_snapshot: priceSnapshotToJson/);
  assert.match(submit, /loadOwnPriceCatalog/);
  assert.equal(submit.includes("createServiceClient"), false);
  assert.equal(submit.includes("SUPABASE_SERVICE_ROLE_KEY"), false);
});

test("the homestaging count migration only adds a nullable column", () => {
  const sql = fs.readFileSync(
    path.join(ROOT, "supabase/migrations/20261122235000_booking_request_homestaging_count.sql"),
    "utf8"
  );
  const lowered = sql.toLowerCase();
  assert.match(lowered, /add column homestaging_photo_count smallint/);
  assert.match(lowered, /homestaging_photo_count is null/);
  assert.equal(lowered.includes("drop table"), false);
  assert.equal(lowered.includes("drop column"), false);
  assert.equal(lowered.includes("alter table public.clients"), false);
  assert.equal(lowered.includes("alter table public.pricing_tier_prices"), false);
  assert.equal(sql.includes("€"), false);
});

test("the price snapshot migration only adds a nullable column", () => {
  const sql = fs.readFileSync(
    path.join(ROOT, "supabase/migrations/20261122233000_booking_request_price_snapshot.sql"),
    "utf8"
  );
  const lowered = sql.toLowerCase();
  assert.match(lowered, /add column price_snapshot jsonb/);
  assert.match(lowered, /price_snapshot is null or jsonb_typeof\(price_snapshot\) = 'object'/);
  assert.equal(lowered.includes("drop table"), false);
  assert.equal(lowered.includes("drop column"), false);
  assert.equal(lowered.includes("alter table public.clients"), false);
  assert.equal(lowered.includes("alter table public.pricing_tier_prices"), false);
  assert.equal(sql.includes("€"), false);
});

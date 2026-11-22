import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PHOTO_PACKAGES,
  type BookingBundle,
  type BookingService,
  type ImmobilienSelection,
  type PhotoPackage,
} from "./booking";
import type { Database, Json } from "./database.types";
import type { Locale } from "./i18n/config";

export const PRICING_TIERS = ["standard", "legacy", "corporate"] as const;
export type PricingTier = (typeof PRICING_TIERS)[number];

export const PRICE_ITEM_KEYS = [
  "photo_package_10",
  "photo_package_15",
  "photo_package_25",
  "photo_package_30",
  "photo_package_40",
  "photo_package_50",
  "individual_photo",
  "booking_fee",
  "drone_photos",
  "drone_video",
  "highlight_video",
  "walk_thru_video",
  "agent_branding_video",
  "premium_home_package",
  "luxury_makler_package",
  "tour_360",
  "homestaging",
] as const;
export type PriceItemKey = (typeof PRICE_ITEM_KEYS)[number];

export type PriceUnit = "flat" | "per_photo";

export type PriceRow = {
  tier: PricingTier;
  itemKey: PriceItemKey;
  labelDe: string;
  labelEn: string;
  unit: PriceUnit;
  priceNetCents: number | null;
  sortOrder: number;
  active: boolean;
};

export type PriceCatalog = {
  tier: PricingTier;
  items: PriceRow[];
};

export type PriceSnapshotLine = {
  itemKey: PriceItemKey;
  labelDe: string;
  labelEn: string;
  unit: PriceUnit;
  quantity: number;
  unitNetCents: number | null;
  lineNetCents: number | null;
};

export type PriceSnapshot = {
  tier: PricingTier;
  lines: PriceSnapshotLine[];
  estimatedNetCents: number | null;
  partial: boolean;
  onRequest: boolean;
};

export type PriceLoadResult =
  | { status: "hidden" }
  | { status: "ready"; catalog: PriceCatalog }
  | { status: "error" };

type SessionClient = SupabaseClient<Database>;

const ITEM_KEY_SET = new Set<string>(PRICE_ITEM_KEYS);

export function parsePricingTier(value: string | null | undefined): PricingTier | null {
  switch (value) {
    case "standard":
    case "legacy":
    case "corporate":
      return value;
    default:
      return null;
  }
}

export function isPriceItemKey(value: string): value is PriceItemKey {
  return ITEM_KEY_SET.has(value);
}

export function tierLabel(tier: PricingTier): string {
  switch (tier) {
    case "standard":
      return "Standard";
    case "legacy":
      return "Legacy";
    case "corporate":
      return "Corporate";
    default: {
      const neverTier: never = tier;
      return neverTier;
    }
  }
}

export function photoPackageItemKey(id: PhotoPackage): PriceItemKey {
  switch (id) {
    case "bis-5-zimmer":
      return "photo_package_10";
    case "bis-7-zimmer":
      return "photo_package_15";
    case "bis-10-zimmer":
      return "photo_package_25";
    case "30-fotos":
      return "photo_package_30";
    case "40-fotos":
      return "photo_package_40";
    case "50-fotos":
      return "photo_package_50";
    default: {
      const neverId: never = id;
      return neverId;
    }
  }
}

export function photoPackageCount(id: PhotoPackage): number {
  const count = PHOTO_PACKAGES.find((item) => item.id === id)?.photos;
  return count ?? 0;
}

/**
 * The booking form has one drone option. The catalog prices drone photos and
 * drone video separately, so a custom drone selection includes both.
 * Bundle prices already include those items, so they are not added again.
 */
export function servicePriceItemKeys(service: BookingService): readonly PriceItemKey[] {
  switch (service) {
    case "Interior":
    case "Exterior":
      return [];
    case "Drohne":
      return ["drone_photos", "drone_video"];
    case "360 Degree Tour":
      return ["tour_360"];
    case "Digital Homestaging":
      return ["homestaging"];
    case "Highlight Video":
      return ["highlight_video"];
    case "Walk Thru Video":
      return ["walk_thru_video"];
    case "Agent Branding Video":
      return ["agent_branding_video"];
    default: {
      const neverService: never = service;
      return neverService;
    }
  }
}

export function bundlePriceItemKey(bundle: BookingBundle): PriceItemKey {
  switch (bundle) {
    case "premium-home":
      return "premium_home_package";
    case "luxury-makler":
      return "luxury_makler_package";
    default: {
      const neverBundle: never = bundle;
      return neverBundle;
    }
  }
}

export function pricedItemKeys(selection: ImmobilienSelection): PriceItemKey[] {
  const keys: PriceItemKey[] = [];
  if (selection.bundle) {
    keys.push(bundlePriceItemKey(selection.bundle));
  } else {
    for (const service of selection.services) {
      keys.push(...servicePriceItemKeys(service));
    }
  }
  if (selection.photoPackage) keys.push(photoPackageItemKey(selection.photoPackage));
  else if (selection.individualPhotoCount) keys.push("individual_photo");
  keys.push("booking_fee");
  return keys;
}

function isPriceUnit(value: string): value is PriceUnit {
  return value === "flat" || value === "per_photo";
}

function cleanLabel(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
}

export function catalogFromRows(
  tier: PricingTier,
  rows: ReadonlyArray<{
    tier: string;
    item_key: string;
    label_de: string | null;
    label_en: string | null;
    unit: string;
    price_net_cents: number | null;
    sort_order: number | null;
    active: boolean;
  }>
): PriceCatalog {
  const items: PriceRow[] = [];
  const seen = new Set<PriceItemKey>();
  const sorted = [...rows].sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0));
  for (const row of sorted) {
    if (!row.active || row.tier !== tier || !isPriceItemKey(row.item_key) || !isPriceUnit(row.unit)) continue;
    if (seen.has(row.item_key)) continue;
    if (row.price_net_cents != null && !Number.isInteger(row.price_net_cents)) continue;
    seen.add(row.item_key);
    items.push({
      tier,
      itemKey: row.item_key,
      labelDe: cleanLabel(row.label_de),
      labelEn: cleanLabel(row.label_en),
      unit: row.unit,
      priceNetCents: row.price_net_cents,
      sortOrder: row.sort_order ?? 0,
      active: true,
    });
  }
  return { tier, items };
}

function lineQuantity(
  itemKey: PriceItemKey,
  unit: PriceUnit,
  selection: ImmobilienSelection
): number | null {
  switch (unit) {
    case "flat":
      return 1;
    case "per_photo":
      return perPhotoQuantity(itemKey, selection);
    default: {
      const neverUnit: never = unit;
      return neverUnit;
    }
  }
}

function perPhotoQuantity(itemKey: PriceItemKey, selection: ImmobilienSelection): number | null {
  switch (itemKey) {
    case "individual_photo":
      return selection.individualPhotoCount;
    case "homestaging":
      if (selection.photoPackage) return photoPackageCount(selection.photoPackage) || null;
      return selection.individualPhotoCount;
    default:
      return null;
  }
}

function emptySelection(): ImmobilienSelection {
  return {
    bundle: null,
    services: [],
    photoPackage: null,
    individualPhotoCount: null,
    highlightRoom: null,
  };
}

export function buildPriceSnapshot(
  catalog: PriceCatalog,
  selection: ImmobilienSelection = emptySelection()
): PriceSnapshot {
  const byKey = new Map(catalog.items.map((item) => [item.itemKey, item]));
  const keys = [...new Set(pricedItemKeys(selection))];
  keys.sort((left, right) => {
    if (left === "booking_fee") return 1;
    if (right === "booking_fee") return -1;
    return (byKey.get(left)?.sortOrder ?? 0) - (byKey.get(right)?.sortOrder ?? 0);
  });

  const lines: PriceSnapshotLine[] = [];
  let sum = 0;
  let pricedCount = 0;
  let onRequest = false;
  let partial = false;

  for (const itemKey of keys) {
    const row = byKey.get(itemKey);
    if (!row) {
      partial = true;
      continue;
    }
    const quantity = lineQuantity(itemKey, row.unit, selection);
    const base = {
      itemKey,
      labelDe: row.labelDe || row.labelEn || itemKey,
      labelEn: row.labelEn || row.labelDe || itemKey,
      unit: row.unit,
      unitNetCents: row.priceNetCents,
    };
    if (quantity == null || quantity < 1) {
      partial = true;
      if (row.priceNetCents == null) onRequest = true;
      lines.push({ ...base, quantity: 0, lineNetCents: null });
      continue;
    }
    if (row.priceNetCents == null) {
      onRequest = true;
      partial = true;
      lines.push({ ...base, quantity, lineNetCents: null });
      continue;
    }
    const lineNetCents = row.priceNetCents * quantity;
    sum += lineNetCents;
    pricedCount += 1;
    lines.push({ ...base, quantity, lineNetCents });
  }

  return {
    tier: catalog.tier,
    lines,
    estimatedNetCents: pricedCount > 0 ? sum : null,
    partial: partial || onRequest,
    onRequest,
  };
}

export function optionPriceTexts(
  catalog: PriceCatalog | null,
  keys: readonly PriceItemKey[],
  locale: Locale
): string[] {
  if (!catalog || keys.length === 0) return [];
  const texts: string[] = [];
  for (const key of keys) {
    const row = catalog.items.find((item) => item.itemKey === key);
    if (!row) continue;
    const price = formatNetPrice(row.priceNetCents, row.unit, locale);
    if (keys.length > 1) {
      const name = (locale === "de" ? row.labelDe : row.labelEn) || key;
      texts.push(`${name}: ${price}`);
    } else {
      texts.push(price);
    }
  }
  return texts;
}

export function formatEuroAmount(cents: number, locale: Locale): string {
  const negative = cents < 0;
  const absolute = Math.abs(Math.trunc(cents));
  const euros = Math.floor(absolute / 100);
  const remainder = absolute % 100;
  const grouped = String(euros).replace(/\B(?=(\d{3})+(?!\d))/g, locale === "de" ? "." : ",");
  const body =
    remainder === 0
      ? grouped
      : locale === "de"
        ? `${grouped},${String(remainder).padStart(2, "0")}`
        : `${grouped}.${String(remainder).padStart(2, "0")}`;
  const amount = locale === "de" ? `${body} €` : `€${body}`;
  return negative ? `-${amount}` : amount;
}

export function onRequestLabel(locale: Locale) {
  return locale === "de" ? "Preis auf Anfrage" : "Price on request";
}

export function formatNetPrice(cents: number | null, unit: PriceUnit, locale: Locale): string {
  if (cents == null) return onRequestLabel(locale);
  const amount = formatEuroAmount(cents, locale);
  switch (unit) {
    case "per_photo":
      return locale === "de" ? `${amount} pro Foto` : `${amount} per photo`;
    case "flat":
      return locale === "de" ? `${amount} zzgl. MwSt.` : `${amount} plus VAT`;
    default: {
      const neverUnit: never = unit;
      return neverUnit;
    }
  }
}

export function formatSnapshotLine(line: PriceSnapshotLine, locale: Locale): string {
  if (line.unitNetCents == null || line.lineNetCents == null) {
    if (line.unitNetCents == null) return onRequestLabel(locale);
    return formatNetPrice(line.unitNetCents, line.unit, locale);
  }
  if (line.unit === "per_photo" && line.quantity > 1) {
    const rate = formatNetPrice(line.unitNetCents, "per_photo", locale);
    const total = formatNetPrice(line.lineNetCents, "flat", locale);
    return `${line.quantity} × ${rate} (${total})`;
  }
  return formatNetPrice(line.lineNetCents, line.unit, locale);
}

export function formatEstimatedTotal(snapshot: PriceSnapshot, locale: Locale): string {
  if (snapshot.estimatedNetCents == null) return onRequestLabel(locale);
  const amount = formatNetPrice(snapshot.estimatedNetCents, "flat", locale);
  if (!snapshot.partial) return amount;
  return locale === "de" ? `${amount} (unvollständig)` : `${amount} (partial)`;
}

export function snapshotShowsHomestagingEstimate(snapshot: PriceSnapshot) {
  return snapshot.lines.some(
    (line) => line.itemKey === "homestaging" && line.lineNetCents != null && line.quantity > 0
  );
}

export function priceCopy(locale: Locale) {
  switch (locale) {
    case "de":
      return {
        estimatedTotal: "Geschätzte Summe (netto)",
        totalPartial: "Die Summe ist unvollständig, weil mindestens eine gewählte Leistung Preis auf Anfrage ist.",
        totalIncomplete: "Die Summe ist unvollständig.",
        priceNote: "zzgl. MwSt. und ggf. Fahrtkosten ab 30 km",
        homestagingEstimate: "Homestaging ist als Betrag pro Foto für jedes Foto der Auswahl geschätzt.",
        pricingTier: "Preisklasse",
        noteLabel: "Hinweis",
      };
    case "en":
      return {
        estimatedTotal: "Estimated total (net)",
        totalPartial: "The total is partial because at least one selected item is price on request.",
        totalIncomplete: "This total is partial.",
        priceNote: "plus VAT and travel costs beyond 30 km where applicable",
        homestagingEstimate: "Home staging is estimated per photo for every photo in the selection.",
        pricingTier: "Pricing tier",
        noteLabel: "Note",
      };
    default: {
      const neverLocale: never = locale;
      return neverLocale;
    }
  }
}

export function priceNoteLines(snapshot: PriceSnapshot, locale: Locale) {
  const copy = priceCopy(locale);
  return [
    snapshot.onRequest ? copy.totalPartial : snapshot.partial ? copy.totalIncomplete : null,
    snapshotShowsHomestagingEstimate(snapshot) ? copy.homestagingEstimate : null,
    copy.priceNote,
  ].filter((line): line is string => Boolean(line));
}

export function priceSnapshotToJson(snapshot: PriceSnapshot | null): Json | null {
  if (!snapshot) return null;
  return {
    tier: snapshot.tier,
    lines: snapshot.lines.map((line) => ({
      itemKey: line.itemKey,
      labelDe: line.labelDe,
      labelEn: line.labelEn,
      unit: line.unit,
      quantity: line.quantity,
      unitNetCents: line.unitNetCents,
      lineNetCents: line.lineNetCents,
    })),
    estimatedNetCents: snapshot.estimatedNetCents,
    partial: snapshot.partial,
    onRequest: snapshot.onRequest,
  };
}

function parseCents(value: unknown): number | null | undefined {
  if (value === null) return null;
  if (typeof value === "number" && Number.isInteger(value)) return value;
  return undefined;
}

function parseLine(value: unknown): PriceSnapshotLine | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.itemKey !== "string" || !isPriceItemKey(record.itemKey)) return null;
  if (typeof record.unit !== "string" || !isPriceUnit(record.unit)) return null;
  if (typeof record.quantity !== "number" || !Number.isInteger(record.quantity) || record.quantity < 0) return null;
  const unitNetCents = parseCents(record.unitNetCents);
  const lineNetCents = parseCents(record.lineNetCents);
  if (unitNetCents === undefined || lineNetCents === undefined) return null;
  return {
    itemKey: record.itemKey,
    labelDe: cleanLabel(typeof record.labelDe === "string" ? record.labelDe : ""),
    labelEn: cleanLabel(typeof record.labelEn === "string" ? record.labelEn : ""),
    unit: record.unit,
    quantity: record.quantity,
    unitNetCents,
    lineNetCents,
  };
}

export function priceSnapshotFromJson(value: Json | null | undefined): PriceSnapshot | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, Json | undefined>;
  const tier = parsePricingTier(typeof record.tier === "string" ? record.tier : null);
  if (!tier || !Array.isArray(record.lines)) return null;
  const lines: PriceSnapshotLine[] = [];
  for (const entry of record.lines) {
    const line = parseLine(entry);
    if (!line) return null;
    lines.push(line);
  }
  const estimatedNetCents = parseCents(record.estimatedNetCents);
  if (estimatedNetCents === undefined) return null;
  if (typeof record.partial !== "boolean" || typeof record.onRequest !== "boolean") return null;
  return {
    tier,
    lines,
    estimatedNetCents,
    partial: record.partial,
    onRequest: record.onRequest,
  };
}

export async function loadOwnPriceCatalog(supabase: SessionClient): Promise<PriceLoadResult> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return { status: "error" };

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("is_approved, pricing_tier")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (clientError) return { status: "error" };
  if (!client?.is_approved) return { status: "hidden" };
  const tier = parsePricingTier(client.pricing_tier);
  if (!tier) return { status: "hidden" };

  const { data, error } = await supabase
    .from("pricing_tier_prices")
    .select("tier, item_key, label_de, label_en, unit, price_net_cents, sort_order, active")
    .eq("active", true);

  if (error || !data) return { status: "error" };
  return { status: "ready", catalog: catalogFromRows(tier, data) };
}

export function individualPhotoItemKey(): PriceItemKey {
  return "individual_photo";
}

export function bookingFeeItemKey(): PriceItemKey {
  return "booking_fee";
}

import type { Json } from "./database.types";
import {
  isPriceItemKey,
  type PriceSnapshot,
  type PriceSnapshotLine,
  type PriceUnit,
} from "./clientPricing";

export const PRICING_TIERS = ["standard", "legacy", "corporate"] as const;
export type PricingTier = (typeof PRICING_TIERS)[number];

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

function cleanLabel(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 200);
}

function isPriceUnit(value: string): value is PriceUnit {
  return value === "flat" || value === "per_photo";
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
  if (typeof record.quantity !== "number" || !Number.isInteger(record.quantity) || record.quantity < 0) {
    return null;
  }
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

function parseHomestagingPhotoCount(value: unknown): number | null | undefined {
  if (value == null) return null;
  if (typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 50) return value;
  return undefined;
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
    homestagingPhotoCount: snapshot.homestagingPhotoCount,
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
  const homestagingPhotoCount = parseHomestagingPhotoCount(record.homestagingPhotoCount);
  if (homestagingPhotoCount === undefined) return null;
  return {
    tier,
    lines,
    estimatedNetCents,
    partial: record.partial,
    onRequest: record.onRequest,
    homestagingPhotoCount,
  };
}

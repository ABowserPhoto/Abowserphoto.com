import { catalogFromRows, type PriceCatalog } from "./clientPricing";
import { parsePricingTier } from "./pricingTier";
import { createServiceClient } from "./supabase/admin";

/** Reads the caller's tier on the server. The result is stored, never sent to the browser. */
export async function loadSnapshotCatalog(userId: string): Promise<PriceCatalog | null> {
  const supabase = createServiceClient();
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, is_approved")
    .eq("user_id", userId)
    .maybeSingle();

  if (clientError) throw new Error("price catalog unavailable");
  if (!client?.is_approved) return null;

  const { data: assigned, error: tierError } = await supabase
    .from("client_pricing_tiers")
    .select("tier")
    .eq("client_id", client.id)
    .maybeSingle();

  if (tierError) throw new Error("price catalog unavailable");
  const tier = parsePricingTier(assigned?.tier);
  if (!tier) return null;

  const { data, error } = await supabase
    .from("pricing_tier_prices")
    .select("tier, item_key, label_de, label_en, unit, price_net_cents, sort_order, active")
    .eq("tier", tier)
    .eq("active", true);

  if (error || !data) throw new Error("price catalog unavailable");
  return catalogFromRows(tier, data);
}

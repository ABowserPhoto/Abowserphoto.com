"use server";

import { clientPriceItemsFromRows, type DisplayedPriceLoad } from "../lib/clientPricing";
import { createClient } from "../lib/supabase/server";

export async function loadBookingPrices(): Promise<DisplayedPriceLoad> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return { status: "hidden" };

  const { data, error } = await supabase.rpc("get_my_booking_prices");
  if (error || !data) return { status: "error" };

  const items = clientPriceItemsFromRows(data);
  if (items.length === 0) return { status: "hidden" };
  return { status: "ready", items };
}

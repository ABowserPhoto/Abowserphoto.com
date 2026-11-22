import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";
import { getSupabaseUrl } from "./env";

export function createServiceClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase service role is not configured.");
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

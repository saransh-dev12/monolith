import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/env";
import type { Database } from "@/types/database";

// This client bypasses RLS. Use it only for account lifecycle operations
// that act on the verified session user (deletion), never for reading user
// data or with an identity supplied by the request body.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Account administration is not configured.");
  const { url } = getSupabaseConfig();
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

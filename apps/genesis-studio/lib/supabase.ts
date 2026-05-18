import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser/server Supabase client.
 * Returns null when env is missing — UI stays in stub mode (no throw on load).
 */
export function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

/** Singleton for client components */
let browserClient: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (typeof window === 'undefined') {
    return createSupabaseClient();
  }
  if (browserClient === undefined) {
    browserClient = createSupabaseClient();
  }
  return browserClient;
}

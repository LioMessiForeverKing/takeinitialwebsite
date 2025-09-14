"use client";

import { createClient } from "@supabase/supabase-js";

// Create a browser client using public env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    autoRefreshToken: true,
  },
});

export default supabase;



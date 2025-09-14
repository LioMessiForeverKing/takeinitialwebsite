"use client";

import { useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";

export default function AuthUrlHandler() {
  useEffect(() => {
    // With explicit /auth/callback, this global handler is mostly redundant.
    // We keep a no-op to avoid interfering with other pages.
  }, []);

  return null;
}



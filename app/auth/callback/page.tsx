"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/app/lib/supabaseClient";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    let isMounted = true;
    async function run() {
      try {
        // Trigger session detection + PKCE code exchange automatically
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          if (!isMounted) return;
          setMessage(`Sign-in failed: ${error?.message ?? "no session returned"}`);
          return;
        }
        const next = searchParams.get("next") || "/welcome";
        router.replace(next);
      } catch (err) {
        if (!isMounted) return;
        setMessage("Unexpected error during sign-in.");
      }
    }
    run();
    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">{message}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}



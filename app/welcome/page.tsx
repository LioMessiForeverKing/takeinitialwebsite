"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import supabase from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { theme } from "../theme/theme";

export default function WelcomePage() {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    let redirected = false;
    async function guard() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session) return;

      // Wait briefly for session hydration, then decide
      const timer = setTimeout(async () => {
        if (!mounted || redirected) return;
        const { data: retry } = await supabase.auth.getSession();
        if (!retry.session && !redirected) {
          redirected = true;
          router.replace("/");
        }
      }, 400);

      // Also listen for auth events during this window
      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted || redirected) return;
        if (session) {
          clearTimeout(timer);
        }
      });

      return () => {
        clearTimeout(timer);
        sub.subscription.unsubscribe();
      };
    }
    const cleanupPromise = guard();
    return () => {
      mounted = false;
      // best-effort cleanup if guard returned a cleanup function
      if (typeof cleanupPromise === 'function') {
        try { (cleanupPromise as unknown as () => void)(); } catch {}
      }
    };
  }, [router]);

  // Load whether the user already created a profile
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!mounted) return;
      const uid = sessionData.session?.user?.id;
      if (!uid) {
        setHasProfile(null);
        return;
      }
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", uid)
        .maybeSingle();
      if (!mounted) return;
      setHasProfile(!!profile);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-dvh w-full relative overflow-hidden p-4 sm:p-6 md:p-8 bg-white">
      {/* Clean white background */}

      {/* Content */}
      <div className="relative z-10 min-h-dvh flex items-center justify-center">
        <div className="mx-4 sm:mx-6 max-w-xl sm:max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 text-center border-2 border-black/30">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Image src="/logo.svg" alt="tAke logo" width={64} height={64} className="sm:w-[80px] sm:h-[80px]" />
          </div>
          <h1 className="font-primary text-3xl sm:text-5xl md:text-6xl text-black mb-3 sm:mb-4">Welcome to tAke</h1>
          <p className="font-primary text-lg sm:text-xl md:text-2xl text-black/80 mb-6 sm:mb-2">You're signed in.</p>
          
          {/* Sign Out Button */}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="mb-6 bg-red-500/80 hover:bg-red-600/80 text-white rounded-lg px-4 py-2 font-medium text-sm transition-colors duration-200 backdrop-blur-sm border border-red-400/30"
          >
            Sign Out
          </button>

          <div className="mt-8">
            {hasProfile === null && (
              <button
                disabled
                className="w-full sm:w-auto bg-black/60 text-white rounded-xl px-6 py-3 font-bold text-base sm:text-lg shadow-lg cursor-wait"
              >
                Loading…
              </button>
            )}
            {hasProfile === true && (
              <div className="w-full sm:w-auto rounded-xl px-6 py-3 font-bold text-base sm:text-lg bg-white/80 text-black border-2 border-black/20 inline-block shadow-lg">
                Thank you for creating your profile — keep an eye out for updates!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



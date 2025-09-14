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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-4 sm:mx-6 max-w-2xl sm:max-w-3xl w-full bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center border border-gray-200/50"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="relative">
              <Image src="/logo.svg" alt="tAke logo" width={80} height={80} className="sm:w-[100px] sm:h-[100px]" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10 rounded-full blur-xl"></div>
            </div>
          </motion.div>

          {/* Welcome heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="font-primary text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-4 sm:mb-6"
            style={{ fontFamily: theme.fonts.primary }}
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              tAke
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="font-secondary text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed"
            style={{ fontFamily: theme.fonts.secondary }}
          >
            You're signed in and ready to go!
          </motion.p>

          {/* Status section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-10"
          >
            {hasProfile === null && (
              <div className="w-full sm:w-auto bg-gray-100 text-gray-700 rounded-2xl px-6 py-4 font-medium text-base sm:text-lg shadow-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading…
                </div>
              </div>
            )}
            {hasProfile === true && (
              <div className="w-full sm:w-auto rounded-2xl px-6 py-4 font-medium text-base sm:text-lg bg-gradient-to-r from-green-50 to-blue-50 text-gray-800 border border-green-200/50 inline-block shadow-sm">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Thank you for creating your profile — keep an eye out for updates!
                </div>
              </div>
            )}
          </motion.div>

          {/* Sign out button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
            className="mt-8 sm:mt-10"
          >
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
              className="bg-red-500/90 hover:bg-red-600/90 text-white rounded-xl px-6 py-3 font-medium text-sm sm:text-base transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto"
              style={{ fontFamily: theme.fonts.secondary }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Sign Out
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}



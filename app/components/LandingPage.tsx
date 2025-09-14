"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { theme } from '../theme/theme';
import supabase from "../lib/supabaseClient";

const LandingPage = () => {
  const router = useRouter();

  // Check for existing session and redirect to welcome if signed in
  useEffect(() => {
    let mounted = true;
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (mounted && data.session) {
        router.replace('/welcome');
      }
    }
    checkSession();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
        }} />
      </div>

      <div className="relative z-10 min-h-dvh flex flex-col items-center justify-between px-4 sm:px-6 md:px-8 py-8">
        {/* Top Section - Logo and Content */}
        <div className="flex flex-col items-center text-center flex-1 justify-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8 sm:mb-12"
          >
            <div 
              className="text-6xl sm:text-7xl md:text-8xl font-primary text-gray-900 relative"
              style={{ fontFamily: theme.fonts.primary }}
            >
              <span className="relative z-10">t.</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10 rounded-full blur-xl"></div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-primary text-gray-900 mb-6 sm:mb-8 leading-tight tracking-tight"
              style={{ fontFamily: theme.fonts.primary }}
            >
              We believe the internet should help you know your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                friends
              </span>.
            </h1>

            {/* Subheading */}
            <p 
              className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed font-light"
              style={{ fontFamily: theme.fonts.secondary }}
            >
              Not the random people you follow on Instagram or TikTok.
            </p>

            {/* Description */}
            <div 
              className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 leading-relaxed space-y-4 max-w-3xl mx-auto"
              style={{ fontFamily: theme.fonts.secondary }}
            >
              <p className="font-light">
                We're betting you want deeper, everyday closeness with your actual people.
              </p>
              <p className="font-light">
                We're building a tiny daily ritual to make that real.
              </p>
              <p className="font-medium text-gray-900 text-lg sm:text-xl">
                If this resonates, sign up and help us build it.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - Scroll Indicator and Button */}
        <div className="flex flex-col items-center w-full">
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-gray-500 text-sm font-medium"
                style={{ fontFamily: theme.fonts.secondary }}
              >
                ↓ Sign up below ↓
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1 h-3 bg-gray-500 rounded-full mt-2"
                />
              </motion.div>
            </div>
          </motion.div>

        {/* Google Sign Up Button */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="w-full max-w-lg"
        >
          <button 
            onClick={async () => {
              // Check if already signed in
              const { data } = await supabase.auth.getSession();
              if (data.session) {
                // If already signed in, redirect directly to welcome
                router.push('/welcome');
                return;
              }

              // If not signed in, proceed with OAuth
              const baseUrl =
                process.env.NEXT_PUBLIC_SITE_URL ??
                (typeof window !== 'undefined' ? window.location.origin : '');
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  // Use the explicit auth callback route so exchanges happen off the landing page
                  redirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent('/welcome')}`,
                  queryParams: { access_type: "offline", prompt: "consent" },
                },
              });
            }}
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 hover:text-gray-900 rounded-2xl px-8 py-5 font-medium text-lg sm:text-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl flex items-center justify-center gap-4 group transform hover:scale-105"
            style={{ fontFamily: theme.fonts.secondary }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="group-hover:scale-110 transition-transform duration-200"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-8"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-medium" style={{ fontFamily: theme.fonts.secondary }}>N</span>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
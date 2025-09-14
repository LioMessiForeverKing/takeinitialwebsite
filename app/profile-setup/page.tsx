"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { theme } from "../theme/theme";
import supabase from "@/app/lib/supabaseClient";

type ProfileFormState = {
  fullName: string;
  phone: string;
  avatarFile: File | null;
  avatarPreviewUrl: string | null;
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  const [form, setForm] = useState<ProfileFormState>({
    fullName: "",
    phone: "",
    avatarFile: null,
    avatarPreviewUrl: null,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const uid = data.session?.user?.id ?? null;
      setSessionUserId(uid);
      if (!uid) router.replace("/");
      if (!uid) return;
      // Load existing profile if any
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name, phone, avatar_url")
        .eq("user_id", uid)
        .maybeSingle();
      if (profile) {
        setForm((prev) => ({
          ...prev,
          fullName: profile.full_name ?? "",
          phone: profile.phone ?? "",
          avatarPreviewUrl: profile.avatar_url ?? null,
        }));
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  const isValid = useMemo(() => {
    return form.fullName.trim().length > 1;
  }, [form.fullName]);

  async function handleAvatarUpload(userId: string): Promise<string | null> {
    if (!form.avatarFile) return form.avatarPreviewUrl; // no change
    const fileExt = form.avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(path, form.avatarFile, { upsert: false, cacheControl: "3600" });
    if (error) {
      setError(error.message);
      return null;
    }
    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionUserId || !isValid) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const avatarUrl = await handleAvatarUpload(sessionUserId);
      if (form.avatarFile && !avatarUrl) return; // upload failed

      // Upsert profile for current user
      const { error: upsertError } = await supabase.from("user_profiles").upsert(
        {
          user_id: sessionUserId,
          full_name: form.fullName.trim(),
          phone: form.phone.trim() || null,
          avatar_url: avatarUrl ?? null,
        },
        { onConflict: "user_id" }
      );
      if (upsertError) throw upsertError;
      setSuccess("Profile saved!");
      // Small delay for UX then navigate back or wherever you want
      setTimeout(() => router.replace("/welcome"), 800);
    } catch (err: any) {
      setError(err?.message ?? "Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-6 md:p-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-4 sm:mx-6 max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-gray-200/50"
        >
          <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="relative mb-6"
            >
              <Image src="/logo.svg" alt="tAke logo" width={72} height={72} className="sm:w-[80px] sm:h-[80px]" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10 rounded-full blur-xl"></div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="font-primary text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-3"
              style={{ fontFamily: theme.fonts.primary }}
            >
              Pre‑make your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                profile
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="font-secondary text-base sm:text-lg text-gray-600"
              style={{ fontFamily: theme.fonts.secondary }}
            >
              Answer a few basics so you're ready.
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <div>
              <label className="block font-secondary text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: theme.fonts.secondary }}>
                Your name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="Jane Doe"
                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-4 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                style={{ fontFamily: theme.fonts.secondary }}
              />
            </div>

            <div>
              <label className="block font-secondary text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: theme.fonts.secondary }}>
                Phone number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-4 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                style={{ fontFamily: theme.fonts.secondary }}
              />
            </div>

            <div>
              <label className="block font-secondary text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: theme.fonts.secondary }}>
                Profile picture
              </label>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                  {form.avatarPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.avatarPreviewUrl} alt="avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No photo</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setForm((f) => ({ ...f, avatarFile: file }));
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setForm((f) => ({ ...f, avatarPreviewUrl: reader.result as string }));
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block font-secondary text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: theme.fonts.secondary }}>
                Add your creatives
              </label>
              <div className="w-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 flex flex-col items-center justify-center text-center">
                <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-secondary text-base text-gray-600 mb-2" style={{ fontFamily: theme.fonts.secondary }}>Coming soon</span>
                <span className="text-sm text-gray-500 mb-1">Connect your creatives</span>
                <span className="text-xs uppercase tracking-wide text-gray-400">Powered by Yubi</span>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-2xl px-4 py-3"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-2xl px-4 py-3"
              >
                {success}
              </motion.div>
            )}

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
                style={{ fontFamily: theme.fonts.secondary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || loading}
                className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ fontFamily: theme.fonts.secondary }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving…
                  </div>
                ) : (
                  "Save profile"
                )}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}



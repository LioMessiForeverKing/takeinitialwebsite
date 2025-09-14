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
    <div className="min-h-dvh w-full relative overflow-hidden p-4 sm:p-6 md:p-8 bg-white">
      {/* Clean white background */}

      <div className="relative z-10 min-h-dvh flex items-start sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-4 sm:mx-6 max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-black/20"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <Image src="/logo.svg" alt="tAke logo" width={56} height={56} className="mb-3" />
            <h1 className="font-primary text-2xl sm:text-3xl md:text-4xl text-black">Pre‑make your profile</h1>
            <p className="font-primary text-sm sm:text-base text-black/70 mt-1">Answer a few basics so you’re ready.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-primary text-sm text-black/80 mb-2">Your name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="Jane Doe"
                className="w-full rounded-xl border-2 border-black/20 bg-white px-4 py-3 text-black placeholder-black/40 outline-none focus:border-black/50"
              />
            </div>

            <div>
              <label className="block font-primary text-sm text-black/80 mb-2">Phone number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="w-full rounded-xl border-2 border-black/20 bg-white px-4 py-3 text-black placeholder-black/40 outline-none focus:border-black/50"
              />
            </div>

            <div>
              <label className="block font-primary text-sm text-black/80 mb-2">Profile picture</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black/20 bg-white flex items-center justify-center">
                  {form.avatarPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.avatarPreviewUrl} alt="avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-black/40 text-xs">No photo</span>
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
                  className="block text-sm text-black/80"
                />
              </div>
            </div>

            <div>
              <label className="block font-primary text-sm text-black/80 mb-2">Add your creatives</label>
              <div className="w-full rounded-xl border-2 border-dashed border-black/20 bg-white px-4 py-6 flex flex-col items-center justify-center text-center">
                <span className="font-primary text-base text-black/70">Coming soon</span>
                <span className="mt-2 text-xs text-black/50">Connect your creatives</span>
                <span className="mt-1 text-[10px] uppercase tracking-wide text-black/40">Powered by Yubi</span>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-700">{success}</p>}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-xl border-2 border-black/20 bg-white px-5 py-2.5 text-black hover:border-black/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || loading}
                className="rounded-xl bg-black text-white px-6 py-2.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors"
              >
                {loading ? "Saving…" : "Save profile"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}



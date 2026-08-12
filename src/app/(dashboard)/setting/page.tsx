"use client";

import { useState, useEffect } from "react";
import { useSession, updateUser, signOut } from "@/lib/auth-client";
import { Avatar } from "@avatune/react";
import theme from "@avatune/yanliu-theme/react";
import { useRouter } from "next/navigation";
import {
  User,
  RefreshCw,
  Check,
  LogOut,
  ShieldCheck,
  Mail,
  Sparkles,
  Loader2,
} from "lucide-react";

const avatarPresets = {
  male: ["alex-m", "david-m", "ethan-m", "marcus-m", "liam-m"],
  female: ["sophia-f", "emma-f", "olivia-f", "maya-f", "chloe-f"],
};

export default function SettingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setAvatarSeed(
        session.user.image || session.user.email || session.user.name || "ryuk-seed"
      );
    }
  }, [session]);

  const handleRandomize = () => {
    const randomSeed = `user-${Math.random().toString(36).substring(2, 9)}`;
    setAvatarSeed(randomSeed);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await updateUser({
        name: name.trim(),
        image: avatarSeed,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-3" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-ink tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-ink-3 mt-1">
          Manage your public profile, avatar preferences, and account security.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile & Avatar Customization Card */}
        <div className="rounded-2xl bg-paper-2 border border-line-2 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-line-2 pb-4">
            <h2 className="text-sm font-display font-semibold text-ink uppercase tracking-wider font-code flex items-center gap-2">
              <User className="h-4 w-4 text-ink-3" />
              Profile & Avatar
            </h2>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                <Check className="h-3.5 w-3.5" />
                Changes saved
              </span>
            )}
          </div>

          {/* Avatar Preview & Randomizer */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-paper-3 border border-line-2">
            <div className="relative group shrink-0">
              <div className="rounded-full ring-4 ring-ink/10 p-1.5 bg-paper shadow-md">
                <Avatar theme={theme} seed={avatarSeed || "ryuk-user"} size={84} />
              </div>
              <button
                type="button"
                onClick={handleRandomize}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-ink text-paper hover:bg-ink-2 shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
                title="Generate Random Avatar"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-sm font-semibold text-ink">Avatune Avatar</h3>
              <p className="text-xs text-ink-3 max-w-sm">
                Select an avatar preset below or click the randomize icon to generate a unique personalized avatar.
              </p>
            </div>
          </div>

          {/* Display Name Input */}
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-paper-card border border-line-2 text-ink text-sm placeholder:text-ink-4 focus:outline-none focus:border-ink transition"
            />
          </div>

          {/* Avatar Presets Selection */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-medium text-ink-2 uppercase tracking-wider font-code">
              Avatar Presets
            </label>

            {/* Male Styles */}
            <div>
              <span className="text-[11px] text-ink-3 font-code mb-2 block">
                Male Styles
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {avatarPresets.male.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAvatarSeed(preset)}
                    className={`p-1.5 rounded-full border transition shrink-0 cursor-pointer ${
                      avatarSeed === preset
                        ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-500/10"
                        : "border-line-2 hover:border-ink"
                    }`}
                  >
                    <Avatar theme={theme} seed={preset} size={44} />
                  </button>
                ))}
              </div>
            </div>

            {/* Female Styles */}
            <div>
              <span className="text-[11px] text-ink-3 font-code mb-2 block">
                Female Styles
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {avatarPresets.female.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAvatarSeed(preset)}
                    className={`p-1.5 rounded-full border transition shrink-0 cursor-pointer ${
                      avatarSeed === preset
                        ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-500/10"
                        : "border-line-2 hover:border-ink"
                    }`}
                  >
                    <Avatar theme={theme} seed={preset} size={44} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Profile Button */}
          <div className="flex justify-end pt-4 border-t border-line-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper font-medium text-xs hover:bg-ink-2 transition shadow-sm active:translate-y-px cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin text-paper" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>

      {/* Account Info Card */}
      <div className="rounded-2xl bg-paper-2 border border-line-2 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-display font-semibold text-ink uppercase tracking-wider font-code flex items-center gap-2 border-b border-line-2 pb-4">
          <ShieldCheck className="h-4 w-4 text-ink-3" />
          Account Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-paper-3 border border-line-2 space-y-1">
            <span className="text-[11px] font-code uppercase text-ink-3 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email Address
            </span>
            <p className="text-sm font-medium text-ink truncate">
              {session?.user?.email || "guest@ryuk.dev"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-paper-3 border border-line-2 space-y-1">
            <span className="text-[11px] font-code uppercase text-ink-3 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Authentication Status
            </span>
            <p className="text-sm font-medium text-ink">
              {session?.user ? "Authenticated Account" : "Guest Mode"}
            </p>
          </div>
        </div>
      </div>

      {/* Danger / Session Actions */}
      <div className="rounded-2xl bg-paper-2 border border-line-2 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-display font-semibold text-rose-500 uppercase tracking-wider font-code flex items-center gap-2 border-b border-line-2 pb-4">
          <LogOut className="h-4 w-4 text-rose-500" />
          Session & Account Actions
        </h2>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium text-ink">Sign Out</p>
            <p className="text-xs text-ink-3">
              Log out of your current session on this device.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

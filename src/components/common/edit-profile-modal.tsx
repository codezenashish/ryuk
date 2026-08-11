"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "@avatune/react";
import theme from "@avatune/yanliu-theme/react";
import { useSession } from "@/lib/auth-client";
import { X, Check, RefreshCw } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedProfile: { name: string; avatarSeed: string }) => void;
}

// Preset seeds categorized by style / gender preferences
const avatarPresets = {
  male: ["alex-m", "david-m", "ethan-m", "marcus-m", "liam-m"],
  female: ["sophia-f", "emma-f", "olivia-f", "maya-f", "chloe-f"],
};

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setAvatarSeed(
        session.user.image || session.user.email || session.user.name || "ryuk-seed"
      );
    }
  }, [session]);

  if (!isOpen || !mounted) return null;

  const handleRandomize = () => {
    const randomSeed = `user-${Math.random().toString(36).substring(2, 9)}`;
    setAvatarSeed(randomSeed);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ name, avatarSeed });
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-md p-4 sm:p-6">
      <div className="my-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-paper-2 border border-line-2 p-6 shadow-2xl relative text-ink animate-in fade-in zoom-in-95 duration-200 scrollbar-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-ink-3 hover:text-ink hover:bg-paper-3 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-display font-semibold text-ink mb-1">
          Edit Profile & Avatar
        </h2>
        <p className="text-xs text-ink-3 mb-6">
          Customize your display name and Avatune avatar style
        </p>

        {/* Live Avatar Preview Card */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-paper-3 border border-line mb-6 relative">
          <div className="relative group">
            <div className="rounded-full ring-4 ring-ink/10 p-1 bg-paper shadow-lg">
              <Avatar theme={theme} seed={avatarSeed || "preview"} size={84} />
            </div>
            <button
              type="button"
              onClick={handleRandomize}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-ink text-paper hover:bg-ink-2 shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
              title="Randomize avatar"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Name Field */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-lg bg-paper-card border border-line-2 text-ink text-sm focus:outline-none focus:border-ink transition"
          />
        </div>

        {/* Avatar Presets Selection */}
        <div className="mb-6 space-y-4">
          <label className="block text-xs font-medium text-ink-2 uppercase tracking-wider font-code">
            Choose Avatar Style
          </label>

          {/* Male Styles */}
          <div>
            <span className="text-[11px] text-ink-3 font-code mb-1.5 block">Male Styles</span>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
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
                  <Avatar theme={theme} seed={preset} size={42} />
                </button>
              ))}
            </div>
          </div>

          {/* Female Styles */}
          <div>
            <span className="text-[11px] text-ink-3 font-code mb-1.5 block">Female Styles</span>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
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
                  <Avatar theme={theme} seed={preset} size={42} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-ink-3 hover:text-ink transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-ink text-paper font-medium text-sm hover:bg-ink-2 transition shadow-sm active:translate-y-px cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

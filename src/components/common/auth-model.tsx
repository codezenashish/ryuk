"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { signIn } from "@/lib/auth-client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSocialLogin = async (provider: "github" | "google") => {
    try {
      setLoading(true);
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Social login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 border border-zinc-800 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome to Ryuk</h2>
        <p className="text-sm text-zinc-400 text-center mb-6">Continue with your account</p>

        <div className="space-y-3">
          <button
            disabled={loading}
            onClick={() => handleSocialLogin("github")}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium flex items-center justify-center gap-2 transition"
          >
            Continue with GitHub
          </button>

          <button
            disabled={loading}
            onClick={() => handleSocialLogin("google")}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-black font-medium flex items-center justify-center gap-2 transition"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = "signin",
}: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState(defaultMode);

  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  const appearance = {
    elements: {
      rootBox: "w-full",
      card: "w-full shadow-none border-0 bg-transparent",
    },
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-line-2 bg-paper-2 p-3 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-ink-3 transition hover:bg-paper-3 hover:text-ink"
          aria-label="Close authentication dialog"
        >
          <X className="h-5 w-5" />
        </button>
        {mode === "signin" ? (
          <SignIn
            appearance={appearance}
            routing="hash"
            fallbackRedirectUrl="/dashboard"
            signUpUrl="#signup"
            afterSignOutUrl="/"
          />
        ) : (
          <SignUp
            appearance={appearance}
            routing="hash"
            fallbackRedirectUrl="/dashboard"
            signInUrl="#signin"
          />
        )}
        <button
          type="button"
          onClick={() => setMode((current) => (current === "signin" ? "signup" : "signin"))}
          className="mx-auto mb-3 block text-xs text-ink-3 underline hover:text-ink"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>,
    document.body
  );
}

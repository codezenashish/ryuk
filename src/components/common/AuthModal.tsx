"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { createPortal } from "react-dom";
import { useEffect, useState, useCallback } from "react";

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
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);

  const syncHash = useCallback(() => {
    const hash = window.location.hash;
    if (hash.includes("signup")) setMode("signup");
    else if (hash.includes("signin")) setMode("signin");
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [isOpen, syncHash]);

  // Clean up hash when modal closes
  useEffect(() => {
    if (!isOpen && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {mode === "signup" ? (
        <SignUp
          routing="hash"
          fallbackRedirectUrl="/dashboard"
          signInUrl="#signin"
        />
      ) : (
        <SignIn
          routing="hash"
          fallbackRedirectUrl="/dashboard"
          signUpUrl="#signup"
          afterSignOutUrl="/"
        />
      )}
    </div>,
    document.body
  );
}

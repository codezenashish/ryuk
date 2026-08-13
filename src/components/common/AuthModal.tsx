"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

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

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash.includes("signup")) {
        setMode("signup");
      } else if (hash.includes("signin")) {
        setMode("signin");
      }
    };

    handleHashCheck();

    const originalPush = history.pushState;
    const originalReplace = history.replaceState;

    history.pushState = function (...args) {
      originalPush.apply(this, args);
      handleHashCheck();
    };

    history.replaceState = function (...args) {
      originalReplace.apply(this, args);
      handleHashCheck();
    };

    window.addEventListener("hashchange", handleHashCheck);
    window.addEventListener("popstate", handleHashCheck);
    const timer = setInterval(handleHashCheck, 150);

    return () => {
      history.pushState = originalPush;
      history.replaceState = originalReplace;
      window.removeEventListener("hashchange", handleHashCheck);
      window.removeEventListener("popstate", handleHashCheck);
      clearInterval(timer);
    };
  }, [isOpen]);

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
          forceRedirectUrl="/dashboard"
          signInUrl="#signin"
        />
      ) : (
        <SignIn
          routing="hash"
          forceRedirectUrl="/dashboard"
          signUpUrl="#signup"
          afterSignOutUrl="/"
        />
      )}
    </div>,
    document.body
  );
}

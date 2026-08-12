"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setError(null);
    setEmailLoading(false);
    setSocialLoading(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
    setError(null);
  };

  const handleSocialAuth = async (provider: "google" | "github") => {
    setError(null);
    setSocialLoading(provider);

    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to sign in with ${provider}`;
      setError(errorMessage);
      setSocialLoading(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setEmailLoading(true);

    try {
      if (mode === "signup") {
        const res = await signUp.email({
          email: email.trim(),
          password,
          name: name.trim(),
          callbackURL: "/dashboard",
        });

        if (res?.error) {
          setError(res.error.message || "Failed to create account. Email may already exist.");
        } else {
          handleClose();
          router.push("/dashboard");
        }
      } else {
        const res = await signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/dashboard",
        });

        if (res?.error) {
          setError(res.error.message || "Invalid email or password.");
        } else {
          handleClose();
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setEmailLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const isAnyLoading = emailLoading || socialLoading !== null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl bg-paper-2 border border-line-2 p-6 shadow-2xl relative text-ink animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-full p-2 text-ink-3 hover:text-ink hover:bg-paper-3 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-display font-semibold text-ink mb-1">
          {mode === "signin" ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="text-xs text-ink-3 mb-6">
          {mode === "signin"
            ? "Sign in to access your dashboard & bookmarks"
            : "Sign up to start saving and organizing your links"}
        </p>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 mb-4">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <div className="space-y-2.5">
          <button
            type="button"
            disabled={isAnyLoading}
            onClick={() => handleSocialAuth("google")}
            className="w-full py-2.5 px-4 rounded-xl bg-paper-3 hover:bg-paper-card text-ink font-medium text-sm border border-line-2 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {socialLoading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin text-ink-3" />
            ) : (
              <FcGoogle className="h-5 w-5" />
            )}
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            disabled={isAnyLoading}
            onClick={() => handleSocialAuth("github")}
            className="w-full py-2.5 px-4 rounded-xl bg-paper-3 hover:bg-paper-card text-ink font-medium text-sm border border-line-2 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {socialLoading === "github" ? (
              <Loader2 className="h-4 w-4 animate-spin text-ink-3" />
            ) : (
              <FaGithub className="h-5 w-5 text-ink" />
            )}
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-line-2" />
          </div>
          <span className="relative bg-paper-2 px-3 text-[11px] font-code uppercase tracking-wider text-ink-3">
            OR
          </span>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-ink-3" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isAnyLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-paper-card border border-line-2 text-ink text-sm placeholder:text-ink-4 focus:outline-none focus:border-ink transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-ink-3" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAnyLoading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-paper-card border border-line-2 text-ink text-sm placeholder:text-ink-4 focus:outline-none focus:border-ink transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-ink-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAnyLoading}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-paper-card border border-line-2 text-ink text-sm placeholder:text-ink-4 focus:outline-none focus:border-ink transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isAnyLoading}
                tabIndex={-1}
                className="absolute right-3.5 text-ink-3 hover:text-ink transition cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnyLoading}
            className="w-full py-2.5 rounded-xl bg-ink text-paper font-medium text-sm hover:bg-ink-2 transition shadow-sm active:translate-y-px cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {emailLoading && <Loader2 className="h-4 w-4 animate-spin text-paper" />}
            <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-ink-3">
          {mode === "signin" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                disabled={isAnyLoading}
                className="font-medium text-ink hover:underline transition cursor-pointer ml-0.5"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                disabled={isAnyLoading}
                className="font-medium text-ink hover:underline transition cursor-pointer ml-0.5"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

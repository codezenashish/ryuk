"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@ryuk/auth/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage("Verification email sent. Please check your inbox!");
    }
    setLoading(false);
  };

  const handleOAuth = (provider: "github" | "google") => {
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-zinc-100 px-4">
      <div className="w-full max-w-sm border border-zinc-800 bg-zinc-950 p-6">
        <h1 className="text-xl font-bold tracking-tight mb-1">
          Create Ryuk Account
        </h1>
        <p className="text-xs text-zinc-400 mb-6">
          Personal knowledge operating system
        </p>

        <div className="flex flex-col gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleOAuth("github")}
            className="w-full border border-zinc-700 bg-zinc-900 py-2 text-sm hover:bg-zinc-800 transition"
          >
            Continue with GitHub
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="w-full border border-zinc-700 bg-zinc-900 py-2 text-sm hover:bg-zinc-800 transition"
          >
            Continue with Google
          </button>
        </div>

        <div className="relative my-4 text-center text-xs text-zinc-500">
          <span className="bg-zinc-950 px-2 relative z-10">OR</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
          />
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
          />

          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          {message && (
            <p className="text-xs text-emerald-400 mt-1">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-2 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-50 mt-1"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-xs text-zinc-400 hover:text-white"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

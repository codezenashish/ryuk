"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@ryuk/auth/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserSupabaseClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/bookmarks");
      router.refresh();
    }
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
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <Link
            href="/"
            aria-label="Back to home"
            className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:opacity-90 active:scale-95 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary-foreground">
              <path
                d="M18.8 8.8C20.8 10 21.4 11.5 20.3 12.8C18.5 15 14 16.7 9.3 16.9C7.2 17 5.5 16.6 4.4 15.7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="5" fill="currentColor" />
              <path
                d="M5.2 15.2C3.2 14 2.6 12.5 3.7 11.2C5.5 9 10 7.3 14.7 7.1C16.8 7 18.5 7.4 19.6 8.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Sign In to Ryuk
            </h1>
            <p className="text-xs text-muted-foreground">
              Personal knowledge operating system
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mb-5">
          <button
            type="button"
            onClick={() => handleOAuth("github")}
            className="w-full rounded-xl border border-border bg-background hover:bg-muted text-foreground py-2.5 text-sm font-medium transition cursor-pointer"
          >
            Continue with GitHub
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="w-full rounded-xl border border-border bg-background hover:bg-muted text-foreground py-2.5 text-sm font-medium transition cursor-pointer"
          >
            Continue with Google
          </button>
        </div>

        <div className="relative my-4 text-center text-xs text-muted-foreground">
          <span className="bg-card px-2 relative z-10">OR</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
          <div>
            <label htmlFor="login-email" className="block text-xs font-medium text-foreground mb-1.5">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-medium text-foreground mb-1.5">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-xs text-destructive mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 mt-1 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link
            href="/signup"
            className="text-xs text-muted-foreground hover:text-foreground transition"
          >
            Don't have an account? <span className="font-medium text-foreground underline underline-offset-4">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

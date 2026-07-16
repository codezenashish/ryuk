"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        setErrorMessage(error.message || "Unable to sign in. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign in. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm p-6 sm:p-10">
      <div className="space-y-2">
        <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-violet-400 uppercase">
          Welcome back
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Log in to DevSpace
        </h1>
        <p className="text-sm text-zinc-400">
          Enter your details to access your workspace.
        </p>
      </div>

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="name@example.com"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-violet-400 transition hover:text-violet-300 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="Enter your password"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {errorMessage && (
          <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {errorMessage}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-violet-600 py-5 font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

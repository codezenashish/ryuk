"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({ name, email, password });

      if (error) {
        setErrorMessage(error.message || "Unable to create your account. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Unable to create your account. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm p-6 sm:p-10">
      <div className="space-y-2">
        <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-violet-400 uppercase">
          Get started
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Create your account
        </h1>
        <p className="text-sm text-zinc-400">
          Start organizing your developer workspace today.
        </p>
      </div>

      <form onSubmit={handleSignup} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="John Doe"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

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
          <label htmlFor="password" className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {errorMessage && (
          <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {errorMessage}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-violet-600 py-5 font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

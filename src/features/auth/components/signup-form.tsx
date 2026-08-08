"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message || "Unable to create your account. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }

      // Keep isSubmitting=true so the button stays in loading state during redirect
      router.push("/dashboard");
    } catch {
      setErrorMessage(
        "Unable to create your account. Please check your connection and try again.",
      );
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
          <label
            htmlFor="name"
            className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase"
          >
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
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase"
          >
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
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 pr-10 text-sm text-white transition outline-none placeholder:text-zinc-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 transition hover:text-zinc-300 focus:outline-none focus-visible:text-violet-400"
              tabIndex={0}
            >
              {showPassword ? (
                <HugeiconsIcon icon={EyeOffIcon} size={16} />
              ) : (
                <HugeiconsIcon icon={EyeIcon} size={16} />
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          >
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-violet-600 py-5 font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

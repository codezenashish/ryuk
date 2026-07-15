"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa6";

export default function LoginForm() {
  return (
    <div className="flex w-full items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center md:text-left">
          <h1 className="font-sans text-2xl text-white">Log in to account</h1>
          <p className="font-mono text-xs text-zinc-400">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full cursor-pointer gap-2 rounded-xl border-zinc-800 bg-zinc-900/10 py-5 font-sans text-xs text-zinc-300 transition-all hover:bg-zinc-800/40 hover:text-white active:scale-[0.98]"
            type="button"
          >
            <FaGoogle className="h-4 w-4 text-white" />
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full cursor-pointer gap-2 rounded-xl border-zinc-800 bg-zinc-900/10 py-5 font-sans text-xs text-zinc-300 transition-all hover:bg-zinc-800/40 hover:text-white active:scale-[0.98]"
            type="button"
          >
            <FaGithub className="h-4 w-4" />
            GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 font-mono text-[9px] tracking-widest text-zinc-500">
              OR CONTINUE WITH EMAIL
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <form className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="name@example.com"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/15 px-3 py-2.5 font-mono text-xs text-white placeholder-zinc-600 transition-colors outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-mono text-[11px] font-medium tracking-wider text-zinc-400 uppercase"
              >
                Password
              </label>
              <a
                href="#forgot"
                className="font-mono text-[10px] text-violet-400 transition-colors hover:text-violet-300 hover:underline"
              >
                Forgot?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/15 px-3 py-2.5 font-mono text-xs text-white placeholder-zinc-600 transition-colors outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              className="h-3.5 w-3.5 cursor-pointer rounded border-zinc-800 bg-zinc-900/10 text-violet-600 accent-violet-500 focus:ring-0"
            />
            <label
              htmlFor="remember"
              className="cursor-pointer font-sans text-xs text-zinc-400 select-none"
            >
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-violet-600 py-5.5 font-sans text-xs font-semibold text-white shadow-md shadow-violet-600/15 transition-all hover:bg-violet-500 hover:shadow-violet-600/25 active:scale-[0.98]"
          >
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
}

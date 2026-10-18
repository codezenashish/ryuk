"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/arc/button";

export function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-neutral-100 flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-10 select-none overflow-x-hidden">
      {/* 
        Inner Illuminated Stage Container
        - Pixel-matched to the Arc reference UI
        - Rounded card: rounded-4xl / rounded-[2.5rem]
        - Luminous ambient peach glow (bottom-left) and periwinkle glow (top-right)
        - Clean dark framing in outer space
      */}
      <div className="relative w-full max-w-350 min-h-[88vh] lg:h-[88vh] rounded-4xl sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden flex flex-col justify-between border border-white/8 shadow-[0_30px_100px_rgba(0,0,0,0.7)] bg-[#fafbfd] text-neutral-900 isolate">
        
        {/* Ambient Radial Mesh Gradients */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          {/* Bottom-left blush/peach aura */}
          <div className="absolute -bottom-28 -left-28 w-152 h-152 rounded-full bg-radial from-[#fed7d7]/85 via-[#feecd8]/45 to-transparent blur-[70px] opacity-90" />
          
          {/* Top-right serene celestial blue aura */}
          <div className="absolute -top-28 -right-28 w-160 h-160 rounded-full bg-radial from-[#dbeafe]/95 via-[#e0e7ff]/50 to-transparent blur-[75px] opacity-90" />
          
          {/* Specular light diffusion across center */}
          <div className="absolute inset-0 bg-linear-to-b from-white/40 via-transparent to-white/30 pointer-events-none" />
        </div>

        {/* Top Header inside the container (Navbar removed, clean layout) */}
        <header className="relative z-30 px-6 sm:px-10 lg:px-12 pt-7 pb-4 flex items-center justify-between gap-4">
          {/* Left Brand: Minimal Arch Icon + Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="Ryuk Homepage"
          >
            <div className="size-8 flex items-center justify-center text-neutral-900 group-hover:scale-105 transition-transform duration-200">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6 text-neutral-900"
              >
                <path d="M4 19V9a8 8 0 0 1 16 0v10" />
                <path d="M8 19V11a4 4 0 0 1 8 0v8" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-950 font-sans">
              Ryuk
            </span>
          </Link>

          {/* Right Action Controls: Arc Button, Theme Toggle, Sign In & Explore */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Arc Button (Replaces GitHub Star button) */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open("https://uiarc.dev", "_blank")}
              className="gap-1.5 font-medium shadow-none"
              aria-label="Arc UI Library"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="M4 19V9a8 8 0 0 1 16 0v10" />
                <path d="M8 19V11a4 4 0 0 1 8 0v8" />
              </svg>
              <span>Arc</span>
            </Button>

            {/* Theme Toggle Button (Clean, minimal, no border/bg/shadow) */}
            <div className="flex items-center justify-center">
              <ThemeToggle className="text-neutral-700 hover:text-neutral-950" />
            </div>

            {/* Arc UI Animated Sign In Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/login")}
              className="text-neutral-800 hover:text-neutral-950 font-medium shadow-none"
            >
              Sign in
            </Button>

            {/* Arc UI Animated Explore library Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/signup")}
              className="bg-white text-neutral-900 border border-neutral-200/90 hover:bg-neutral-50 font-medium shadow-none"
            >
              Explore library &rarr;
            </Button>
          </div>
        </header>

        {/* Center Hero Section: Visual Storyteller Option 4 Copy & Arc Animated Buttons */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-8 sm:py-16 max-w-4xl mx-auto w-full">
          {/* Main Hero Headline */}
          <h1 className="text-4xl min-[480px]:text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-semibold tracking-[-0.035em] text-neutral-950 leading-[1.08] text-balance">
            The developer knowledge OS your terminal and browser were waiting for.
          </h1>

          {/* Subtitle Description */}
          <p className="mt-6 sm:mt-7 text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed text-balance">
            Local-first notes with instant CLI access, zero-friction web page
            highlighter extension with source links, and built-in AI agent
            protocol support.
          </p>

          {/* Dual Action Pill Buttons using Arc Animated Button Component */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
            {/* Primary Dark Animated Pill Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push("/signup")}
              className="w-full sm:w-auto px-7 py-3 text-[15px] font-medium shadow-none hover:opacity-95"
            >
              Explore Ryuk OS &rarr;
            </Button>

            {/* Secondary Light Animated Pill Button */}
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto px-7 py-3 text-[15px] font-medium shadow-none border border-neutral-300/80 bg-white/85 hover:bg-white"
            >
              View Documentation &rarr;
            </Button>
          </div>
        </main>

        {/* Bottom Ambient Area */}
        <footer className="relative z-10 pb-6 sm:pb-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-neutral-400">
            <span>Ryuk OS</span>
            <span>&bull;</span>
            <span>Developer-first knowledge architecture</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;

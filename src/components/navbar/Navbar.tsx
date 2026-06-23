"use client";

import React, { useState } from "react";
import NavLinks from "./NavbarLinks";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Poppins } from "next/font/google";
import { Menu, X } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-black/80 backdrop-blur-lg ${poppins.className}`}
    >
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-semibold text-white">
            DevNest
          </Link>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:flex">
          <NavLinks />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            asChild
            variant="ghost"
            className="bg-transparent text-zinc-400 hover:bg-transparent hover:text-white"
          >
            <Link href="/sign-in">Log in</Link>
          </Button>

          <Button
            asChild
            className="rounded-full bg-white px-5 text-black hover:bg-zinc-200"
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>

        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="text-zinc-400 hover:text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-lg border-t border-zinc-800">
          <div className="flex flex-col items-center px-6 py-6 space-y-6">
            <NavLinks />
            <div className="flex flex-col w-full gap-3 pt-6 border-t border-zinc-800">
              <Button
                asChild
                variant="ghost"
                className="w-full bg-transparent text-zinc-400 hover:bg-transparent hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button
                asChild
                className="w-full rounded-full bg-white px-5 text-black hover:bg-zinc-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
"use client";

import React from "react";
import NavLinks from "./Navlinks";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function Navbar() {
  return (
    <header
      className={`sticky top-0 z-50 w-full  bg-black/80 backdrop-blur-lg ${poppins.className}`}
    >
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-semibold text-white">
            DevNest
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:flex">
          <NavLinks />
        </div>

        {/* Auth Buttons */}
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
      </div>
    </header>
  );
}
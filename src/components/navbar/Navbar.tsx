"use client";
import React, { useEffect, useState } from "react";
import NavLinks from "./Navlinks";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

interface NavbarProps {
  sticky?: boolean;
}

const Navbar = ({ sticky = true }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!sticky) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  return (
    // ✅ motion.header ko hata kar normal <header> laga diya hai
    <header
      className={cn(
        "relative z-50 w-full transition-all duration-300 bg-black/20",
        sticky && "sticky top-0",
        scrolled && "border-b border-white/10 backdrop-blur-md shadow-none",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1>devnext h2</h1>
        <div className="hidden lg:flex items-center gap-6">
          <NavLinks />
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-white/15 bg-white/0 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-white text-black hover:bg-white/90"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

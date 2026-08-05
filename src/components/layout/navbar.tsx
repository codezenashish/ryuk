"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

interface NavbarItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavbarItem[] = [
  { label: "Features", href: "#features" },
  { label: "Open source", href: "#open-source" },
  { label: "Quick docs", href: "quick-docs" },
  { label: "Quick craft", href: "quick-craft" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((open) => !open);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 py-4">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between rounded-2xl border border-white/8 bg-[#0c0c0b]/80 px-4 backdrop-blur-2xl md:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="2"
                width="10"
                height="10"
                rx="3"
                stroke="#9c9585"
                strokeWidth="1.6"
              />
              <rect
                x="16"
                y="2"
                width="10"
                height="10"
                rx="3"
                stroke="#6B8F71"
                strokeWidth="1.6"
              />
              <rect
                x="2"
                y="16"
                width="10"
                height="10"
                rx="3"
                stroke="#6B8F71"
                strokeWidth="1.6"
              />
              <rect
                x="16"
                y="16"
                width="10"
                height="10"
                rx="3"
                stroke="#9c9585"
                strokeWidth="1.6"
              />
              <circle cx="14" cy="14" r="2" fill="#9c9585" />
            </svg>

            <span className="font-sans-system text-lg tracking-tight text-white capitalize">
              devnest
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-sans-system text-sm text-stone-400 transition-colors duration-200 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="h-10 rounded-xl px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-white/8"
              >
                Sign in
              </Button>
            </Link>

            <Link href="/signup" className="hidden sm:block">
              <Button className="h-10 rounded-xl bg-white px-5 text-sm font-medium text-stone-900 hover:bg-stone-100">
                Sign up
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="h-10 w-10 rounded-xl border border-white/8 bg-white/4 text-white hover:bg-white/8 md:hidden"
            >
              {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              id="mobile-navigation"
              className="absolute inset-x-0 top-20 flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#0c0c0b]/95 px-6 py-5 backdrop-blur-2xl md:hidden"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="text-base font-medium text-stone-400 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

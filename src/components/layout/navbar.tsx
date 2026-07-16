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
        <div className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 backdrop-blur-xl md:px-6">
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
                stroke="#A78BFA"
                strokeWidth="1.6"
              />
              <rect
                x="16"
                y="2"
                width="10"
                height="10"
                rx="3"
                stroke="#67E8F9"
                strokeWidth="1.6"
              />
              <rect
                x="2"
                y="16"
                width="10"
                height="10"
                rx="3"
                stroke="#67E8F9"
                strokeWidth="1.6"
              />
              <rect
                x="16"
                y="16"
                width="10"
                height="10"
                rx="3"
                stroke="#A78BFA"
                strokeWidth="1.6"
              />
              <circle cx="14" cy="14" r="2" fill="#A78BFA" />
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
                className="h-10 rounded-xl px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
              >
                Sign in
              </Button>
            </Link>

            <Link href="/signup" className="hidden sm:block">
              <Button className="h-10 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white hover:bg-violet-500">
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
              className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 md:hidden"
            >
              {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              id="mobile-navigation"
              className="absolute inset-x-0 top-20 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/80 px-6 py-5 backdrop-blur-xl md:hidden"
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

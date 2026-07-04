"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HardHat } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100 p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full flex flex-col items-center text-center space-y-8"
      >
        {/* Logo/Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <HardHat size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">DevNest</h1>
        </div>

        {/* Heading & Description */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            Welcome to Our Platform
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed max-w-xl mx-auto">
            🚧 Our complete landing page is currently under development. You can still create an account or log in to explore the dashboard and available features. The full experience will be available soon.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full justify-center">
          <Link href="/sign-in" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-40 px-6 py-3 rounded-full font-medium transition-colors bg-white text-neutral-950 hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Login
            </motion.button>
          </Link>
          <Link href="/sign-up" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-40 px-6 py-3 rounded-full font-medium transition-colors bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600"
            >
              Sign Up
            </motion.button>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="pt-12 text-sm text-neutral-500 max-w-md">
          The landing page is being redesigned and will be available in a future update. Thank you for your patience.
        </div>
      </motion.div>
    </div>
  );
}

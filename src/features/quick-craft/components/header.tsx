"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-violet-500/10 via-sky-500/5 to-transparent px-4 pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="pointer-events-none absolute -top-40 -left-40 h-150 w-150 rounded-full bg-violet-600/10 blur-[128px]" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-150 w-150 rounded-full bg-sky-600/10 blur-[128px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md transition-all duration-200 hover:border-white/10 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to home</span>
            </Link>

            <span className="inline-flex items-center rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              Interactive CLI Builder
            </span>
          </motion.div>

          <div className="max-w-2xl space-y-6">
            <motion.h1
              variants={itemVariants}
              className="text-4xl tracking-tight text-white sm:text-5xl md:text-6xl lg:text-6xl"
            >
              Build your setup command,{" "}
              <span className="block bg-linear-to-r from-violet-400 via-sky-300 to-emerald-300 bg-clip-text font-serif text-transparent italic sm:inline">
                visually.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-lg md:text-base/relaxed"
            >
              Pick a framework, a package manager, and the libraries you need.
              Command Craft puts them together into one command &mdash; copy it,
              paste it, done. No more digging through docs to remember the right
              flags.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

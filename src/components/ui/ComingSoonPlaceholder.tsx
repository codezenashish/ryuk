"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

interface ComingSoonPlaceholderProps {
  title?: string;
  description?: string;
}

export default function ComingSoonPlaceholder({
  title = "Feature Coming Soon",
  description = "We are crafting something amazing for you. Stay tuned!",
}: ComingSoonPlaceholderProps) {
  return (
    <div className="relative flex h-[80vh] w-full flex-col items-center justify-center overflow-hidden px-4">
      {/* Blurred glowing background accent */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 opacity-50 blur-[100px] sm:h-[400px] sm:w-[400px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex max-w-md flex-col items-center text-center"
      >
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl">
          <Sparkles className="size-8 text-indigo-400" />
        </div>

        <h1 className="mb-3 bg-linear-to-br from-white to-zinc-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          {title}
        </h1>

        <p className="mb-8 text-sm text-zinc-400 sm:text-base">{description}</p>

        <Link href="/bookmarks" passHref>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
          >
            <ArrowLeft className="size-4" />
            Go Back to Bookmarks
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

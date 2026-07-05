"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Loader2 } from "lucide-react";
import { getRegisteredUserCountAction } from "@/src/features/landing/actions/stats-actions";

export default function CommunityStats() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getRegisteredUserCountAction();
        if (res.success && typeof res.count === "number") {
          setCount(res.count);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const displayCount = loading ? (
    <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
  ) : error || count === null ? (
    "--"
  ) : (
    `${count.toLocaleString()}+`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      className="mt-12 flex w-full max-w-[280px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl"
    >
      <h3 className="mb-4 text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
        Community Stats
      </h3>
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner">
          <Users className="size-6 text-zinc-300" />
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold tracking-tight text-white flex items-center justify-center h-8">
            {displayCount}
          </span>
          <span className="mt-1 text-xs text-zinc-400">
            Registered Users
          </span>
        </div>
      </div>
    </motion.div>
  );
}

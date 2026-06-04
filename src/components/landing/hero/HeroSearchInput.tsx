"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { tabs } from "./search-tab-config";
import AnimatedPlaceholder from "./AnimatedPlaceholder";

export default function HeroSearchInput() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tabs.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
  }, []);

  const activeTab = tabs[activeIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="bg-zinc-900/40 border border-white/10 rounded-[28px] p-3 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/5">
        
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 px-1">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeIndex === index;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(index)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              >
                {isActive && (
                  <motion.div
                    layoutId="heroActivePillGlow"
                    className="absolute inset-0 rounded-xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <Icon
                  className={`relative z-10 w-4 h-4 transition-colors duration-200 ${
                    isActive ? "text-indigo-400" : "text-zinc-500"
                  }`}
                />

                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    isActive ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          <span className="text-[11px] font-semibold text-zinc-500 bg-white/5 border border-white/5 px-2 py-1 rounded-md ml-1 select-none">
            +4
          </span>
        </div>

        <div className="relative flex items-center group">
          <div
            className="
              relative
              w-full
              pl-6
              pr-16
              py-6
              bg-black/60
              border
              border-white/5
              rounded-[20px]
              backdrop-blur-md
              overflow-hidden
              transition-all
              duration-300
              group-focus-within:border-indigo-500/30
              group-focus-within:ring-1
              group-focus-within:ring-indigo-500/20
            "
          >
            <AnimatedPlaceholder text={activeTab.placeholder} />
          </div>

          <button
            type="button"
            aria-label="Submit search"
            className="
              absolute
              right-3
              p-2.5
              bg-zinc-100
              text-zinc-950
              rounded-full
              shadow-lg
              transition-all
              duration-200
              hover:bg-white
              hover:scale-105
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-400
            "
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { motion, type Variants } from "framer-motion";
import {
  FiCheck,
  FiClock,
  FiFileText,
  FiMoreHorizontal,
  FiSearch,
  FiStar,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

const bookmarks = [
  {
    title: "React Documentation",
    url: "react.dev",
    tag: "React",
    color: "bg-stone-400/12 text-stone-300",
    initial: "R",
  },
  {
    title: "Designing Interfaces",
    url: "designinginterfaces.com",
    tag: "Design",
    color: "bg-stone-400/12 text-stone-300",
    initial: "D",
  },
  {
    title: "Vercel AI SDK",
    url: "sdk.vercel.ai",
    tag: "AI",
    color: "bg-emerald-400/12 text-emerald-300",
    initial: "V",
  },
];

const windowDots = (
  <div className="flex shrink-0 gap-1.5" aria-hidden="true">
    <span className="h-2.5 w-2.5 rounded-full bg-stone-800" />
    <span className="h-2.5 w-2.5 rounded-full bg-stone-800" />
    <span className="h-2.5 w-2.5 rounded-full bg-stone-800" />
  </div>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function HeroMockup() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="relative overflow-hidden will-change-transform"
    >
      <div className="relative space-y-3 sm:space-y-4">
        {/* ── Top Card: Bookmarks browser ── */}
        <motion.section
          variants={cardVariants}
          className="group overflow-hidden rounded-2xl border border-white/7 bg-[#111110] transition-all duration-500 hover:border-white/12 hover:shadow-xl hover:shadow-black/20"
        >
          <header className="flex h-11 items-center gap-4 border-b border-white/6 px-4 sm:h-13 sm:px-5">
            {windowDots}
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/6 bg-white/3 px-2.5 py-1.5 text-stone-500">
              <FiSearch className="shrink-0" size={12} />
              <span className="truncate text-[10px] sm:text-[11px]">
                Search your bookmarks
              </span>
              <kbd className="ml-auto hidden rounded-md border border-white/6 px-1.5 py-0.5 font-mono text-[8px] text-stone-600 sm:block">
                ⌘ K
              </kbd>
            </div>
            <FiMoreHorizontal className="shrink-0 text-stone-600" size={15} />
          </header>

          <div className="space-y-3 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <FiStar
                  className="shrink-0 fill-stone-400 text-stone-400"
                  size={13}
                />
                <p className="truncate text-[11px] font-medium text-stone-300 sm:text-xs">
                  Product inspiration
                </p>
                <span className="rounded-full border border-stone-500/20 bg-stone-500/8 px-1.5 py-0.5 font-mono text-[8px] text-stone-400">
                  Frontend
                </span>
              </div>
              <div className="flex shrink-0 gap-1">
                {["All", "Recent", "Favorites"].map((filter, index) => (
                  <span
                    key={filter}
                    className={`rounded-md px-1.5 py-1 text-[8px] sm:px-2 sm:text-[9px] ${
                      index === 0 ? "bg-white/8 text-stone-300" : "text-stone-600"
                    }`}
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {bookmarks.map((bookmark, i) => (
                <motion.article
                  key={bookmark.title}
                  variants={cardVariants}
                  className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/5 bg-white/2 p-2.5 transition-all duration-300 hover:border-white/10 hover:bg-white/4"
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-semibold ${bookmark.color}`}
                  >
                    {bookmark.initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[10px] font-medium text-stone-300 sm:text-[11px]">
                        {bookmark.title}
                      </p>
                      <FiStar className="shrink-0 text-stone-700" size={10} />
                    </div>
                    <p className="truncate pt-0.5 text-[9px] text-stone-600">
                      {bookmark.url}
                    </p>
                  </div>
                  <span className="hidden rounded-md border border-white/5 px-1 py-0.5 text-[8px] text-stone-500 xl:block">
                    {bookmark.tag}
                  </span>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Bottom Row: Light Card + Dark Card (Dual-tone inspired by Image 1) ── */}
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] sm:gap-4">
          {/* Light-toned card (code editor) */}
          <motion.section
            variants={cardVariants}
            className="group min-w-0 overflow-hidden rounded-2xl border border-white/7 bg-[#111110] transition-all duration-500 hover:border-white/12 hover:shadow-xl hover:shadow-black/20"
          >
            <header className="flex h-10 items-center border-b border-white/6 px-4">
              {windowDots}
              <div className="ml-4 flex min-w-0 items-end gap-1.5 self-stretch font-mono text-[9px]">
                <span className="flex h-full items-center border-b border-stone-400 px-2 text-stone-300">
                  bookmark.ts
                </span>
                <span className="hidden h-full items-center px-2 text-stone-600 sm:flex">
                  auth.ts
                </span>
                <span className="hidden h-full items-center px-2 text-stone-600 sm:flex">
                  api.ts
                </span>
              </div>
            </header>
            <div className="overflow-x-auto p-4 font-mono text-[9px] leading-[1.85] sm:p-5 sm:text-[10px]">
              <div className="grid min-w-65 grid-cols-[1.5rem_1fr] gap-x-3">
                <div className="text-right text-stone-700 select-none">
                  {[1, 2, 3, 4, 5, 6, 7].map((line) => (
                    <span className="block" key={line}>
                      {line}
                    </span>
                  ))}
                </div>
                <code className="whitespace-pre font-mono text-stone-400">
                  <span className="block">
                    <span className="text-stone-300">export const</span>{" "}
                    bookmark = <span className="text-emerald-400/80">&#123;</span>
                  </span>
                  <span className="block">
                    {" "}
                    title:{" "}
                    <span className="text-amber-300/70">
                      &quot;React patterns&quot;
                    </span>
                    ,
                  </span>
                  <span className="block">
                    {" "}
                    url:{" "}
                    <span className="text-amber-300/70">
                      &quot;react.dev/learn&quot;
                    </span>
                    ,
                  </span>
                  <span className="block">
                    {" "}
                    tags: [
                    <span className="text-amber-300/70">
                      &quot;frontend&quot;
                    </span>
                    ,{" "}
                    <span className="text-amber-300/70">&quot;react&quot;</span>
                    ],
                  </span>
                  <span className="block">
                    {" "}
                    favorite: <span className="text-stone-300">true</span>,
                  </span>
                  <span className="block">
                    <span className="text-emerald-400/80">&#125;</span>{" "}
                    <span className="text-stone-600">as const</span>;
                  </span>
                  <span className="block"> </span>
                </code>
              </div>
            </div>
            <footer className="flex items-center justify-between border-t border-white/6 px-4 py-2 font-mono text-[8px] text-stone-600">
              <span>TypeScript</span>
              <span>UTF-8 · LF</span>
            </footer>
          </motion.section>

          {/* Dark-toned card (like Image 1 right card) */}
          <motion.section
            variants={cardVariants}
            className="group relative min-w-0 overflow-hidden rounded-2xl border border-emerald-900/30 bg-[#0d1210] p-3 transition-all duration-500 hover:border-emerald-800/40 hover:shadow-xl hover:shadow-emerald-950/20 sm:p-4"
          >
            {/* Subtle green ambient */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(107,143,113,0.06),transparent_70%)]" />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-emerald-500/15 bg-emerald-500/8 text-emerald-400">
                    <FiShield size={12} />
                  </span>
                  <p className="truncate text-[10px] font-medium text-stone-200">
                    Secure workspace
                  </p>
                </div>
                <FiMoreHorizontal className="shrink-0 text-stone-600" size={14} />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-emerald-400/8 px-2 py-0.5 text-[8px] text-emerald-400/80">
                  Encrypted
                </span>
                <span className="rounded-full bg-stone-400/8 px-2 py-0.5 text-[8px] text-stone-400">
                  Self-hosted
                </span>
              </div>

              <div className="mt-3 space-y-2 text-[9px] text-stone-400 sm:text-[10px]">
                <p className="font-medium text-stone-200">
                  No deploys with uncached fetches.
                </p>
                <p className="text-stone-500 leading-relaxed">
                  CI must load-test any component that pulls user data on render.
                </p>
                {[
                  "Polish empty states",
                  "Review mobile flows",
                  "Write the launch note",
                ].map((item, index) => (
                  <div className="flex items-center gap-2" key={item}>
                    <span
                      className={`flex size-3 shrink-0 items-center justify-center rounded border ${index < 2 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-white/8"}`}
                    >
                      {index < 2 && <FiCheck size={9} />}
                    </span>
                    <span
                      className={index < 2 ? "text-stone-500 line-through" : ""}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[9px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Deployed
                </span>
                <span className="flex items-center gap-1 text-[9px] text-stone-500 transition-colors hover:text-stone-300 cursor-pointer">
                  Restart investigation <FiArrowRight size={10} />
                </span>
              </div>

              <div className="mt-3 flex items-center gap-1.5 border-t border-white/5 pt-2.5 text-[8px] text-stone-600">
                <FiClock size={10} />
                v2.8.6 securely encrypted
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}

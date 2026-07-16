"use client";

import { motion } from "framer-motion";
import {
  FiCheck,
  FiClock,
  FiFileText,
  FiMoreHorizontal,
  FiSearch,
  FiStar,
} from "react-icons/fi";

const bookmarks = [
  {
    title: "React Documentation",
    url: "react.dev",
    tag: "React",
    color: "bg-cyan-300/15 text-cyan-200",
    initial: "R",
  },
  {
    title: "Designing Interfaces",
    url: "designinginterfaces.com",
    tag: "Design",
    color: "bg-violet-400/15 text-violet-200",
    initial: "D",
  },
  {
    title: "Vercel AI SDK",
    url: "sdk.vercel.ai",
    tag: "AI",
    color: "bg-emerald-300/15 text-emerald-200",
    initial: "V",
  },
];

const windowDots = (
  <div className="flex shrink-0 gap-1.5" aria-hidden="true">
    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
  </div>
);

export default function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative space-y-3 sm:space-y-4">
        <section className="group overflow-hidden rounded-2xl border border-white/9 bg-[#0b0b0d] transition-colors hover:border-white/[0.14]">
          <header className="flex h-11 items-center gap-4 border-b border-white/[0.07] px-4 sm:h-13 sm:px-5">
            {windowDots}
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-white/7 bg-white/2.5 px-2.5 py-1.5 text-stone-500">
              <FiSearch className="shrink-0" size={12} />
              <span className="truncate text-[10px] sm:text-[11px]">
                Search your bookmarks
              </span>
              <kbd className="ml-auto hidden rounded border border-white/[0.07] px-1.5 py-0.5 font-mono text-[8px] text-zinc-600 sm:block">
                ⌘ K
              </kbd>
            </div>
            <FiMoreHorizontal className="shrink-0 text-zinc-600" size={15} />
          </header>

          <div className="space-y-3 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <FiStar
                  className="shrink-0 fill-violet-300 text-violet-300"
                  size={13}
                />
                <p className="truncate text-[11px] font-medium text-stone-200 sm:text-xs">
                  Product inspiration
                </p>
                <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-1.5 py-0.5 font-mono text-[8px] text-violet-200">
                  Frontend
                </span>
              </div>
              <div className="flex shrink-0 gap-1">
                {["All", "Recent", "Favorites"].map((filter, index) => (
                  <span
                    key={filter}
                    className={`rounded-md px-1.5 py-1 text-[8px] sm:px-2 sm:text-[9px] ${
                      index === 0 ? "bg-white/9 text-zinc-200" : "text-zinc-600"
                    }`}
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <article
                  key={bookmark.title}
                  className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/2.5 p-2.5 transition-colors group-hover:border-white/10"
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-semibold ${bookmark.color}`}
                  >
                    {bookmark.initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[10px] font-medium text-zinc-200 sm:text-[11px]">
                        {bookmark.title}
                      </p>
                      <FiStar className="shrink-0 text-zinc-600" size={10} />
                    </div>
                    <p className="truncate pt-0.5 text-[9px] text-zinc-600">
                      {bookmark.url}
                    </p>
                  </div>
                  <span className="hidden rounded border border-white/[0.07] px-1 py-0.5 text-[8px] text-zinc-500 xl:block">
                    {bookmark.tag}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] sm:gap-4">
          <section className="group min-w-0 overflow-hidden rounded-2xl border border-white/9 bg-[#0b0b0d] transition-colors hover:border-white/[0.14]">
            <header className="flex h-10 items-center border-b border-white/[0.07] px-4">
              {windowDots}
              <div className="ml-4 flex min-w-0 items-end gap-1.5 self-stretch font-mono text-[9px]">
                <span className="flex h-full items-center border-b border-violet-300 px-2 text-violet-200">
                  bookmark.ts
                </span>
                <span className="hidden h-full items-center px-2 text-zinc-600 sm:flex">
                  auth.ts
                </span>
                <span className="hidden h-full items-center px-2 text-zinc-600 sm:flex">
                  api.ts
                </span>
              </div>
            </header>
            <div className="overflow-x-auto p-4 font-mono text-[9px] leading-[1.85] sm:p-5 sm:text-[10px]">
              <div className="grid min-w-65 grid-cols-[1.5rem_1fr] gap-x-3">
                <div className="text-right text-zinc-700 select-none">
                  {[1, 2, 3, 4, 5, 6, 7].map((line) => (
                    <span className="block" key={line}>
                      {line}
                    </span>
                  ))}
                </div>
                <code className="whitespace-pre font-mono text-zinc-400">
                  <span className="block">
                    <span className="text-violet-300">export const</span>{" "}
                    bookmark = <span className="text-cyan-200">&#123;</span>
                  </span>
                  <span className="block">
                    {" "}
                    title:{" "}
                    <span className="text-emerald-200">
                      &quot;React patterns&quot;
                    </span>
                    ,
                  </span>
                  <span className="block">
                    {" "}
                    url:{" "}
                    <span className="text-emerald-200">
                      &quot;react.dev/learn&quot;
                    </span>
                    ,
                  </span>
                  <span className="block">
                    {" "}
                    tags: [
                    <span className="text-emerald-200">
                      &quot;frontend&quot;
                    </span>
                    ,{" "}
                    <span className="text-emerald-200">&quot;react&quot;</span>
                    ],
                  </span>
                  <span className="block">
                    {" "}
                    favorite: <span className="text-violet-300">true</span>,
                  </span>
                  <span className="block">
                    <span className="text-cyan-200">&#125;</span>{" "}
                    <span className="text-zinc-600">as const</span>;
                  </span>
                  <span className="block"> </span>
                </code>
              </div>
            </div>
            <footer className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2 font-mono text-[8px] text-zinc-600">
              <span>TypeScript</span>
              <span>UTF-8 · LF</span>
            </footer>
          </section>

          <section className="group min-w-0 overflow-hidden rounded-2xl border border-white/9 bg-[#0b0b0d] p-3 transition-colors hover:border-white/[0.14] sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-violet-400/20 bg-violet-400/10 text-violet-200">
                  <FiFileText size={12} />
                </span>
                <p className="truncate text-[10px] font-medium text-stone-200">
                  Launch checklist
                </p>
              </div>
              <FiMoreHorizontal className="shrink-0 text-zinc-600" size={14} />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-violet-400/10 px-2 py-0.5 text-[8px] text-violet-200">
                Product
              </span>
              <span className="rounded-full bg-cyan-300/10 px-2 py-0.5 text-[8px] text-cyan-200">
                This week
              </span>
            </div>

            <div className="mt-3 space-y-2 text-[9px] text-zinc-400 sm:text-[10px]">
              <p className="font-medium text-zinc-200">
                A calm, useful first release.
              </p>
              {[
                "Polish empty states",
                "Review mobile flows",
                "Write the launch note",
              ].map((item, index) => (
                <div className="flex items-center gap-2" key={item}>
                  <span
                    className={`flex size-3 shrink-0 items-center justify-center rounded border ${index < 2 ? "border-violet-400/40 bg-violet-400/15 text-violet-200" : "border-white/12"}`}
                  >
                    {index < 2 && <FiCheck size={9} />}
                  </span>
                  <span
                    className={index < 2 ? "text-zinc-500 line-through" : ""}
                  >
                    {item}
                  </span>
                </div>
              ))}
              <p className="border-l border-violet-400/35 pl-2 text-zinc-500">
                Keep the details quiet and intentional.
              </p>
            </div>

            <div className="mt-3 flex items-center gap-1.5 border-t border-white/[0.07] pt-2.5 text-[8px] text-zinc-600">
              <FiClock size={10} />
              Last edited 12m ago
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

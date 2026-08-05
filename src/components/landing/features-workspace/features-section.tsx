"use client";

import { motion, type Variants } from "framer-motion";
import {
  LuBookmark,
  LuFileText,
  LuCode,
  LuCircleCheck,
  LuLock,
  LuArrowRight,
} from "react-icons/lu";
import {
  BookmarkPreview,
  NotePreview,
  SnippetPreview,
  HabitPreview,
} from "./features-frid";

const features = [
  {
    id: "bookmarks",
    title: "Bookmarks",
    description:
      "Save and organize links with custom tags. Filter by project, topic, or timeline — your personal reference catalog, always accessible.",
    icon: <LuBookmark size={16} />,
    wide: true,
    preview: <BookmarkPreview />,
  },
  {
    id: "notes",
    title: "Notes",
    description:
      "Free-form writing with premium client-side AES-256 encryption layer. Your architecture blueprints remain fully private.",
    icon: <LuFileText size={16} />,
    wide: false,
    preview: <NotePreview />,
  },
  {
    id: "snippets",
    title: "Code Snippets",
    description:
      "Store reusable production code blocks with semantic syntax highlighting and global multi-indexed layout search.",
    icon: <LuCode size={16} />,
    wide: false,
    preview: <SnippetPreview />,
  },
  {
    id: "habits",
    title: "Habit Tracker",
    description:
      "Daily developer momentum tracking, lightweight and visual. Maintain deep work consistency on core engineering components.",
    icon: <LuCircleCheck size={16} />,
    wide: true,
    preview: <HabitPreview />,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function FeaturesSection() {
  return (
    <section
      className="relative w-full overflow-hidden px-4 py-24 sm:py-28"
      id="features"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-stone-800/40 to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex max-w-2xl flex-col items-center gap-y-3 text-center"
        >
          <div className="mb-3 max-w-fit rounded-full border border-stone-500/20 bg-stone-500/8 px-4 py-1 backdrop-blur-sm">
            <span className="text-sm tracking-wide text-stone-300">
              Core features
            </span>
          </div>
          <h2 className="text-4xl text-white font-inter sm:text-5xl md:text-6xl">
            Your full{" "}
            <span className="bg-linear-to-r from-white via-stone-300 to-stone-500 bg-clip-text font-serif text-transparent">
              developer workspace
            </span>
          </h2>
          <p className="text-sm text-stone-400 md:text-base">
            Sign in once to unlock your personal nest — all tools synced,
            searchable, and private.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid w-full grid-cols-1 gap-5 md:auto-rows-fr md:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.id}
              variants={cardVariants}
              className={`group/card relative flex min-w-0 flex-col gap-6 overflow-hidden rounded-2xl border border-white/6 bg-[#111110]/80 p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/12 hover:shadow-xl hover:shadow-black/20 ${
                f.wide ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-stone-700/30 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />

              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-800 bg-stone-900/40 text-stone-400 transition-colors duration-300 group-hover/card:text-stone-200">
                  {f.icon}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-stone-600">
                  <LuLock size={9} />
                  <span>auth active</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-stone-200 transition-colors duration-300 group-hover/card:text-white">
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed font-normal text-stone-500">
                  {f.description}
                </p>
              </div>

              <div className="mt-auto w-full pt-2">{f.preview}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="group mt-8 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/6 bg-[#111110]/60 p-5 transition-all duration-500 hover:border-white/12 hover:shadow-lg hover:shadow-black/10"
        >
          <div className="flex flex-col gap-0.5">
            <h4 className="text-xs font-semibold text-stone-300 transition-colors group-hover:text-white">
              Explore Core Local Tools Without Registering
            </h4>
            <p className="text-[11px] text-stone-500">
              Access scratchpads, generators, and offline document parsers
              directly.
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-800 bg-stone-900 text-stone-400 transition-all duration-300 group-hover:bg-white group-hover:text-stone-900">
            <LuArrowRight size={14} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

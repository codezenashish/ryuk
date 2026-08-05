"use client";

import { motion, type Variants } from "framer-motion";

const stats = [
  { label: "BOOKMARKS", value: "24", accent: "from-stone-400/10 to-stone-400/5" },
  { label: "HABITS", value: "82%", accent: "from-emerald-400/10 to-emerald-400/5" },
  { label: "COMPLETED TODAY", value: "5/8", accent: "from-amber-400/10 to-amber-400/5" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-sans">
          Dashboard
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Welcome back to DevNest. Here is your overview.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            className={`relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 space-y-2 transition-all duration-300 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-200/50 dark:border-white/6 dark:bg-[#111110] dark:hover:border-white/12 dark:hover:shadow-xl dark:hover:shadow-black/20`}
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.accent} dark:opacity-50`} />
            <h3 className="relative text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 font-mono">
              {stat.label}
            </h3>
            <p className="relative text-3xl font-bold text-stone-900 dark:text-stone-100">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

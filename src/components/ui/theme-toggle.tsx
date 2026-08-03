"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "@/app/theme-provider";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-xs" />
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200 shadow-xs transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-200/60 hover:text-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/70 dark:hover:text-white"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, scale: 0.5, rotate: isDark ? -90 : 90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: isDark ? 90 : -90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <HugeiconsIcon
              icon={Moon02Icon}
              className="h-4.5 w-4.5 text-sky-200 drop-shadow-[0_0_8px_rgba(186,230,253,0.25)]"
            />
          ) : (
            <HugeiconsIcon
              icon={Sun03Icon}
              className="h-4.5 w-4.5 text-amber-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.28)]"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

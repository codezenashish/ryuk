"use client";
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
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
      <div className="h-10 w-10 rounded-xl border border-stone-200 bg-stone-100 dark:border-white/8 dark:bg-white/4 shadow-xs" />
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";

    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = (document as unknown as {
        startViewTransition: (cb: () => void) => { ready: Promise<void> };
      }).startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: isDark ? clipPath.reverse() : clipPath,
          },
          {
            duration: 450,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: isDark
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)",
          },
        );
      });
    } else {
      setTheme(nextTheme);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-100 text-stone-700 dark:border-white/8 dark:bg-white/4 dark:text-stone-200 shadow-xs transition-all duration-200 hover:border-stone-300 hover:bg-stone-200/60 hover:text-stone-900 dark:hover:border-white/14 dark:hover:bg-white/8 dark:hover:text-white"
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
              className="h-4.5 w-4.5 text-stone-300 drop-shadow-[0_0_8px_rgba(214,211,209,0.2)]"
            />
          ) : (
            <HugeiconsIcon
              icon={Sun03Icon}
              className="h-4.5 w-4.5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

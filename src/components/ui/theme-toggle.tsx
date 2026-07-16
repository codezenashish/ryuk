"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border-foreground/20 bg-foreground/5 h-10 w-10 rounded-sm border" />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

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
      className="group border-foreground/20 bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground relative flex h-10 w-10 items-center justify-center rounded-sm border transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, scale: 0.5, rotate: isDark ? -90 : 90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: isDark ? 90 : -90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute"
        >
          {isDark ? (
            <HugeiconsIcon icon={Moon02Icon} size={18} />
          ) : (
            <HugeiconsIcon icon={Sun03Icon} size={18} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

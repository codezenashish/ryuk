"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MorphIcon } from "morphicons/react";
import { Sun, Moon } from "lucide"; // data, not components

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className="size-8.5 shrink-0"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-expanded={isDark}
      className={`size-8.5 p-0 border-0 bg-transparent shadow-none text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer flex items-center justify-center select-none outline-none focus-visible:ring-1 focus-visible:ring-ring ${className}`}
    >
      <MorphIcon
        icon={isDark ? Sun : Moon}
        size={18}
        strokeWidth={1.8}
      />
    </button>
  );
}

export default ThemeToggle;

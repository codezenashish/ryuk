"use client";

import { useDashboardStore } from "@/store/useDashboard";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { navItems } from "./sidebarConfig";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const isCollapsed = useDashboardStore((state) => state.isCollapsed);
  const setIsCollapsed = useDashboardStore((state) => state.setIsCollapsed);
  const activeTab = useDashboardStore((state) => state.setActiveTab);
  const pathname = usePathname();
  const wasMobile = useRef<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 768;

      if (isMobileNow) {
        setIsCollapsed(true);
      } else {
        // Only automatically expand if mounting on desktop or transitioning from mobile to desktop
        if (wasMobile.current === null || wasMobile.current === true) {
          setIsCollapsed(false);
        }
      }
      wasMobile.current = isMobileNow;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  const width = isCollapsed ? 64 : 256;

  return (
    <motion.aside
      animate={{ width }}
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      className="flex h-screen shrink-0 flex-col overflow-hidden border-r border-zinc-900 bg-black text-zinc-400"
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-zinc-900 px-4",
          isCollapsed ? "justify-center" : "justify-end",
        )}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          {isCollapsed ? (
            <RiMenuUnfoldLine size={16} />
          ) : (
            <RiMenuFoldLine size={16} />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-x-hidden overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.active && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 font-mono text-xs font-medium transition-all duration-150",
                isActive
                  ? "border-l border-violet-400/50 bg-violet-400/10 text-violet-200"
                  : "hover:bg-zinc-900/40 hover:text-zinc-100",
                isCollapsed && "justify-center border-l-0 px-0",
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  isActive ? "text-violet-300" : "text-zinc-500",
                )}
              />
              <AnimatePresence mode="wait" initial={false}>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-900 p-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-900/30",
            isCollapsed && "justify-center px-0",
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10 text-xs font-bold text-violet-400">
            A
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex min-w-0 flex-col overflow-hidden"
              >
                <span className="truncate text-xs font-semibold whitespace-nowrap text-zinc-200">
                  Ashish
                </span>
                <span className="truncate text-[9px] whitespace-nowrap text-zinc-500">
                  ashish@devnest.com
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}

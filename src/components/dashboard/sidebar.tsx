"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { navItems } from "./sidebarConfig";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const width = isCollapsed ? 64 : 256;

  return (
    <motion.aside
      animate={{ width }}
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      className="flex h-screen flex-col border-r border-zinc-900 bg-black text-zinc-400 overflow-hidden shrink-0"
    >
      <div className={cn("flex h-16 items-center border-b border-zinc-900 px-4", isCollapsed ? "justify-center" : "justify-end")}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200 cursor-pointer"
        >
          {isCollapsed ? <RiMenuUnfoldLine size={16} /> : <RiMenuFoldLine size={16} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.active && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium font-mono transition-all duration-150",
                isActive
                  ? "bg-violet-400/10 text-violet-200 border-l border-violet-400/50"
                  : "hover:bg-zinc-900/40 hover:text-zinc-100",
                isCollapsed && "justify-center px-0 border-l-0"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-violet-300" : "text-zinc-500")} />
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
        <div className={cn("flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-900/30", isCollapsed && "justify-center px-0")}>
          <div className="h-7 w-7 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400 shrink-0">
            A
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col min-w-0 overflow-hidden"
              >
                <span className="text-xs font-semibold text-zinc-200 truncate whitespace-nowrap">Ashish</span>
                <span className="text-[9px] text-zinc-500 truncate whitespace-nowrap">ashish@devnest.com</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}

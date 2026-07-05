"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/classname-merge";
import { NavItem as NavItemType } from "./sidebar-nav-types";
import { useContext } from "react";
import { SidebarContext } from "./Sidebar";

interface Props {
  item: NavItemType;
}

export function NavItem({ item }: Props) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <Link
      href={item.href}
      className="relative block outline-none"
      title={isCollapsed ? item.label : undefined}
      aria-label={item.label}
    >
      <motion.div
        whileHover={{ x: isCollapsed ? 0 : 3 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative flex items-center rounded-xl font-medium transition-colors duration-200",
          isCollapsed
            ? "mx-auto h-11 w-11 justify-center p-2.5"
            : "gap-3 px-3 py-2.5 text-sm",
          isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200",
        )}
      >
       
        {isActive && (
          <motion.div
            layoutId="active-sidebar-bg"
            className="absolute inset-0 rounded-xl border border-white/5 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              mass: 0.8,
            }}
          />
        )}

        {/* Subtle hover background for inactive items */}
        {!isActive && (
          <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        )}

        {/* Left Accent border for active item (Linear style) */}
        {isActive && (
          <motion.div
            layoutId="active-sidebar-indicator"
            className="absolute top-1/2 -left-1 h-1/2 w-0.5 -translate-y-1/2 rounded-r-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}

        <span
          className={cn(
            "relative z-10 shrink-0 transition-all duration-200",
            isActive
              ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              : "text-zinc-500 group-hover:text-zinc-300",
            isCollapsed && !isActive ? "group-hover:scale-110" : "",
          )}
        >
          {item.icon}
        </span>

        <AnimatePresence mode="popLayout">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, filter: "blur(4px)", x: -10 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)", x: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex-1 origin-left truncate"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {!isCollapsed && item.badge && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                "relative z-10 rounded border px-1.5 py-0.5  text-[10px] tabular-nums shadow-sm transition-colors duration-200",
                isActive
                  ? "border-white/10 bg-black/40 text-white"
                  : "border-white/5 bg-black/20 text-zinc-500 group-hover:border-white/10 group-hover:text-zinc-300",
              )}
            >
              {item.badge}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

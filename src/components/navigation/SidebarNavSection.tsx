"use client";

import { useContext } from "react";
import { SidebarContext } from "./Sidebar";
import { NavSection as NavSectionType } from "./sidebar-nav-types";
import { NavItem } from "./SidebarNavItem";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  section: NavSectionType;
}

export function NavSection({ section }: Props) {
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="wait">
        {!isCollapsed ? (
          <motion.h3 
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500 select-none"
          >
            {section.title}
          </motion.h3>
        ) : (
          <motion.div 
            key="divider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mx-auto my-1.5 w-6 border-t border-white/10" 
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-0.5">
        {section.items.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

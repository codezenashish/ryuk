"use client";

import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useOverflowMenu } from "../hooks/use-dropdown-dismiss";
import {
  dropdownVariants,
  menuItemVariants,
} from "../constants/animation-variants.ts";

export interface OverflowMenuItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

interface OverflowMenuProps {
  items: OverflowMenuItem[];
}

export function OverflowMenu({ items }: OverflowMenuProps) {
  const { isMenuOpen, menuRef, triggerRef, closeMenu, toggleMenu } =
    useOverflowMenu();

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        ref={triggerRef}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
        className="flex cursor-pointer items-center justify-center size-9 rounded-[0.625rem] border border-white/[0.08] bg-white/[0.03] text-zinc-400 outline-none transition-[background,border-color,color] duration-[180ms] ease-linear hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500/70"
      >
        <MoreHorizontal className="h-4 w-4" />
      </motion.button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            role="menu"
            aria-label="Bookmark actions"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-[calc(100%+0.5rem)] right-0 z-50 min-w-[10rem] overflow-hidden rounded-xl border border-white/[0.09] bg-zinc-950/90 p-1.5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),0_16px_32px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
          >
            {items.map(({ label, icon, onClick }, i) => (
              <motion.button
                key={label}
                role="menuitem"
                custom={i}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => {
                  onClick();
                  closeMenu();
                }}
                className="flex w-full cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-lg border-none bg-transparent px-2.5 py-2 text-left text-[0.8rem] font-medium text-zinc-400 outline-none transition-[background,color] duration-150 hover:bg-white/[0.06] hover:text-zinc-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500/70"
              >
                <span className="flex items-center justify-center opacity-75">
                  {icon}
                </span>
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

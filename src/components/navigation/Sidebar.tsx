"use client";

import { useState, createContext, useEffect } from "react";
import { bottomItems, sections } from "./sidebar-nav-config";
import { NavItem } from "./SidebarNavItem";
import { NavSection } from "./SidebarNavSection";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import { cn } from "@/src/lib/classname-merge";
import { useClerk } from "@clerk/nextjs";

export const SidebarContext = createContext<{ isCollapsed: boolean }>({
  isCollapsed: false,
});

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { signOut } = useClerk();

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    signOut();
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed }}>
      <>
        {isMobile && !isCollapsed && mounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCollapsed(true)}
            aria-hidden="true"
          />
        )}

        <motion.aside
          layout
          initial={false}
          animate={{
            width: isCollapsed ? 76 : 260,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
          className={cn(
            "relative z-50 flex h-full shrink-0 flex-col border-r border-white/5 bg-[#09090b]/95 backdrop-blur-2xl",
            isMobile && !isCollapsed
              ? "absolute top-0 left-0 shadow-2xl shadow-black/50"
              : "",
          )}
        >
          {!isMobile && mounted && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute top-6 -right-3.5 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-zinc-950 text-zinc-400 shadow-xl transition-colors hover:border-white/20 hover:bg-zinc-900 hover:text-white focus:ring-2 focus:ring-white/20 focus:outline-none"
              aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <FiChevronRight size={14} />
              ) : (
                <FiChevronLeft size={14} />
              )}
            </motion.button>
          )}

          <div className="flex flex-1 scrollbar-none flex-col overflow-y-auto px-4 py-6">
            <nav className="flex flex-col gap-8">
              {sections.map((section) => (
                <NavSection key={section.title} section={section} />
              ))}
            </nav>

            <div className="mt-auto pt-6">
              <div className="mb-4 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex flex-col gap-0.5">
                {bottomItems.map((item) => (
                  <NavItem key={item.label} item={item} />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className={cn(
                  "group relative mt-6 flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 font-semibold tracking-wide text-zinc-300 transition-all hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:outline-none",
                  isCollapsed ? "mx-auto h-11 w-11" : "h-10 w-full text-xs",
                )}
                aria-label="Logout"
              >
                <div className="absolute inset-0 bg-linear-to-r from-red-500/20 via-red-500/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                <span className="relative z-10 flex h-full w-full items-center justify-center gap-2">
                  {isCollapsed ? (
                    <FiLogOut
                      size={18}
                      className="text-red-400 transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <>
                      Logout
                      <FiLogOut
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.aside>
      </>
    </SidebarContext.Provider>
  );
}

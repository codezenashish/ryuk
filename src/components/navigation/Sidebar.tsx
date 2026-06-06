"use client";

import { useState, createContext, useEffect } from "react";
import { bottomItems, sections } from "./sidebar-nav-config";
import { NavItem } from "./SidebarNavItem";
import { NavSection } from "./SidebarNavSection";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/src/lib/classname-merge";

export const SidebarContext = createContext<{ isCollapsed: boolean }>({ isCollapsed: false });

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  return (
    <SidebarContext.Provider value={{ isCollapsed }}>
      <>
        {/* Mobile Backdrop Overlay */}
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
            isMobile && !isCollapsed ? "absolute left-0 top-0 shadow-2xl shadow-black/50" : ""
          )}
        >
          {/* Collapse/Expand Toggle for Desktop */}
          {!isMobile && mounted && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3.5 top-6 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-zinc-950 text-zinc-400 shadow-xl transition-colors hover:border-white/20 hover:bg-zinc-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </motion.button>
          )}

          <div className="flex flex-1 scrollbar-none flex-col overflow-y-auto px-4 py-6">
            <nav className="flex flex-col gap-8">
              {sections.map((section) => (
                <NavSection key={section.title} section={section} />
              ))}
            </nav>

            <div className="mt-auto pt-6">
              <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex flex-col gap-0.5">
                {bottomItems.map((item) => (
                  <NavItem key={item.label} item={item} />
                ))}
              </div>

              {/* Upgrade Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative mt-6 flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 font-semibold tracking-wide text-zinc-300 transition-all hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
                  isCollapsed ? "mx-auto h-11 w-11" : "h-10 w-full text-xs"
                )}
                aria-label="Upgrade to Pro"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                
                <span className="relative z-10 flex h-full w-full items-center justify-center gap-2">
                  {isCollapsed ? (
                    <Zap size={18} className="text-indigo-400 transition-transform group-hover:scale-110" />
                  ) : (
                    <>
                      Upgrade to Pro
                      <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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

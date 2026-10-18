"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    id: "about",
    label: "About",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: "activity",
    label: "Activity",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export function MobileDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const dockRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll spy to highlight active section in viewport
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0.1,
    });

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Escape key listener to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Outside click listener
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen]);

  const handleNavigate = (id: string) => {
    setIsOpen(false);
    setActiveSection(id);
    window.history.pushState(null, "", `#${id}`);
    const target = document.getElementById(id);
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({
        top: Math.max(0, y),
        behavior: shouldReduceMotion ? "instant" : "smooth",
      });
    }
  };

  const activeItem: NavItem =
    navItems.find((item) => item.id === activeSection) ?? navItems[0]!;

  return (
    <>
      {/* Dimmed backdrop when expanded */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
            id="mobile-dock-backdrop"
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock Container */}
      <div
        ref={dockRef}
        role="navigation"
        aria-label="Mobile Navigation Dock"
        style={{
          bottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
        }}
        className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm md:hidden pointer-events-auto"
      >
        <motion.div
          layout={!shouldReduceMotion}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", damping: 26, stiffness: 320, mass: 0.8 }
          }
          className="w-full rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden flex flex-col p-1.5"
        >
          {/* Expanded Menu Options */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.1 }
                    : { type: "spring", damping: 28, stiffness: 350 }
                }
                className="flex flex-col gap-1 pb-2 px-1 pt-1 overflow-hidden"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-3 pt-1 pb-1">
                  Navigation
                </div>

                {navItems.map((item, index) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.a
                      key={item.id}
                      id={`mobile-dock-item-${item.id}`}
                      href={`#${item.id}`}
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 8, scale: 0.98 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              delay: index * 0.035,
                              type: "spring",
                              damping: 22,
                              stiffness: 350,
                            }
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(item.id);
                      }}
                      aria-current={isActive ? "location" : undefined}
                      className={`min-h-[44px] w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-sm font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                          : "text-foreground hover:bg-muted active:scale-[0.99]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? "text-primary-foreground" : "text-muted-foreground"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="size-2 rounded-full bg-brand-orange shrink-0" />
                      )}
                    </motion.a>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Dock Control Pill (Always visible on mobile) */}
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            {/* Active section quick jump */}
            <a
              id="mobile-dock-active-btn"
              href={`#${activeItem.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(activeItem.id);
              }}
              aria-label={`Current section: ${activeItem.label}. Click to jump to top.`}
              className="min-h-[44px] flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-2xs">
                <span className="scale-85">{activeItem.icon}</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono text-muted-foreground leading-none">
                  Current
                </span>
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {activeItem.label}
                </span>
              </div>
            </a>

            {/* Expand / Collapse toggle button */}
            <button
              id="mobile-dock-menu-btn"
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full bg-muted/80 hover:bg-muted text-foreground font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 shadow-2xs"
            >
              <span>{isOpen ? "Close" : "Menu"}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`size-3.5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default MobileDock;

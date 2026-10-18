"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { CommandIcon } from "@hugeicons/core-free-icons";
import { sidebar } from "./side-config";
import SidebarTag from "./sidebar-tag";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useSidebarStore } from "@/store/sidebarStore";

export interface SidebarUser {
  id?: string;
  email?: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}

interface SidebarProps {
  user?: SidebarUser | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const displayName = user?.fullName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "No email";
  const userInitial = (
    user?.fullName?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  // Keyboard shortcut: Cmd+B or Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  // High-performance spring transition for sidebar width
  const sidebarTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 34, mass: 0.8 };

  // Sub-element fade & translate without expensive width:"auto" layout recalculations
  const labelTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: isOpen ? 0.2 : 0.08,
        ease: isOpen ? [0.16, 1, 0.3, 1] : "easeOut",
      };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={sidebarTransition}
      style={{ willChange: "width" }}
      className="hidden md:flex overflow-hidden shrink-0 h-full font-sans flex-col justify-between bg-sidebar text-sidebar-foreground py-2 px-2 select-none"
    >
      <div className="flex flex-col gap-5">
        {/* Workspace Brand / Logo */}
        <div
          className={`flex items-center h-10 overflow-hidden ${
            isOpen ? "px-1.5" : "justify-center px-0"
          }`}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-xs">
            <HugeiconsIcon icon={CommandIcon} size={18} strokeWidth={2.2} />
          </div>

          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              x: isOpen ? 0 : -6,
            }}
            transition={labelTransition}
            className={`flex flex-col ml-2.5 overflow-hidden whitespace-nowrap ${
              !isOpen ? "pointer-events-none hidden" : ""
            }`}
          >
            <span className="text-sm font-semibold tracking-tight leading-none text-sidebar-foreground">
              Ryuk
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              Workspace
            </span>
          </motion.div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1" aria-label="Main Navigation">
          {sidebar.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isOpen ? item.label : undefined}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center transition-colors duration-150 ${
                  isOpen
                    ? "w-full h-10 px-2.5 rounded-xl justify-start text-sm"
                    : "size-10 mx-auto rounded-xl justify-center p-0"
                } ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-xs"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal"
                }`}
              >
                {/* Icon is ALWAYS fixed size & perfectly centered */}
                <div className="flex items-center justify-center size-5 shrink-0">
                  <HugeiconsIcon
                    icon={item.icon}
                    size={19}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />
                </div>

                {/* Text Label + Tag */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isOpen ? 1 : 0,
                    x: isOpen ? 0 : -6,
                  }}
                  transition={labelTransition}
                  className={`flex flex-1 items-center justify-between ml-3 overflow-hidden whitespace-nowrap min-w-0 ${
                    !isOpen ? "pointer-events-none hidden" : ""
                  }`}
                >
                  <span className="truncate text-[13px]">{item.label}</span>
                  {item.tag && (
                    <SidebarTag
                      tag={item.tag}
                      variant={item.tagVariant}
                      className="shrink-0 ml-1.5"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Theme Toggle Footer */}
      <div
        className={`border-t border-sidebar-border/60 pt-3 flex items-center h-12 overflow-hidden ${
          isOpen ? "justify-between px-1" : "justify-center px-0"
        }`}
      >
        <div
          className="flex items-center min-w-0 overflow-hidden"
          title={!isOpen ? `${displayName} (${userEmail})` : undefined}
        >
          <div className="size-8 shrink-0 rounded-full overflow-hidden bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground border border-sidebar-border shadow-2xs">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{userInitial}</span>
            )}
          </div>

          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              x: isOpen ? 0 : -6,
            }}
            transition={labelTransition}
            className={`flex flex-col ml-2.5 overflow-hidden whitespace-nowrap min-w-0 max-w-28 ${
              !isOpen ? "pointer-events-none hidden" : ""
            }`}
          >
            <span className="text-xs font-semibold text-sidebar-foreground truncate">
              {displayName}
            </span>
            <span
              className="text-[11px] text-muted-foreground truncate"
              title={userEmail}
            >
              {userEmail}
            </span>
          </motion.div>
        </div>

        {/* ThemeToggle */}
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            scale: isOpen ? 1 : 0.85,
          }}
          transition={labelTransition}
          className={`shrink-0 ${
            !isOpen ? "pointer-events-none hidden" : ""
          }`}
        >
          <ThemeToggle />
        </motion.div>
      </div>
    </motion.aside>
  );
}

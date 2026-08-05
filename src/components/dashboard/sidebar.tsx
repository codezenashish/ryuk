"use client";

import { useDashboardStore } from "@/store/useDashboard";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Key01Icon } from "@hugeicons/core-free-icons";
import {
  ViewSidebarLeftIcon,
  ViewSidebarRightIcon,
} from "@hugeicons/core-free-icons";
import { navItems } from "./sidebarConfig";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { DASHBOARD_TOP_STRIP_CLASS } from "./dashboard-frame";
import ApiKeyDialog from "@/features/settings/components/ApiKeyDialog";

export default function Sidebar() {
  const isCollapsed = useDashboardStore((state) => state.isCollapsed);
  const setIsCollapsed = useDashboardStore((state) => state.setIsCollapsed);
  const setActiveTab = useDashboardStore((state) => state.setActiveTab);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const wasMobile = useRef<boolean | null>(null);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  // Better Auth se user data fetch kar rahe hain
  const { data: session, isPending } = authClient.useSession();

  // Logout Function
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 768;

      if (isMobileNow) {
        setIsCollapsed(true);
        if (wasMobile.current === null || wasMobile.current === false) {
          setIsMobileSidebarVisible(true);
        }
      } else {
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

  // Group nav items by their "group" field
  const groupedNavItems = navItems.reduce<
    { group: string; items: typeof navItems }[]
  >((acc, item) => {
    const groupName = item.group ?? "";
    const existing = acc.find((g) => g.group === groupName);
    if (existing) {
      existing.items.push(item);
    } else {
      acc.push({ group: groupName, items: [item] });
    }
    return acc;
  }, []);

  const width = isCollapsed ? 64 : 256;
  const mobileSidebarX = isMobileSidebarVisible ? 0 : -width;

  const handleMobileDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    if (window.innerWidth >= 768) return;

    const shouldHide = info.offset.x < -28 || info.velocity.x < -450;

    if (shouldHide) {
      setIsMobileSidebarVisible(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <motion.aside
        onPanEnd={handleMobileDragEnd}
        animate={{ width, x: mobileSidebarX }}
        transition={{
          width: { type: "spring", stiffness: 320, damping: 32 },
          x: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }}
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen shrink-0 flex-col overflow-hidden border-r border-stone-200 bg-white text-stone-600 transition-colors duration-300 select-none md:relative dark:border-white/6 dark:bg-[#0c0c0b] dark:text-stone-400",
          !isMobileSidebarVisible &&
            "pointer-events-none md:pointer-events-auto",
        )}
      >
        <div
          className={cn(
            DASHBOARD_TOP_STRIP_CLASS,
            "relative",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 px-1"
            >
              <span className="font-sans-system text-sm font-semibold tracking-wider text-stone-900 dark:text-stone-200">
                DevNest
              </span>
            </motion.div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-stone-600 transition-all duration-200 hover:border-stone-300 hover:bg-stone-200/60 hover:text-stone-900 dark:border-white/8 dark:bg-white/4 dark:text-stone-400 dark:hover:border-white/14 dark:hover:bg-white/8 dark:hover:text-stone-200"
          >
            {isCollapsed ? (
              <HugeiconsIcon icon={ViewSidebarRightIcon} size={16} />
            ) : (
              <HugeiconsIcon icon={ViewSidebarLeftIcon} size={16} />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-3 py-4">
          {groupedNavItems.map(({ group, items }) => (
            <div key={group || "ungrouped"}>
              {/* Gray section label */}
              <AnimatePresence initial={false}>
                {!isCollapsed && group && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden px-2 pb-1.5 text-[11px] font-semibold tracking-wide text-stone-400 uppercase dark:text-stone-600"
                  >
                    {group}
                  </motion.p>
                )}
              </AnimatePresence>

              <div
                className={cn(
                  isCollapsed
                    ? "space-y-1.5"
                    : "overflow-hidden rounded-xl border border-stone-200 bg-stone-50/60 dark:border-white/6 dark:bg-white/2",
                )}
              >
                {items.map((item, idx) => {
                  const href = item.href;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      onClick={() => {
                        setActiveTab(href);
                        if (window.innerWidth < 768) setIsCollapsed(true);
                      }}
                      className={cn(
                        "group font-sans-system relative flex items-center gap-3 text-sm tracking-tighter transition-all duration-300",
                        isCollapsed
                          ? "mx-auto h-11 w-11 justify-center rounded-xl p-0"
                          : "px-3 py-2.5",
                        !isCollapsed &&
                          idx !== items.length - 1 &&
                          "border-b border-stone-200/70 dark:border-white/5",
                        isActive
                          ? "bg-stone-100 font-medium text-stone-900 dark:bg-white/6 dark:text-stone-100"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/4 dark:hover:text-stone-200",
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeGlowPipeIndicator"
                          className="absolute top-1/4 -left-3 h-1/2 w-0.75 rounded-r-full bg-stone-800 dark:bg-stone-300"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}

                      <div className="relative flex shrink-0 items-center justify-center">
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              transition={{ duration: 0.25 }}
                              className="absolute -inset-4 -z-10 rounded-full opacity-30 mix-blend-screen blur-md group-hover:opacity-50"
                            />
                          )}
                        </AnimatePresence>

                        {!isActive && (
                          <div className="absolute inset-0 -z-10 -m-2 rounded-lg bg-stone-500/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-white/5" />
                        )}

                        <HugeiconsIcon
                          icon={item.icon}
                          className={cn(
                            "relative z-10 h-4.5 w-4.5 shrink-0 transition-all duration-300",
                            isActive
                              ? "scale-105 text-stone-800 dark:text-stone-200"
                              : "text-stone-500 group-hover:text-stone-900 dark:text-stone-500 dark:group-hover:text-stone-300",
                            isCollapsed && !isActive
                              ? "group-hover:scale-110"
                              : "",
                          )}
                        />
                      </div>

                      <AnimatePresence mode="wait" initial={false}>
                        {!isCollapsed && (
                          <motion.span
                            initial={{
                              opacity: 0,
                              width: 0,
                              filter: "blur(4px)",
                              x: -6,
                            }}
                            animate={{
                              opacity: 1,
                              width: "auto",
                              filter: "blur(0px)",
                              x: 0,
                            }}
                            exit={{
                              opacity: 0,
                              width: 0,
                              filter: "blur(4px)",
                              x: -6,
                            }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-1 overflow-hidden whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Right-side value */}
                      {!isCollapsed && item.value && (
                        <span className="shrink-0 text-xs text-stone-400 dark:text-stone-500">
                          {item.value}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div
          className={cn(
            "shrink-0 border-t border-stone-200 px-3 py-3 transition-colors duration-300 dark:border-white/6",
            isCollapsed ? "flex justify-center" : "",
          )}
        >
          <ThemeToggle />
        </div>

        <div
          className={cn(
            "shrink-0 border-t border-stone-200 px-3 py-3 transition-colors duration-300 dark:border-white/6",
            isCollapsed ? "flex justify-center" : "",
          )}
        >
          <button
            type="button"
            onClick={() => setIsApiKeyDialogOpen(true)}
            disabled={!session?.user?.id}
            className={cn(
              "group flex h-10 items-center gap-3 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 transition-all duration-200 hover:border-stone-300 hover:bg-stone-200/60 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/8 dark:bg-white/4 dark:text-stone-300 dark:hover:border-white/14 dark:hover:bg-white/8 dark:hover:text-stone-100",
              isCollapsed ? "w-10 justify-center px-0" : "w-full px-3",
            )}
            title={isCollapsed ? "API Key / Settings" : undefined}
          >
            <HugeiconsIcon
              icon={Key01Icon}
              size={16}
              className="text-stone-500 transition-colors group-hover:text-stone-900 dark:text-stone-400 dark:group-hover:text-stone-100"
            />
            <AnimatePresence initial={false} mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm font-medium"
                >
                  API Key / Settings
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Dynamic Profile & Logout Section */}
        <div className="shrink-0 border-t border-stone-200 p-4 transition-colors duration-300 dark:border-white/6">
          {isPending ? (
            <div
              className={cn(
                "flex items-center gap-3",
                isCollapsed && "justify-center",
              )}
            >
              <div className="h-7 w-7 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
              {!isCollapsed && (
                <div className="flex flex-col gap-1">
                  <div className="h-3 w-16 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                  <div className="h-2 w-24 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                </div>
              )}
            </div>
          ) : session ? (
            <div
              onClick={handleLogout}
              title="Click to Log Out"
              className={cn(
                "group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-red-500/8",
                isCollapsed && "justify-center px-0",
              )}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-300 bg-stone-100 text-xs font-bold text-stone-700 transition-all duration-200 group-hover:border-red-500/30 group-hover:bg-red-500/15 group-hover:text-red-500 dark:border-white/12 dark:bg-white/6 dark:text-stone-300 dark:group-hover:text-red-400">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  session.user.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="flex min-w-0 flex-col overflow-hidden"
                  >
                    <span className="truncate text-xs font-semibold whitespace-nowrap text-stone-800 transition-colors group-hover:text-red-500 dark:text-stone-200 dark:group-hover:text-red-400">
                      {session.user.name}
                    </span>
                    <span className="truncate text-[9px] whitespace-nowrap text-stone-500 transition-colors group-hover:text-red-500/70">
                      {session.user.email}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </motion.aside>

      <AnimatePresence>
        {!isMobileSidebarVisible && (
          <motion.button
            type="button"
            aria-label="Show sidebar"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsMobileSidebarVisible(true)}
            className="fixed bottom-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white/95 text-stone-800 shadow-xl shadow-black/10 md:hidden dark:border-white/8 dark:bg-[#0c0c0b]/95 dark:text-stone-200 dark:shadow-black/60"
          >
            <HugeiconsIcon icon={ViewSidebarRightIcon} size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      <ApiKeyDialog
        isOpen={isApiKeyDialogOpen}
        onClose={() => setIsApiKeyDialogOpen(false)}
      />
    </>
  );
}

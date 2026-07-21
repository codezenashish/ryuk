"use client";

import { useDashboardStore } from "@/store/useDashboard";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewSidebarLeftIcon,
  ViewSidebarRightIcon,
} from "@hugeicons/core-free-icons";
import { navItems } from "./sidebarConfig";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client"; // Better Auth client import kiya
import Image from "next/image";
import { DASHBOARD_TOP_STRIP_CLASS } from "./dashboard-frame";

export default function Sidebar() {
  const isCollapsed = useDashboardStore((state) => state.isCollapsed);
  const setIsCollapsed = useDashboardStore((state) => state.setIsCollapsed);
  const setActiveTab = useDashboardStore((state) => state.setActiveTab);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const wasMobile = useRef<boolean | null>(null);

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
    return () => window.removeEventListener("resize", handleResize); // Typo fix kiya yahan (removeEventListener)
  }, [setIsCollapsed]);

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
      {/* Mobile Backdrop Overlay black background */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <motion.aside
        onPanEnd={handleMobileDragEnd}
        animate={{ width, x: mobileSidebarX }}
        transition={{
          width: { type: "spring", stiffness: 350, damping: 35 },
          x: { duration: 0.28, ease: "easeInOut" },
        }}
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen shrink-0 flex-col overflow-hidden border-r border-zinc-900 bg-black text-zinc-400 select-none md:relative",
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
              className="flex items-center gap-2 px-1"
            >
              <span className="font-sans-system text-sm tracking-wider text-zinc-200">
                DevSpace
              </span>
            </motion.div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            {isCollapsed ? (
              <HugeiconsIcon icon={ViewSidebarRightIcon} size={16} />
            ) : (
              <HugeiconsIcon icon={ViewSidebarLeftIcon} size={16} />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-x-hidden overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
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
                  "group font-sans-system relative flex items-center gap-3 rounded-xl text-sm tracking-tighter transition-all duration-300",
                  isCollapsed
                    ? "mx-auto h-11 w-11 justify-center p-0"
                    : "px-3 py-2.5",
                  isActive
                    ? "bg-zinc-900/60 text-violet-200"
                    : "hover:bg-zinc-900/40 hover:text-zinc-100",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGlowPipeIndicator"
                    className="absolute top-1/4 -left-3 h-1/2 w-0.75 rounded-r-full bg-violet-400 shadow-[0_0_15px_4px_rgba(167,139,250,0.65)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
                        className="absolute -inset-4 -z-10 rounded-full opacity-40 mix-blend-screen blur-md group-hover:opacity-65"
                      />
                    )}
                  </AnimatePresence>

                  {!isActive && (
                    <div className="absolute inset-0 -z-10 -m-2 rounded-lg bg-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  )}

                  <HugeiconsIcon
                    icon={item.icon}
                    className={cn(
                      "relative z-10 h-4.5 w-4.5 shrink-0 transition-all duration-300",
                      isActive
                        ? "scale-105 text-violet-300 drop-shadow-[0_0_8px_rgba(196,181,253,0.5)]"
                        : "text-zinc-500 group-hover:text-zinc-300",
                      isCollapsed && !isActive ? "group-hover:scale-110" : "",
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
                      transition={{ duration: 0.18 }}
                      className="flex-1 overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div
          className={cn(
            "shrink-0 border-t border-zinc-900 px-3 py-3",
            isCollapsed ? "flex justify-center" : "",
          )}
        >
          <ThemeToggle />
        </div>

        {/* 👇 YAHAN SE CHANGES HAIN: Dynamic Profile & Logout Section 👇 */}
        <div className="shrink-0 border-t border-zinc-900 p-4">
          {isPending ? (
            // Loading skeleton tab tak dikhayega jab tak data aa raha hai
            <div
              className={cn(
                "flex items-center gap-3",
                isCollapsed && "justify-center",
              )}
            >
              <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-800" />
              {!isCollapsed && (
                <div className="flex flex-col gap-1">
                  <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
                  <div className="h-2 w-24 animate-pulse rounded bg-zinc-800" />
                </div>
              )}
            </div>
          ) : session ? (
            // Actual User Data
            <div
              onClick={handleLogout}
              title="Click to Log Out"
              className={cn(
                "group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-red-500/10",
                isCollapsed && "justify-center px-0",
              )}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-500/20 bg-violet-500/10 text-xs font-bold text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.1)] transition-colors group-hover:border-red-500/30 group-hover:bg-red-500/20 group-hover:text-red-400">
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
                    transition={{ duration: 0.15 }}
                    className="flex min-w-0 flex-col overflow-hidden"
                  >
                    <span className="truncate text-xs font-semibold whitespace-nowrap text-zinc-200 transition-colors group-hover:text-red-400">
                      {session.user.name}
                    </span>
                    <span className="truncate text-[9px] whitespace-nowrap text-zinc-500 transition-colors group-hover:text-red-500/70">
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
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setIsMobileSidebarVisible(true)}
            className="fixed bottom-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/95 text-zinc-200 shadow-xl shadow-black/60 md:hidden"
          >
            <HugeiconsIcon icon={ViewSidebarRightIcon} size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

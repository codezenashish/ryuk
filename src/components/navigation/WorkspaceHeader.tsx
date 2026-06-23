"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  Search,
  Bell,
  Moon,
  Settings,
  Plus,
  ChevronDown,
  Command,
} from "lucide-react";

export default function WorkspaceHeader() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Extract the current page from the pathname for dynamic breadcrumbs
  const currentPathSegment = pathname
    ? pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ||
      "Overview"
    : "Overview";

  const formattedPageName =
    currentPathSegment.charAt(0).toUpperCase() + currentPathSegment.slice(1);

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-white/5 bg-[#09090b]/80 px-4 backdrop-blur-xl md:px-6">
      {/* Left: Workspace Switcher & Breadcrumbs */}
      <div className="flex flex-1 items-center gap-1.5">
        <div className="group flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors">
          {isLoaded ? (
            <>
              <span className="text-sm font-medium text-zinc-200 transition-colors group-hover:text-white">
                {user?.firstName || user?.username || "User"}
              </span>
            </>
          ) : (
            <>
              <div className="size-5 animate-pulse rounded-md bg-white/10" />
              <div className="h-4 w-12 animate-pulse rounded-md bg-white/10" />
            </>
          )}
        </div>

        <span className="text-zinc-700">/</span>

        <div className="group flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1.5 transition-colors ">
          <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-200">
            {formattedPageName}
          </span>
        
        </div>
      </div>

      {/* Center: Global Search (Command Palette Trigger) */}
      <div className="hidden flex-1 justify-center md:flex">
        <button className="group flex h-8 w-full max-w-[320px] items-center justify-between rounded-lg border border-white/5 bg-white/5 px-2.5 text-sm text-zinc-400 shadow-sm backdrop-blur-md transition-all hover:border-white/10 hover:bg-white/10 hover:text-zinc-300 focus:ring-2 focus:ring-white/20 focus:outline-none">
          <div className="flex items-center gap-2">
            <Search className="size-3.5 text-zinc-500 transition-colors group-hover:text-zinc-400" />
            <span className="text-xs font-medium">Search workspace...</span>
          </div>
          <kbd className="flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[10px] font-medium text-zinc-500 shadow-sm transition-colors group-hover:text-zinc-400">
            <Command className="size-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2">
        {/* Mobile Search Icon (Shows only on small screens) */}
        <button className="flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200 md:hidden">
          <Search className="size-4" />
        </button>

        {/* Primary Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden h-8 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors hover:bg-zinc-200 sm:flex"
        >
          <Plus className="size-3.5" />
          <span>New</span>
        </motion.button>

        <div className="mx-1 hidden h-4 w-px bg-white/10 sm:block" />

        {/* Notification Bell */}
        <button className="group relative flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200">
          <Bell className="size-4 transition-transform group-hover:scale-110" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-indigo-500 ring-2 ring-[#09090b]" />
        </button>

        {/* Theme Toggle */}
        <button className="group hidden size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200 sm:flex">
          <Moon className="size-4 transition-transform group-hover:scale-110" />
        </button>

        {/* Settings */}
        <button className="group hidden size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200 md:flex">
          <Settings className="size-4 transition-transform group-hover:rotate-45" />
        </button>

        {/* User Avatar */}
        <div className="ml-1 flex items-center justify-center sm:ml-2">
          {isLoaded ? (
            <div className="flex rounded-full border border-white/10 transition-all hover:scale-105">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-7",
                  },
                }}
              />
            </div>
          ) : (
            <div className="size-7 animate-pulse rounded-full border border-white/10 bg-white/10" />
          )}
        </div>
      </div>
    </header>
  );
}

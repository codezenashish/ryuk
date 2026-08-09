"use client";

import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { BellDotIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { Avatar } from "@avatune/react";
import theme from "@avatune/yanliu-theme/react";

export function Nav() {
  const pathname = usePathname();

  // Get current page title from pathname
  const pageTitle =
    pathname === "/"
      ? "Dashboard"
      : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);

  return (
    <div className="h-full w-full">
      {/* Mobile Nav (shown only on mobile < lg) */}
      <nav className="flex h-full items-center justify-between px-4 lg:hidden">
        {/* Left side: Avatar */}
        <button
          className="rounded-full ring-2 ring-transparent transition hover:ring-line-2"
          aria-label="User menu"
        >
          <Avatar theme={theme} seed="user@example.com" size={32} />
        </button>

        {/* Right side: Bell icon */}
        <button
          className="relative rounded-lg p-2 text-ink-3 transition hover:bg-paper-3 hover:text-ink"
          aria-label="Notifications"
        >
          <HugeiconsIcon icon={BellDotIcon} size={20} strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-paper" />
        </button>
      </nav>

      {/* Desktop Nav (shown on desktop >= lg) */}
      <nav className="hidden h-full items-center justify-between px-6 lg:flex">
        {/* Left side: Page Title */}
        <div className="flex items-center gap-3">
          <h2 className="font-body text-lg font-semibold tracking-tight text-ink">
            {pageTitle}
          </h2>
        </div>

        
        
      </nav>
    </div>
  );
}

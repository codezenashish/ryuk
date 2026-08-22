"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/providers/auth-provider";
import { UserAvatar } from "@/components/common/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/common/search-bar";
import { NotificationBall } from "@/components/common/notification-ball";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { RyukLogo } from "@/components/common/ryuk-logo";
import { useSearchStore } from "@/store/useSearchStore";
import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github } from "@hugeicons/core-free-icons";

export function TopNavbar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { query, setQuery, clearQuery } = useSearchStore();

  // Clear search when navigating to a different route
  useEffect(() => {
    clearQuery();
  }, [pathname, clearQuery]);

  const userSeed =
    user?.imageUrl ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.fullName ||
    "guest@ryuk.dev";

  return (
    <nav className="h-14 w-full flex items-center justify-between px-4 lg:px-6 border-b border-border bg-background/95 backdrop-blur-md shrink-0">
      {/* Left: Branding & Section Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
        >
          <RyukLogo size={28} className="text-foreground" />
          <span className="font-sans font-bold text-base tracking-tight text-foreground hidden sm:inline">
            DevNest
          </span>
        </Link>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 flex justify-center">
        <SearchBar onSearch={setQuery} value={query} />
      </div>

      {/* Right: Global Actions & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <a
          href="https://github.com/codezenashish/ryuk"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground hover:border-foreground/20 hover:text-foreground hover:bg-card transition"
          title="GitHub Repository"
        >
          <HugeiconsIcon size={14} icon={Github} />
          <span className="font-medium text-foreground">GitHub</span>
          <span className="rounded-md bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border">
            v1.0
          </span>
        </a>

        <ModeToggle />

        <NotificationBall />

        {!isLoaded ? (
          <Skeleton className="h-8 w-8 rounded-full bg-muted border border-border" />
        ) : (
          <Link
            href="/setting"
            className="flex items-center gap-2 rounded-full p-0.5 border border-border bg-muted hover:bg-card transition cursor-pointer pr-2.5"
            title="Account Settings"
          >
            <UserAvatar seed={userSeed} size={28} />
            <span className="text-xs font-medium text-foreground max-w-24 truncate hidden sm:inline">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "User"}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default TopNavbar;

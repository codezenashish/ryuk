"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { UserAvatar } from "@/components/common/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/common/search-bar";
import { NotificationBall } from "@/components/common/notification-ball";
import { useBookmarkStore } from "@/store/useBookmarkStore";

export function Nav() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const setSearchQuery = useBookmarkStore((state) => state.setSearchQuery);

  const pageTitle =
    pathname === "/"
      ? "Dashboard"
      : pathname === "/setting" || pathname === "/settings"
      ? "Settings"
      : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);

  const userSeed =
    session?.user?.image ||
    session?.user?.email ||
    session?.user?.name ||
    "guest@ryuk.dev";

  return (
    <div className="h-full w-full">
      {/* Mobile Nav */}
      <nav className="flex h-full items-center justify-between px-4 lg:hidden">
        {isPending ? (
          <Skeleton className="h-8 w-8 rounded-full bg-paper-3 border border-line" />
        ) : (
          <Link
            href="/setting"
            className="rounded-full ring-2 ring-transparent transition hover:ring-line-2 cursor-pointer"
            aria-label="Account Settings"
          >
            <UserAvatar seed={userSeed} size={32} />
          </Link>
        )}

        <NotificationBall />
      </nav>

      {/* Desktop Nav */}
      <nav className="hidden h-full items-center justify-between px-6 lg:flex">
        <div className="flex items-center gap-3 min-w-40">
          <h2 className="font-body text-lg font-semibold tracking-tight text-ink">
            {pageTitle}
          </h2>
        </div>

        <div className="flex-1 max-w-md mx-6 flex justify-center">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="flex items-center gap-3">
          <NotificationBall />

          {isPending ? (
            <div className="flex items-center gap-2.5 rounded-full p-1 border border-line bg-paper-3 pr-3">
              <Skeleton className="h-7 w-7 rounded-full bg-paper-card" />
              <Skeleton className="h-3.5 w-20 rounded-md bg-paper-card" />
            </div>
          ) : (
            <Link
              href="/setting"
              className="flex items-center gap-2.5 rounded-full p-1 border border-line bg-paper-3 hover:bg-paper-card transition cursor-pointer pr-3"
              title="Account Settings"
            >
              <UserAvatar seed={userSeed} size={30} />
              <span className="text-xs font-medium text-ink max-w-30 truncate">
                {session?.user?.name || "User"}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

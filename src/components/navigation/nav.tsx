"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { UserAvatar } from "@/components/common/user-avatar";
import EditProfileModal from "@/components/common/edit-profile-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/common/search-bar";
import { NotificationBall } from "@/components/common/notification-ball";

import { useBookmarkStore } from "@/store/useBookmarkStore";

export function Nav() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const setSearchQuery = useBookmarkStore((state) => state.setSearchQuery);

  // Get current page title from pathname
  const pageTitle =
    pathname === "/"
      ? "Dashboard"
      : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);

  const userSeed =
    session?.user?.image ||
    session?.user?.email ||
    session?.user?.name ||
    "guest@ryuk.dev";

  return (
    <div className="h-full w-full">
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Mobile Nav (shown only on mobile < lg) */}
      <nav className="flex h-full items-center justify-between px-4 lg:hidden">
        {/* Left side: Avatar */}
        {isPending ? (
          <Skeleton className="h-8 w-8 rounded-full bg-paper-3 border border-line" />
        ) : (
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="rounded-full ring-2 ring-transparent transition hover:ring-line-2 cursor-pointer"
            aria-label="User menu"
          >
            <UserAvatar seed={userSeed} size={32} />
          </button>
        )}

        {/* Right side: Notification Ball */}
        <NotificationBall />
      </nav>

      {/* Desktop Nav (shown on desktop >= lg) */}
      <nav className="hidden h-full items-center justify-between px-6 lg:flex">
        {/* Left side: Page Title */}
        <div className="flex items-center gap-3 min-w-40">
          <h2 className="font-body text-lg font-semibold tracking-tight text-ink">
            {pageTitle}
          </h2>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-6 flex justify-center">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {/* Right side: Notification Ball & User Profile Avatar */}
        <div className="flex items-center gap-3">
          <NotificationBall />

          {isPending ? (
            <div className="flex items-center gap-2.5 rounded-full p-1 border border-line bg-paper-3 pr-3">
              <Skeleton className="h-7 w-7 rounded-full bg-paper-card" />
              <Skeleton className="h-3.5 w-20 rounded-md bg-paper-card" />
            </div>
          ) : (
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center gap-2.5 rounded-full p-1 border border-line bg-paper-3 hover:bg-paper-card transition cursor-pointer pr-3"
              title="Edit Profile"
            >
              <UserAvatar seed={userSeed} size={30} />
              <span className="text-xs font-medium text-ink max-w-30 truncate">
                {session?.user?.name || "User"}
              </span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

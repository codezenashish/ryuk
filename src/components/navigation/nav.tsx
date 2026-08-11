"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { BellDotIcon } from "@hugeicons/core-free-icons";
import { useSession } from "@/lib/auth-client";
import { UserAvatar } from "@/components/common/user-avatar";
import EditProfileModal from "@/components/common/edit-profile-modal";

export function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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
        <button
          onClick={() => setIsEditProfileOpen(true)}
          className="rounded-full ring-2 ring-transparent transition hover:ring-line-2 cursor-pointer"
          aria-label="User menu"
        >
          <UserAvatar seed={userSeed} size={32} />
        </button>

        {/* Right side: Bell icon */}
        <button
          className="relative rounded-lg p-2 text-ink-3 transition hover:bg-paper-3 hover:text-ink cursor-pointer"
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

        {/* Right side: User Profile Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="flex items-center gap-2.5 rounded-full p-1 border border-line bg-paper-3 hover:bg-paper-card transition cursor-pointer pr-3"
            title="Edit Profile"
          >
            <UserAvatar seed={userSeed} size={30} />
            <span className="text-xs font-medium text-ink max-w-[120px] truncate">
              {session?.user?.name || "Guest"}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}

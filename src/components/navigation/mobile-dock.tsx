"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Plus } from "lucide-react";
import { sidebar } from "./side-config";
import { useBookmarkStore } from "@/store/useBookmarkStore";

export default function MobileDock() {
  const pathname = usePathname();
  const { openAddModal } = useBookmarkStore();

  const handlePlusClick = () => {
    if (pathname.startsWith("/notes")) {
      window.dispatchEvent(new CustomEvent("open-new-note"));
    } else {
      openAddModal(null);
    }
  };

  const navLeft = sidebar.slice(0, 2);
  const navRight = sidebar.slice(2);

  return (
    <div className="fixed bottom-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none lg:hidden">
      <nav className="pointer-events-auto flex items-center justify-between gap-1 px-2.5 py-1.5 rounded-full border border-border/80 bg-card/95 backdrop-blur-2xl shadow-[0_16px_36px_rgba(0,0,0,0.4)] ring-1 ring-white/10 max-w-sm w-full select-none">
        <div className="flex items-center gap-1 flex-1">
          {navLeft.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span className="text-[10px] leading-tight font-medium mt-0.5 tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handlePlusClick}
          aria-label="Create item"
          title="Create"
          className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-primary-foreground/20 shrink-0 mx-1"
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1 flex-1">
          {navRight.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span className="text-[10px] leading-tight font-medium mt-0.5 tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

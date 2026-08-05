"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PlusSignIcon,
  MoreHorizontalIcon,
  Download01Icon,
  Upload01Icon,
  LayoutGridIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DASHBOARD_TOP_STRIP_CLASS } from "@/components/dashboard/dashboard-frame";

import AddBookmarkDialog from "./add-bookmark-dialog";

interface BookmarksToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  viewType: "grid" | "list";
  onViewTypeChange: (viewType: "grid" | "list") => void;
}

export default function BookmarksToolbar({
  searchQuery,
  onSearchQueryChange,
  viewType,
  onViewTypeChange,
}: BookmarksToolbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogInstance, setDialogInstance] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className={cn(
          DASHBOARD_TOP_STRIP_CLASS,
          "w-full justify-between gap-3 font-sans text-stone-700 dark:text-stone-300 transition-colors duration-200",
        )}
      >
        {/* Left side: Search and Add */}
        <div className="flex flex-1 items-center gap-2">
          {/* Search Bar */}
          <div className="group relative max-w-50 flex-1 md:max-w-60">
            <HugeiconsIcon
              icon={Search01Icon}
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-stone-400 dark:text-stone-500 transition-colors duration-200 group-focus-within:text-stone-700 dark:group-focus-within:text-stone-300"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search..."
              className="h-8 w-full rounded-lg border border-stone-200 dark:border-white/8 bg-white/80 dark:bg-white/3 pr-3 pl-9 text-xs text-stone-800 dark:text-stone-200 transition-all duration-200 outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:border-stone-300 dark:focus:border-white/14 focus:bg-white dark:focus:bg-white/6 focus:ring-1 focus:ring-stone-300 dark:focus:ring-white/10"
            />
          </div>

    
          <Button
            title="Add Bookmark"
            variant="outline"
            size="sm"
            onClick={() => {
              setDialogInstance((instance) => instance + 1);
              setIsDialogOpen(true);
            }}
            className="h-8 shrink-0 cursor-pointer gap-1.5 border-stone-300 dark:border-white/8 bg-stone-900 text-white dark:bg-white/8 dark:text-stone-200 px-3 text-xs font-medium transition-all duration-200 hover:bg-stone-800 dark:hover:bg-white/14 hover:text-white"
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={14}
              className="text-stone-300 dark:text-stone-400 group-hover:text-white"
            />
            <span className="hidden sm:inline">Add Bookmark</span>
          </Button>
        </div>

        {/* Right side: Actions / More menu */}
        <div className="flex items-center gap-2">
          {/* Desktop Controls (Hidden on Mobile) */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Import */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer gap-1.5 border-stone-200 dark:border-white/6 bg-stone-100 dark:bg-white/3 px-3 text-xs text-stone-600 dark:text-stone-400 transition-all duration-200 hover:border-stone-300 dark:hover:border-white/12 hover:bg-stone-200/50 dark:hover:bg-white/6 hover:text-stone-900 dark:hover:text-stone-200"
            >
              <HugeiconsIcon
                icon={Upload01Icon}
                size={13}
                className="text-stone-500"
              />
              <span>Import</span>
            </Button>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer gap-1.5 border-stone-200 dark:border-white/6 bg-stone-100 dark:bg-white/3 px-3 text-xs text-stone-600 dark:text-stone-400 transition-all duration-200 hover:border-stone-300 dark:hover:border-white/12 hover:bg-stone-200/50 dark:hover:bg-white/6 hover:text-stone-900 dark:hover:text-stone-200"
            >
              <HugeiconsIcon
                icon={Download01Icon}
                size={13}
                className="text-stone-500"
              />
              <span>Export</span>
            </Button>

            {/* Minimalist Separator */}
            <div className="mx-1 h-3 w-px bg-stone-200 dark:bg-white/8" />

            {/* Layout Switcher Container */}
            <div className="flex items-center rounded-lg border border-stone-200 dark:border-white/6 bg-stone-100 dark:bg-white/3 p-0.5">
              <Button
                onClick={() => onViewTypeChange("grid")}
                variant="ghost"
                className={cn(
                  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md p-0 transition-all duration-200",
                  viewType === "grid"
                    ? "border border-stone-300 dark:border-white/10 bg-white dark:bg-white/8 text-stone-900 dark:text-stone-200 shadow-xs"
                    : "text-stone-400 dark:text-stone-500 hover:bg-transparent hover:text-stone-700 dark:hover:text-stone-300",
                )}
              >
                <HugeiconsIcon icon={LayoutGridIcon} size={14} />
              </Button>
              <Button
                onClick={() => onViewTypeChange("list")}
                variant="ghost"
                className={cn(
                  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md p-0 transition-all duration-200",
                  viewType === "list"
                    ? "border border-stone-300 dark:border-white/10 bg-white dark:bg-white/8 text-stone-900 dark:text-stone-200 shadow-xs"
                    : "text-stone-400 dark:text-stone-500 hover:bg-transparent hover:text-stone-700 dark:hover:text-stone-300",
                )}
              >
                <HugeiconsIcon icon={Menu01Icon} size={14} />
              </Button>
            </div>
          </div>

          {/* Mobile More Options Dropdown */}
          <div className="relative flex items-center md:hidden" ref={menuRef}>
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="More Options"
              variant="outline"
              className={cn(
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border p-0 transition-all duration-200",
                isMenuOpen
                  ? "border-stone-300 dark:border-white/14 bg-stone-100 dark:bg-white/8 text-stone-900 dark:text-stone-200"
                  : "border-stone-200 dark:border-white/6 bg-white dark:bg-white/3 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/6 hover:text-stone-900 dark:hover:text-stone-300",
              )}
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
            </Button>

            {/* Premium Dropdown Menu Container */}
            {isMenuOpen && (
              <div className="animate-in fade-in slide-in-from-top-1 absolute top-9.5 right-0 z-50 w-44 rounded-xl border border-stone-200 dark:border-white/10 bg-white/95 dark:bg-[#111110]/95 p-1.5 shadow-xl shadow-stone-950/5 dark:shadow-black/80 backdrop-blur-md duration-100">
                {/* Dropdown Section: Layout switcher inside menu */}
                <div className="mb-1 flex items-center justify-between border-b border-stone-200 dark:border-white/6 px-2 py-1.5">
                  <span className="text-[10px] font-medium tracking-wider text-stone-500">
                    Layout
                  </span>
                  <div className="flex rounded-md border border-stone-200 dark:border-white/6 bg-stone-100 dark:bg-white/3 p-0.5">
                    <Button
                      onClick={() => {
                        onViewTypeChange("grid");
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      className={cn(
                        "h-5 rounded px-2 py-0.5 text-[10px] font-medium transition-colors",
                        viewType === "grid"
                          ? "bg-white dark:bg-white/8 text-stone-900 dark:text-stone-200 shadow-xs"
                          : "text-stone-500 hover:bg-transparent hover:text-stone-900 dark:hover:text-stone-300",
                      )}
                    >
                      Grid
                    </Button>
                    <Button
                      onClick={() => {
                        onViewTypeChange("list");
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      className={cn(
                        "h-5 rounded px-2 py-0.5 text-[10px] font-medium transition-colors",
                        viewType === "list"
                          ? "bg-white dark:bg-white/8 text-stone-900 dark:text-stone-200 shadow-xs"
                          : "text-stone-500 hover:bg-transparent hover:text-stone-900 dark:hover:text-stone-300",
                      )}
                    >
                      List
                    </Button>
                  </div>
                </div>

                {/* Import Action */}
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  variant="ghost"
                  className="flex h-7 w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-stone-500 dark:text-stone-400 transition-colors hover:bg-stone-100 dark:hover:bg-white/6 hover:text-stone-900 dark:hover:text-stone-200"
                >
                  <HugeiconsIcon
                    icon={Upload01Icon}
                    size={14}
                    className="text-stone-500"
                  />
                  <span>Import Data</span>
                </Button>

                {/* Export Action */}
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  variant="ghost"
                  className="flex h-7 w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-stone-500 dark:text-stone-400 transition-colors hover:bg-stone-100 dark:hover:bg-white/6 hover:text-stone-900 dark:hover:text-stone-200"
                >
                  <HugeiconsIcon
                    icon={Download01Icon}
                    size={14}
                    className="text-stone-500"
                  />
                  <span>Export Data</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* AddBookmarkDialog Component yahan render hoga */}
        <AddBookmarkDialog
          key={dialogInstance}
          isDialogOpen={isDialogOpen}
          onDialogClose={() => setIsDialogOpen(false)}
        />
      </div>
    </>
  );
}

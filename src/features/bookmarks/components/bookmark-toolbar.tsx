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

// AddBookmarkDialog component import karein
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
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog control state
  const [dialogInstance, setDialogInstance] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dropdown ko bahar click karne par close karne ka clean logic
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
      <div className="flex w-full items-center justify-between gap-3 font-sans text-zinc-300">
        {/* Left side: Search and Add */}
        <div className="flex flex-1 items-center gap-2">
          {/* Search Bar */}
          <div className="group relative max-w-[200px] flex-1 md:max-w-[240px]">
            <HugeiconsIcon
              icon={Search01Icon}
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-zinc-300"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search..."
              className="h-8 w-full rounded-lg border border-zinc-900 bg-zinc-950/40 pr-3 pl-9 text-xs text-zinc-200 transition-all duration-200 outline-none placeholder:text-zinc-600 focus:border-zinc-800 focus:bg-zinc-950/80 focus:ring-1 focus:ring-zinc-800"
            />
          </div>

          {/* Add Button - subtle click feedback connected to Dialog toggle */}
          <Button
            title="Add Bookmark"
            variant="outline"
            size="sm"
            onClick={() => {
              setDialogInstance((instance) => instance + 1);
              setIsDialogOpen(true);
            }}
            className="active:bg-zinc-850 h-8 shrink-0 cursor-pointer gap-1.5 border-zinc-800 bg-zinc-900 px-3 text-xs font-medium text-zinc-200 transition-colors duration-150 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={14}
              className="text-zinc-400 group-hover:text-white"
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
              className="h-8 cursor-pointer gap-1.5 border-zinc-900 bg-zinc-950/40 px-3 text-xs text-zinc-400 transition-colors duration-150 hover:border-zinc-800 hover:bg-zinc-900/30 hover:text-zinc-200"
            >
              <HugeiconsIcon
                icon={Upload01Icon}
                size={13}
                className="text-zinc-500"
              />
              <span>Import</span>
            </Button>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer gap-1.5 border-zinc-900 bg-zinc-950/40 px-3 text-xs text-zinc-400 transition-colors duration-150 hover:border-zinc-800 hover:bg-zinc-900/30 hover:text-zinc-200"
            >
              <HugeiconsIcon
                icon={Download01Icon}
                size={13}
                className="text-zinc-500"
              />
              <span>Export</span>
            </Button>

            {/* Minimalist Separator */}
            <div className="mx-1 h-3 w-px bg-zinc-800" />

            {/* Layout Switcher Container */}
            <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950/40 p-0.5">
              <Button
                onClick={() => onViewTypeChange("grid")}
                variant="ghost"
                className={cn(
                  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md p-0 text-zinc-500 transition-colors duration-150",
                  viewType === "grid"
                    ? "border border-zinc-800/60 bg-zinc-900 text-zinc-200"
                    : "hover:bg-transparent hover:text-zinc-300",
                )}
              >
                <HugeiconsIcon icon={LayoutGridIcon} size={14} />
              </Button>
              <Button
                onClick={() => onViewTypeChange("list")}
                variant="ghost"
                className={cn(
                  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md p-0 text-zinc-500 transition-colors duration-150",
                  viewType === "list"
                    ? "border border-zinc-800/60 bg-zinc-900 text-zinc-200"
                    : "hover:bg-transparent hover:text-zinc-300",
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
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border p-0 transition-colors duration-150",
                isMenuOpen
                  ? "border-zinc-700 bg-zinc-900 text-zinc-200"
                  : "border-zinc-900 bg-zinc-950/40 text-zinc-500 hover:bg-zinc-900/20 hover:text-zinc-300",
              )}
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
            </Button>

            {/* Premium Dropdown Menu Container */}
            {isMenuOpen && (
              <div className="animate-in fade-in slide-in-from-top-1 absolute top-9.5 right-0 z-50 w-44 rounded-xl border border-zinc-800/80 bg-zinc-950/95 p-1.5 shadow-xl shadow-black/80 backdrop-blur-md duration-100">
                {/* Dropdown Section: Layout switcher inside menu */}
                <div className="mb-1 flex items-center justify-between border-b border-zinc-900/80 px-2 py-1.5">
                  <span className="text-[10px] font-medium tracking-wider text-zinc-500">
                    Layout
                  </span>
                  <div className="flex rounded-md border border-zinc-900 bg-zinc-950 p-0.5">
                    <Button
                      onClick={() => {
                        onViewTypeChange("grid");
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      className={cn(
                        "h-5 rounded px-2 py-0.5 text-[10px] font-medium transition-colors",
                        viewType === "grid"
                          ? "bg-zinc-900 text-zinc-200"
                          : "text-zinc-500 hover:bg-transparent hover:text-zinc-300",
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
                          ? "bg-zinc-900 text-zinc-200"
                          : "text-zinc-500 hover:bg-transparent hover:text-zinc-300",
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
                  className="flex h-7 w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-900/60 hover:text-zinc-200"
                >
                  <HugeiconsIcon
                    icon={Upload01Icon}
                    size={14}
                    className="text-zinc-500"
                  />
                  <span>Import Data</span>
                </Button>

                {/* Export Action */}
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  variant="ghost"
                  className="flex h-7 w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-900/60 hover:text-zinc-200"
                >
                  <HugeiconsIcon
                    icon={Download01Icon}
                    size={14}
                    className="text-zinc-500"
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

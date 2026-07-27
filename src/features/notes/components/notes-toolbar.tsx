"use client";

import { useRef, useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PlusSignIcon,
  MoreHorizontalIcon,
  Download01Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DASHBOARD_TOP_STRIP_CLASS } from "@/components/dashboard/dashboard-frame";

interface NotesToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onNewNote: () => void;
}

export default function NotesToolbar({
  searchQuery,
  onSearchQueryChange,
  onNewNote,
}: NotesToolbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortMode, setSortMode] = useState<"recent" | "alpha">("recent");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const primaryActionClassName =
    "active:bg-zinc-850 h-8 shrink-0 cursor-pointer gap-1.5 border-zinc-800 bg-zinc-900 px-3 text-xs font-medium text-zinc-200 transition-colors duration-150 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white";

  return (
    <div
      className={cn(
        DASHBOARD_TOP_STRIP_CLASS,
        "w-full justify-between gap-3 font-sans text-zinc-300",
      )}
    >
    
      <div className="flex flex-1 items-center gap-2">
        <div className="group relative max-w-50 flex-1 md:max-w-60">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-zinc-300"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search..."
            className="h-8 w-full rounded-lg border border-zinc-900 bg-zinc-950/40 pr-3 pl-9 text-xs text-zinc-200 transition-all duration-200 outline-none placeholder:text-zinc-600 focus:border-zinc-800 focus:bg-zinc-950/80 focus:ring-1 focus:ring-zinc-800"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNewNote}
          className={primaryActionClassName}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
          <span className="hidden sm:inline">New Note</span>
        </Button>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2">
        {/* Desktop Controls */}
        <div className="hidden items-center gap-2 md:flex">
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

          <div className="mx-1 h-3 w-px bg-zinc-800" />

          <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950/40 p-0.5">
            <Button
              onClick={() => setSortMode("recent")}
              variant="ghost"
              className={cn(
                "flex h-7 items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors duration-150",
                sortMode === "recent"
                  ? "border border-zinc-800/60 bg-zinc-900 text-zinc-200"
                  : "text-zinc-500 hover:bg-transparent hover:text-zinc-300",
              )}
            >
              Recent
            </Button>
            <Button
              onClick={() => setSortMode("alpha")}
              variant="ghost"
              className={cn(
                "flex h-7 items-center justify-center rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors duration-150",
                sortMode === "alpha"
                  ? "border border-zinc-800/60 bg-zinc-900 text-zinc-200"
                  : "text-zinc-500 hover:bg-transparent hover:text-zinc-300",
              )}
            >
              A-Z
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="relative flex items-center md:hidden" ref={menuRef}>
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="outline"
            className={cn(
              "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border p-0 transition-colors duration-150",
              isMenuOpen
                ? "border-zinc-700 bg-zinc-900"
                : "border-zinc-900 bg-zinc-950/40",
            )}
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
          </Button>

          {isMenuOpen && (
            <div className="animate-in fade-in slide-in-from-top-1 absolute top-9.5 right-0 z-50 w-44 rounded-xl border border-zinc-800/80 bg-zinc-950/95 p-1.5 shadow-xl shadow-black/80 backdrop-blur-md duration-100">
              <div className="mb-1 flex items-center justify-between border-b border-zinc-900/80 px-2 py-1.5">
                <span className="text-[10px] font-medium tracking-wider text-zinc-500">
                  Sort
                </span>
                <div className="flex rounded-md border border-zinc-900 bg-zinc-950 p-0.5">
                  <Button
                    onClick={() => {
                      setSortMode("recent");
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className={cn(
                      "h-5 rounded px-2 py-0.5 text-[10px] font-medium transition-colors",
                      sortMode === "recent"
                        ? "bg-zinc-900 text-zinc-200"
                        : "text-zinc-500 hover:bg-transparent hover:text-zinc-300",
                    )}
                  >
                    Recent
                  </Button>
                  <Button
                    onClick={() => {
                      setSortMode("alpha");
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className={cn(
                      "h-5 rounded px-2 py-0.5 text-[10px] font-medium transition-colors",
                      sortMode === "alpha"
                        ? "bg-zinc-900 text-zinc-200"
                        : "text-zinc-500 hover:bg-transparent hover:text-zinc-300",
                    )}
                  >
                    A-Z
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                className="flex h-7 w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-900/60 hover:text-zinc-200"
              >
                <HugeiconsIcon icon={Upload01Icon} size={14} />
                <span>Import</span>
              </Button>
              <Button
                variant="ghost"
                className="flex h-7 w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-900/60 hover:text-zinc-200"
              >
                <HugeiconsIcon icon={Download01Icon} size={14} />
                <span>Export</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

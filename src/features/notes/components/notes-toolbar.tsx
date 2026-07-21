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

  return (
    <div className="flex w-full items-center justify-between gap-3 font-sans text-zinc-300">
      {/* Left side: Search and New Note */}
      <div className="flex flex-1 items-center gap-2">
        <div className="group relative max-w-[200px] flex-1 md:max-w-[240px]">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500 transition-colors duration-200 group-focus-within:text-zinc-300"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search notes..."
            className="h-8 w-full rounded-lg border border-zinc-900 bg-zinc-950/40 pr-3 pl-9 text-xs text-zinc-200 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-zinc-800 focus:bg-zinc-950/80 focus:ring-1 focus:ring-zinc-800"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNewNote}
          className="h-8 shrink-0 cursor-pointer gap-1.5 border-zinc-800 bg-zinc-900 px-3 text-xs font-medium text-zinc-200 transition-colors duration-150 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
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
            className="h-8 cursor-pointer gap-1.5 border-zinc-900 bg-zinc-950/40 px-3 text-xs text-zinc-400 transition-colors hover:border-zinc-800 hover:bg-zinc-900/30 hover:text-zinc-200"
          >
            <HugeiconsIcon icon={Search01Icon} size={13} />
            <span>Sort</span>
          </Button>

          <div className="mx-1 h-3 w-px bg-zinc-800" />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-200"
            title="Import"
          >
            <HugeiconsIcon icon={Upload01Icon} size={15} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-200"
            title="Export"
          >
            <HugeiconsIcon icon={Download01Icon} size={15} />
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="relative flex items-center md:hidden" ref={menuRef}>
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="outline"
            className={cn(
              "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border p-0",
              isMenuOpen ? "border-zinc-700 bg-zinc-900" : "border-zinc-900 bg-zinc-950/40"
            )}
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
          </Button>

          {isMenuOpen && (
            <div className="animate-in fade-in slide-in-from-top-1 absolute top-9.5 right-0 z-50 w-40 rounded-xl border border-zinc-800/80 bg-zinc-950/95 p-1.5 shadow-xl backdrop-blur-md">
              <Button
                variant="ghost"
                className="flex h-7 w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              >
                <HugeiconsIcon icon={Upload01Icon} size={14} />
                <span>Import</span>
              </Button>
              <Button
                variant="ghost"
                className="flex h-7 w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
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

"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  RiSearchLine, 
  RiAddLine, 
  RiMore2Fill, 
  RiDownloadLine, 
  RiUploadLine, 
  RiLayoutGridLine, 
  RiMenuLine 
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function BookmarksResponsiveToolbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dropdown ko bahar click karne par close karne ka logic
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
    <div className="flex w-full items-center justify-between gap-4 font-mono text-zinc-300">
      
      {/* Left side: Search and Add */}
      <div className="flex flex-1 items-center gap-2">
        {/* Search Bar */}
        <div className="relative group flex-1 max-w-50 md:max-w-60">
          <RiSearchLine 
            size={13} 
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border border-zinc-900 bg-zinc-950/40 py-1.5 pl-8 pr-3 text-xs text-zinc-300 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500/30 focus:bg-zinc-950/80 focus:ring-1 focus:ring-violet-500/20"
          />
        </div>

        {/* Add Button */}
        <Button
          title="Add Bookmark"
          variant="outline"
          className="bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-900/80 hover:text-white hover:border-zinc-700 text-[11px] font-medium cursor-pointer shrink-0 h-8 gap-1.5 px-3 transition-all active:scale-95"
        >
          <RiAddLine size={14} className="text-violet-400" />
          <span className="hidden sm:inline">Add Bookmark</span>
        </Button>
      </div>

      {/* Right side: Actions / More menu */}
      <div className="flex items-center gap-2">
        {/* Desktop Controls (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Import */}
          <Button
            variant="outline"
            className="border-zinc-900 bg-zinc-950/40 px-3 text-[11px] text-zinc-400 hover:text-zinc-200 hover:border-zinc-800 transition-colors cursor-pointer h-8 gap-1.5"
          >
            <RiUploadLine size={13} className="text-zinc-500" />
            <span>Import</span>
          </Button>

          {/* Export */}
          <Button
            variant="outline"
            className="border-zinc-900 bg-zinc-950/40 px-3 text-[11px] text-zinc-400 hover:text-zinc-200 hover:border-zinc-800 transition-colors cursor-pointer h-8 gap-1.5"
          >
            <RiDownloadLine size={13} className="text-zinc-500" />
            <span>Export</span>
          </Button>

          {/* Separator */}
          <div className="h-4 w-px bg-zinc-850 mx-1" />

          {/* Layout Switcher */}
          <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950/40 p-0.5">
            <Button
              onClick={() => setViewType("grid")}
              variant={viewType === "grid" ? "outline" : "ghost"}
              size="icon-xs"
              className={cn(
                "flex h-6.5 w-6.5 items-center justify-center rounded-md text-zinc-500 transition-all cursor-pointer",
                viewType === "grid" ? "bg-zinc-900 text-violet-300 border border-zinc-800/50" : "hover:text-zinc-300"
              )}
            >
              <RiLayoutGridLine size={13} />
            </Button>
            <Button
              onClick={() => setViewType("list")}
              variant={viewType === "list" ? "outline" : "ghost"}
              size="icon-xs"
              className={cn(
                "flex h-6.5 w-6.5 items-center justify-center rounded-md text-zinc-500 transition-all cursor-pointer",
                viewType === "list" ? "bg-zinc-900 text-violet-300 border border-zinc-800/50" : "hover:text-zinc-300"
              )}
            >
              <RiMenuLine size={13} />
            </Button>
          </div>
        </div>

        {/* Mobile More Options Dropdown */}
        <div className="relative md:hidden flex items-center" ref={menuRef}>
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="More Options"
            variant="outline"
            size="icon"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer",
              isMenuOpen 
                ? "border-zinc-700 bg-zinc-900 text-violet-400" 
                : "border-zinc-900 bg-zinc-950/40 text-zinc-500 hover:text-zinc-300"
            )}
          >
            <RiMore2Fill size={14} />
          </Button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-9.5 z-50 w-44 rounded-xl border border-zinc-800/80 bg-zinc-950/95 p-1.5 shadow-xl shadow-black/80 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Dropdown Section: Layout */}
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-zinc-900 mb-1">
                <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider">Layout</span>
                <div className="flex border border-zinc-900 rounded-md p-0.5 bg-black">
                  <Button 
                    onClick={() => { setViewType("grid"); setIsMenuOpen(false); }}
                    variant={viewType === "grid" ? "outline" : "ghost"}
                    size="xs"
                    className={cn("px-2 py-0.5 rounded text-[9px] font-medium transition-colors h-auto", viewType === "grid" ? "bg-zinc-900 text-violet-300" : "text-zinc-650 hover:text-violet-400")}
                  >
                    Grid
                  </Button>
                  <Button 
                    onClick={() => { setViewType("list"); setIsMenuOpen(false); }}
                    variant={viewType === "list" ? "outline" : "ghost"}
                    size="xs"
                    className={cn("px-2 py-0.5 rounded text-[9px] font-medium transition-colors h-auto", viewType === "list" ? "bg-zinc-900 text-violet-300" : "text-zinc-650 hover:text-violet-400")}
                  >
                    Row
                  </Button>
                </div>
              </div>

              {/* Import */}
              <Button 
                onClick={() => setIsMenuOpen(false)}
                variant="ghost"
                className="flex w-full items-center justify-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 transition-colors cursor-pointer h-auto"
              >
                <RiUploadLine size={14} className="text-zinc-500" />
                <span>Import Data</span>
              </Button>

              {/* Export */}
              <Button 
                onClick={() => setIsMenuOpen(false)}
                variant="ghost"
                className="flex w-full items-center justify-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 transition-colors cursor-pointer h-auto"
              >
                <RiDownloadLine size={14} className="text-zinc-500" />
                <span>Export Data</span>
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
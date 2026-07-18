"use client";

import React, { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Search01Icon, 
  PlusSignIcon, 
  MoreHorizontalIcon, 
  Download01Icon, 
  Upload01Icon, 
  LayoutGridIcon, 
  Menu01Icon 
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function BookmarksResponsiveToolbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div className="flex w-full items-center justify-between gap-3 font-sans text-zinc-300">
      
      {/* Left side: Search and Add */}
      <div className="flex flex-1 items-center gap-2">
        {/* Search Bar */}
        <div className="relative group flex-1 max-w-[200px] md:max-w-[240px]">
          <HugeiconsIcon 
            icon={Search01Icon}
            size={14} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors duration-200" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full h-8 rounded-lg border border-zinc-900 bg-zinc-950/40 pl-9 pr-3 text-xs text-zinc-200 outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-zinc-800 focus:bg-zinc-950/80 focus:ring-1 focus:ring-zinc-800"
          />
        </div>

        {/* Add Button - Shadcn standard with subtle click effect */}
        <Button
          title="Add Bookmark"
          variant="outline"
          size="sm"
          className="h-8 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 text-xs font-medium cursor-pointer shrink-0 gap-1.5 px-3 transition-colors duration-150 active:bg-zinc-850"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} className="text-zinc-400 group-hover:text-white" />
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
            size="sm"
            className="h-8 border-zinc-900 bg-zinc-950/40 px-3 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-800 hover:bg-zinc-900/30 transition-colors duration-150 cursor-pointer gap-1.5"
          >
            <HugeiconsIcon icon={Upload01Icon} size={13} className="text-zinc-500" />
            <span>Import</span>
          </Button>

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-zinc-900 bg-zinc-950/40 px-3 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-800 hover:bg-zinc-900/30 transition-colors duration-150 cursor-pointer gap-1.5"
          >
            <HugeiconsIcon icon={Download01Icon} size={13} className="text-zinc-500" />
            <span>Export</span>
          </Button>

          {/* Minimalist Separator */}
          <div className="h-3 w-px bg-zinc-800 mx-1" />

          {/* Layout Switcher Container */}
          <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950/40 p-0.5">
            <Button
              onClick={() => setViewType("grid")}
              variant="ghost"
              className={cn(
                "flex h-7 w-7 items-center justify-center p-0 rounded-md text-zinc-500 transition-colors duration-150 cursor-pointer",
                viewType === "grid" ? "bg-zinc-900 text-zinc-200 border border-zinc-800/60" : "hover:text-zinc-300 hover:bg-transparent"
              )}
            >
              <HugeiconsIcon icon={LayoutGridIcon} size={14} />
            </Button>
            <Button
              onClick={() => setViewType("list")}
              variant="ghost"
              className={cn(
                "flex h-7 w-7 items-center justify-center p-0 rounded-md text-zinc-500 transition-colors duration-150 cursor-pointer",
                viewType === "list" ? "bg-zinc-900 text-zinc-200 border border-zinc-800/60" : "hover:text-zinc-300 hover:bg-transparent"
              )}
            >
              <HugeiconsIcon icon={Menu01Icon} size={14} />
            </Button>
          </div>
        </div>

        {/* Mobile More Options Dropdown */}
        <div className="relative md:hidden flex items-center" ref={menuRef}>
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="More Options"
            variant="outline"
            className={cn(
              "flex h-8 w-8 p-0 items-center justify-center rounded-lg border transition-colors duration-150 cursor-pointer",
              isMenuOpen 
                ? "border-zinc-700 bg-zinc-900 text-zinc-200" 
                : "border-zinc-900 bg-zinc-950/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20"
            )}
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
          </Button>

          {/* Premium Dropdown Menu Container */}
          {isMenuOpen && (
            <div className="absolute right-0 top-9.5 z-50 w-44 rounded-xl border border-zinc-800/80 bg-zinc-950/95 p-1.5 shadow-xl shadow-black/80 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-100">
              
              {/* Dropdown Section: Layout switcher inside menu */}
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-zinc-900/80 mb-1">
                <span className="text-[10px] font-medium text-zinc-500 tracking-wider">Layout</span>
                <div className="flex border border-zinc-900 rounded-md p-0.5 bg-zinc-950">
                  <Button 
                    onClick={() => { setViewType("grid"); setIsMenuOpen(false); }}
                    variant="ghost"
                    className={cn(
                      "px-2 py-0.5 h-5 rounded text-[10px] font-medium transition-colors", 
                      viewType === "grid" ? "bg-zinc-900 text-zinc-200" : "text-zinc-500 hover:text-zinc-300 hover:bg-transparent"
                    )}
                  >
                    Grid
                  </Button>
                  <Button 
                    onClick={() => { setViewType("list"); setIsMenuOpen(false); }}
                    variant="ghost"
                    className={cn(
                      "px-2 py-0.5 h-5 rounded text-[10px] font-medium transition-colors", 
                      viewType === "list" ? "bg-zinc-900 text-zinc-200" : "text-zinc-500 hover:text-zinc-300 hover:bg-transparent"
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
                className="flex w-full items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 transition-colors cursor-pointer h-7"
              >
                <HugeiconsIcon icon={Upload01Icon} size={14} className="text-zinc-500" />
                <span>Import Data</span>
              </Button>

              {/* Export Action */}
              <Button 
                onClick={() => setIsMenuOpen(false)}
                variant="ghost"
                className="flex w-full items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 transition-colors cursor-pointer h-7"
              >
                <HugeiconsIcon icon={Download01Icon} size={14} className="text-zinc-500" />
                <span>Export Data</span>
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
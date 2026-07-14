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
    <div className="flex items-center gap-2 font-mono text-zinc-300">
      
      {/* ========================================================= */}
      {/* 1. SEARCH BAR (Visible Everywhere - Responsive Width)   */}
      {/* ========================================================= */}
      <div className="relative group">
        <RiSearchLine 
          size={13} 
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-36 md:w-48 rounded-lg border border-zinc-900 bg-zinc-950/40 py-1.5 pl-8 pr-3 text-xs text-zinc-300 outline-none transition-all placeholder:text-zinc-700 focus:w-44 md:focus:w-60 focus:border-zinc-800 focus:bg-zinc-950"
        />
      </div>

      {/* ========================================================= */}
      {/* 2. ADD BUTTON (Visible Everywhere)                       */}
      {/* ========================================================= */}
      <button
        title="Add Bookmark"
        className="flex h-8 items-center gap-1 rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 text-[11px] font-medium text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <RiAddLine size={14} className="text-violet-400" />
        <span className="hidden sm:inline">Add</span>
      </button>

      {/* ========================================================= */}
      {/* 3. DESKTOP ONLY CONTROLS (Hidden on Mobile md:flex)      */}
      {/* ========================================================= */}
      <div className="hidden md:flex items-center gap-2">
        {/* Separator */}
        <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

        {/* Import */}
        <button className="flex h-8 items-center gap-1 rounded-lg border border-zinc-900 bg-zinc-950/40 px-2.5 text-[11px] hover:text-zinc-100 hover:border-zinc-800 transition-colors cursor-pointer">
          <RiUploadLine size={13} className="text-zinc-500" />
          <span>Import</span>
        </button>

        {/* Export */}
        <button className="flex h-8 items-center gap-1 rounded-lg border border-zinc-900 bg-zinc-950/40 px-2.5 text-[11px] hover:text-zinc-100 hover:border-zinc-800 transition-colors cursor-pointer">
          <RiDownloadLine size={13} className="text-zinc-500" />
          <span>Export</span>
        </button>

        {/* Layout Switcher */}
        <div className="flex items-center rounded-lg border border-zinc-900 bg-zinc-950/40 p-0.5 ml-1">
          <button
            onClick={() => setViewType("grid")}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-all cursor-pointer",
              viewType === "grid" ? "bg-zinc-900 text-violet-300" : "hover:text-zinc-200"
            )}
          >
            <RiLayoutGridLine size={13} />
          </button>
          <button
            onClick={() => setViewType("list")}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-all cursor-pointer",
              viewType === "list" ? "bg-zinc-900 text-violet-300" : "hover:text-zinc-200"
            )}
          >
            <RiMenuLine size={13} />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MOBILE ONLY: MORE OPTIONS MENU (Hidden on Desktop)    */}
      {/* ========================================================= */}
      <div className="relative md:hidden flex items-center" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          title="More Options"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer",
            isMenuOpen 
              ? "border-zinc-700 bg-zinc-900 text-violet-400" 
              : "border-zinc-900 bg-zinc-950/40 text-zinc-500 hover:text-zinc-300"
          )}
        >
          <RiMore2Fill size={14} />
        </button>

        {/* Responsive Mobile Dropdown */}
        {isMenuOpen && (
          <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-xl shadow-black/80 animate-in fade-in slide-in-from-top-2 duration-150">
            
            {/* Dropdown Section: Layout Switcher */}
            <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-zinc-900 mb-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Layout</span>
              <div className="flex border border-zinc-800 rounded-md p-0.5 bg-black">
                <button 
                  onClick={() => { setViewType("grid"); setIsMenuOpen(false); }}
                  className={cn("px-2 py-0.5 rounded text-[10px]", viewType === "grid" ? "bg-zinc-900 text-violet-300" : "text-zinc-500")}
                >
                  Grid
                </button>
                <button 
                  onClick={() => { setViewType("list"); setIsMenuOpen(false); }}
                  className={cn("px-2 py-0.5 rounded text-[10px]", viewType === "list" ? "bg-zinc-900 text-violet-300" : "text-zinc-500")}
                >
                  Row
                </button>
              </div>
            </div>

            {/* Dropdown Action: Import */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <RiUploadLine size={14} className="text-zinc-600" />
              <span>Import Data</span>
            </button>

            {/* Dropdown Action: Export */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <RiDownloadLine size={14} className="text-zinc-600" />
              <span>Export Data</span>
            </button>

          </div>
        )}
      </div>

    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Download,
  Upload,
  Pencil,
  Search,
  LayoutGrid,
  List,
  ArrowDownUp,
} from "lucide-react";
import { motion } from "framer-motion";
import AddBookmarkDialog from "./AddBookmarkDialog";
import { OverflowMenu } from "./OverflowMenu";
import type { OverflowMenuItem } from "./OverflowMenu";
import EditAllDialog from "./EditAllDialog";
import ImportDialog from "./ImportDialog";
import ExportDialog from "./ExportDialog";
import { cn } from "@/src/lib/classname-merge";

interface PageHeaderProps {
  title?: string;
  totalBookmarks?: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: "newest" | "oldest" | "alphabetical";
  setSortBy: (sort: "newest" | "oldest" | "alphabetical") => void;
}

export default function PageHeader({
  title = "Bookmarks",
  totalBookmarks = 0,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
}: PageHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditAllDialogOpen, setIsEditAllDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const secondaryActions: OverflowMenuItem[] = [
    {
      label: "Edit All",
      icon: <Pencil className="h-3.5 w-3.5" />,
      onClick: () => setIsEditAllDialogOpen(true),
    },
    {
      label: "Import",
      icon: <Upload className="h-3.5 w-3.5" />,
      onClick: () => setIsImportDialogOpen(true),
    },
    {
      label: "Export",
      icon: <Download className="h-3.5 w-3.5" />,
      onClick: () => setIsExportDialogOpen(true),
    },
  ];

  useEffect(() => {
    const scrollParent =
      headerRef.current?.closest("[data-scroll-container]") ??
      headerRef.current?.closest("main") ??
      window;

    const handleScroll = () => {
      const scrollTop =
        scrollParent === window
          ? window.scrollY
          : (scrollParent as Element).scrollTop;
      setIsScrolled(scrollTop > 10);
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        ref={headerRef}
        className={cn(
          "sticky top-0 z-30 w-full transition-all duration-300",
          isScrolled
            ? "border-b border-white/5 bg-[#09090b]/80 shadow-2xl shadow-black/20 backdrop-blur-xl"
            : "border-b border-transparent bg-[#09090b]",
        )}
        style={{ isolation: "isolate" }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between lg:px-8">
          {/* Left Side: Title & Mobile Add Button */}
          <div className="flex w-full items-center justify-between md:w-auto">
            <div className="flex shrink-0 items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                {title}
              </h1>
              <span className="flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-semibold text-zinc-400 shadow-sm">
                {totalBookmarks}
              </span>
            </div>

            {/* Mobile-only Add Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDialogOpen(true)}
              className="flex shrink-0 items-center justify-center rounded-lg bg-white p-1.5 text-black shadow-sm md:hidden"
            >
              <Plus className="size-4" />
            </motion.button>
          </div>

          {/* Right Side: Toolbar (Search, View, Sort, Overflow, Desktop Add) */}
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:flex-nowrap">
            {/* Search */}
            <div className="group relative flex-1 md:w-56 lg:w-64">
              <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-zinc-300" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/5 bg-white/5 py-1.5 pr-3 pl-8 text-xs font-medium text-zinc-200 placeholder-zinc-500 shadow-sm transition-all focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>

            {/* View Toggle */}
            <div className="flex shrink-0 items-center rounded-lg border border-white/5 bg-white/5 p-0.5 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-md p-1 transition-all duration-200",
                  viewMode === "grid"
                    ? "bg-white/10 text-white shadow"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300",
                )}
                aria-label="Grid View"
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-md p-1 transition-all duration-200",
                  viewMode === "list"
                    ? "bg-white/10 text-white shadow"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300",
                )}
                aria-label="List View"
              >
                <List className="size-3.5" />
              </button>
            </div>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-22.5 cursor-pointer appearance-none rounded-lg border border-white/5 bg-white/5 py-1.5 pr-7 pl-2.5 text-xs font-medium text-zinc-300 shadow-sm transition-all focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:w-[100px]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">A-Z</option>
              </select>
              <ArrowDownUp className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-zinc-500" />
            </div>

            {/* Secondary Actions Menu */}
            <div className="shrink-0">
              <OverflowMenu items={secondaryActions} />
            </div>

            {/* Desktop Divider */}
            <div className="mx-1 hidden h-4 w-px bg-white/10 md:block" />

            {/* Desktop Add Bookmark Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDialogOpen(true)}
              className="group relative hidden shrink-0 cursor-pointer items-center gap-1.5 overflow-hidden rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] md:flex"
            >
              <Plus className="size-3.5 transition-transform group-hover:rotate-90" />
              <span>Add Bookmark</span>
            </motion.button>
          </div>
        </div>
      </div>

      <EditAllDialog
        isDialogOpen={isEditAllDialogOpen}
        onDialogClose={() => setIsEditAllDialogOpen(false)}
      />
      <ImportDialog
        isDialogOpen={isImportDialogOpen}
        onDialogClose={() => setIsImportDialogOpen(false)}
      />
      <ExportDialog
        isDialogOpen={isExportDialogOpen}
        onDialogClose={() => setIsExportDialogOpen(false)}
      />
      <AddBookmarkDialog
        isDialogOpen={isDialogOpen}
        onDialogClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}

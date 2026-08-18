"use client";

import { useBookmarkStore } from "@/store/useBookmarkStore";
import { BookmarkItem } from "./bookmark-card";
import { Filter, Calendar, Pin } from "lucide-react";

interface AdvancedFiltersProps {
  bookmarks: BookmarkItem[];
}

export function AdvancedFilters({ bookmarks }: AdvancedFiltersProps) {
  const {
    selectedTags,
    setSelectedTags,
    dateRange,
    setDateRange,
    filterStatus,
    setFilterStatus,
  } = useBookmarkStore();

  const allTags = Array.from(
    new Set(bookmarks.flatMap((b) => b.tags?.map((t) => t.name) || []))
  ).sort();

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <div className="flex items-center rounded-xl border border-line-2 bg-paper-3 p-1 text-xs">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
            filterStatus === "all"
              ? "bg-paper text-ink shadow-sm"
              : "text-ink-3 hover:text-ink"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus("pinned")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
            filterStatus === "pinned"
              ? "bg-paper text-ink shadow-sm"
              : "text-ink-3 hover:text-ink"
          }`}
        >
          <Pin className="h-3 w-3" />
          Pinned
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center relative">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as any)}
          className="appearance-none rounded-xl border border-line-2 bg-paper-3 pl-8 pr-8 py-2 text-xs text-ink focus:outline-none focus:border-ink transition cursor-pointer"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
        </select>
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-3 pointer-events-none" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-3">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
        </div>
      </div>

      {/* Tags Filter (Pills) */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-ink-3 mr-1" />
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-2.5 py-1 text-[10px] rounded-full border transition cursor-pointer ${
                selectedTags.includes(tag)
                  ? "bg-ink text-paper border-ink"
                  : "bg-paper-2 text-ink-3 border-line-2 hover:border-line-strong hover:text-ink"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

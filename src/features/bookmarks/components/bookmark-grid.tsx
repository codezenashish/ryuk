"use client";

import { BookmarkCard, BookmarkItem } from "./bookmark-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, Plus } from "lucide-react";

interface BookmarkGridProps {
  bookmarks: BookmarkItem[];
  isLoading?: boolean;
  layoutMode?: "grid" | "list";
  onEdit?: (bookmark: BookmarkItem) => void;
  onDelete?: (bookmark: BookmarkItem | string) => void;
  onPin?: (id: string) => void;
  onAddClick?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function BookmarkGrid({
  bookmarks,
  isLoading = false,
  layoutMode = "grid",
  onEdit,
  onDelete,
  onPin,
  onAddClick,
  emptyTitle = "No bookmarks found",
  emptyDescription = "Save your important links and resources here to access them anytime.",
}: BookmarkGridProps) {
  // Skeleton Loading Grid
  if (isLoading) {
    return (
      <div
        className={
          layoutMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "flex flex-col gap-3"
        }
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-2xl border border-line bg-paper-2 p-4 h-44"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl bg-paper-card" />
                  <Skeleton className="h-3 w-20 rounded-md bg-paper-card" />
                </div>
                <Skeleton className="h-6 w-6 rounded-lg bg-paper-card" />
              </div>
              <Skeleton className="h-4 w-3/4 rounded-md bg-paper-card" />
              <Skeleton className="h-3.5 w-full rounded-md bg-paper-card" />
            </div>
            <div className="flex gap-2 pt-3 border-t border-line">
              <Skeleton className="h-3 w-12 rounded-md bg-paper-card" />
              <Skeleton className="h-3 w-12 rounded-md bg-paper-card" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-2 bg-paper-2/50 py-16 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-paper-card border border-line mb-4 shadow-inner">
          <Bookmark className="h-7 w-7 text-ink-3" />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink mb-1">
          {emptyTitle}
        </h3>
        <p className="max-w-md text-xs text-ink-3 mb-6 leading-relaxed">
          {emptyDescription}
        </p>

        {onAddClick && (
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-medium text-paper hover:bg-ink-2 transition shadow-sm active:translate-y-px cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add your first bookmark</span>
          </button>
        )}
      </div>
    );
  }

  // Bookmarks Render
  return (
    <div
      className={
        layoutMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "flex flex-col gap-3"
      }
    >
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          layoutMode={layoutMode}
          onEdit={onEdit}
          onDelete={onDelete}
          onPin={onPin}
        />
      ))}
    </div>
  );
}

export default BookmarkGrid;

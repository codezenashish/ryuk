"use client";

import { useMemo, useState } from "react";
import BookmarkEmptyState from "./bookmark-empty-state";
import BookmarkList from "./bookmark-list";
import BookmarksToolbar from "./bookmark-toolbar";
import type {
  BookmarkItem,
  CategoryWithBookmarks,
} from "../hook/use-bookmark-queries";
import { useDeleteBookmarkMutation } from "../hook/use-bookmark-queries";

interface BookmarkViewProps {
  categories: CategoryWithBookmarks[];
  userId: string;
}

export default function BookmarkView({
  categories,
  userId,
}: BookmarkViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const deleteMutation = useDeleteBookmarkMutation();
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          bookmarks: category.bookmarks.filter((bookmark) =>
            [bookmark.title, bookmark.url, category.name].some(
              (value) =>
                value?.toLowerCase().includes(normalizedQuery) ?? false,
            ),
          ),
        }))
        .filter((category) => category.bookmarks.length > 0),
    [categories, normalizedQuery],
  );

  const handleDelete = (bookmark: BookmarkItem) => {
    if (window.confirm(`Delete “${bookmark.title}”?`)) {
      deleteMutation.mutate({ bookmarkId: bookmark.id, userId });
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <BookmarksToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        viewType={viewType}
        onViewTypeChange={setViewType}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {filteredCategories.length ? (
          <BookmarkList
            categories={filteredCategories}
            viewType={viewType}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        ) : (
          <BookmarkEmptyState
            title="No bookmarks match your search"
            description="Try another keyword or clear the search to see all bookmarks."
            showCta={false}
          />
        )}
      </div>
    </div>
  );
}

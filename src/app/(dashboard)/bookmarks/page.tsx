"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/auth-client";
import BookmarksToolbar from "@/features/bookmarks/components/bookmark-toolbar";
import BookmarkList from "@/features/bookmarks/components/bookmark-list";
import {
  type BookmarkItem,
  useBookmarksQuery,
  useDeleteBookmarkMutation,
} from "@/features/bookmarks/hook/use-bookmark-queries";

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useBookmarksQuery(userId);
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
    if (userId && window.confirm(`Delete “${bookmark.title}”?`)) {
      deleteMutation.mutate({ bookmarkId: bookmark.id, userId });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <BookmarksToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        viewType={viewType}
        onViewTypeChange={setViewType}
      />

      {!userId ? null : isLoading ? (
        <div className="flex justify-center py-16 text-zinc-500">
          <HugeiconsIcon
            icon={Loading03Icon}
            className="animate-spin"
            size={20}
          />
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-sm text-red-400">
          Unable to load bookmarks.
        </p>
      ) : filteredCategories.length ? (
        <BookmarkList
          categories={filteredCategories}
          viewType={viewType}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-800 py-14 text-center text-sm text-zinc-500">
          {normalizedQuery
            ? "No bookmarks match your search."
            : "No bookmarks yet. Add your first link above."}
        </div>
      )}
    </div>
  );
}

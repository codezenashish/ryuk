"use client";

import PageHeader from "@/src/features/bookmarks/components/PageHeader";
import CategoryGridSection from "@/src/features/bookmarks/components/BookmarkCategoryGrid";
import { useBookmarksQuery } from "@/src/features/bookmarks/hooks/use-bookmark-queries";

const MOCK_USER_ID = "mock-user-id-123";

export default function BookmarksPage() {
  const { data: categories, isLoading } = useBookmarksQuery(MOCK_USER_ID);

  return (
    <>
      <PageHeader title="Bookmarks" />
      <div className="flex flex-col gap-8 px-4 pb-12">
        {isLoading && (
          <div className="mt-16 flex flex-col items-center gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="w-full max-w-7xl animate-pulse">
                <div className="mb-4 h-4 w-32 rounded bg-zinc-800" />
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-20 rounded-xl border border-white/[0.04] bg-white/[0.01]"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {categories?.map((category) => (
          <CategoryGridSection
            key={category.id}
            id={category.id}
            initialName={category.name}
            initialIcon={category.icon}
            bookmarks={category.bookmarks.map((b) => ({
              id: b.id,
              title: b.title,
              url: b.url ?? "",
              favicon: b.favicon,
            }))}
          />
        ))}

        {!isLoading && (!categories || categories.length === 0) && (
          <p className="mt-16 text-center font-mono text-xs text-zinc-600">
            No bookmarks yet — add your first one above ↑
          </p>
        )}
      </div>
    </>
  );
}

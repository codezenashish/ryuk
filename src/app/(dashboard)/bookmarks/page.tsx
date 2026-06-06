"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import PageHeader from "@/src/features/bookmarks/components/PageHeader";
import CategoryGridSection from "@/src/features/bookmarks/components/BookmarkCategoryGrid";
import { useBookmarksQuery } from "@/src/features/bookmarks/hooks/use-bookmark-queries";

const MOCK_USER_ID = "mock-user-id-123";

export default function BookmarksPage() {
  const { data: categories, isLoading } = useBookmarksQuery(MOCK_USER_ID);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">("newest");

  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    return categories.map(cat => {
      let filteredBookmarks = cat.bookmarks.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (b.url && b.url.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      filteredBookmarks.sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
        return 0;
      });

      return {
        ...cat,
        bookmarks: filteredBookmarks
      };
    }).filter(cat => cat.bookmarks.length > 0);
  }, [categories, searchQuery, sortBy]);

  const totalBookmarks = filteredCategories.reduce((acc, cat) => acc + cat.bookmarks.length, 0);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader 
        title="Bookmarks" 
        totalBookmarks={totalBookmarks}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 md:px-8 pb-20 pt-4">
        {isLoading && (
          <div className="flex flex-col gap-12">
            {[1, 2].map((i) => (
              <div key={i} className="w-full animate-pulse">
                <div className="mb-6 h-5 w-32 rounded bg-white/5" />
                <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "flex flex-col gap-3"}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div
                      key={j}
                      className={`rounded-2xl border border-white/[0.03] bg-white/[0.02] ${viewMode === "grid" ? "h-[140px]" : "h-[72px]"}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredCategories.map((category) => (
          <CategoryGridSection
            key={category.id}
            id={category.id}
            initialName={category.name}
            initialIcon={category.icon}
            bookmarks={category.bookmarks as any}
            viewMode={viewMode}
          />
        ))}

        {!isLoading && totalBookmarks === 0 && (
          <div className="mt-24 flex flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <Search className="h-6 w-6 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-200">No bookmarks found</h3>
            <p className="mt-2 text-sm text-zinc-500 max-w-sm leading-relaxed">
              {searchQuery 
                ? `We couldn't find anything matching "${searchQuery}". Try a different term or clear your search.`
                : "Your space is currently empty. Start adding bookmarks to see them organized here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

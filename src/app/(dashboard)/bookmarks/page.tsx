"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useBookmarksRealtime } from "@/hooks/use-bookmarks-realtime";
import { useCategoriesQuery } from "@/features/bookmarks/hooks/use-bookmark-queries";
import { BookmarkGrid } from "@/features/bookmarks/components/bookmark-grid";
import { CategoryFilter } from "@/features/bookmarks/components/category-filter";
import { AdvancedFilters } from "@/features/bookmarks/components/advanced-filters";
import { AddBookmarkModal } from "@/features/bookmarks/dialogs/add-bookmark-modal";
import { ImportBookmarksModal } from "@/features/bookmarks/dialogs/import-bookmarks-modal";
import { BookmarkItem } from "@/features/bookmarks/components/bookmark-card";
import { useSearchStore } from "@/store/useSearchStore";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, LayoutGrid, List, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // 1. Activate Realtime Subscription for instantaneous PC ↔ Mobile sync
  useBookmarksRealtime(userId);

  // 2. Fetch & Mutate Bookmarks with 0ms perceived latency (Optimistic UI)
  const {
    bookmarks: queryBookmarks,
    isLoading: isLoadingBookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  } = useBookmarks(userId);

  const { data: queryCategories } = useCategoriesQuery();

  const {
    categories: storeCategories,
    selectedCategoryId,
    layoutMode,
    isAddModalOpen,
    editingBookmark,
    selectedTags,
    dateRange,
    filterStatus,
    setSelectedCategory,
    setLayoutMode,
    openAddModal,
    closeAddModal,
  } = useBookmarkStore();

  const { query } = useSearchStore();
  const debouncedSearch = useDebounce(query, 300);

  const bookmarks = queryBookmarks;
  const categories = queryCategories || storeCategories;

  // Filter Bookmarks by search query and category
  const filteredBookmarks = useMemo(() => {
    const filtered = bookmarks.filter((b) => {
      const matchesCategory = selectedCategoryId
        ? b.category?.id === selectedCategoryId
        : true;
      
      const queryLower = debouncedSearch.toLowerCase();
      const matchesSearch = queryLower
        ? b.title.toLowerCase().includes(queryLower) ||
          b.url.toLowerCase().includes(queryLower) ||
          b.description?.toLowerCase().includes(queryLower)
        : true;

      const matchesStatus = filterStatus === "pinned" ? b.isPinned : true;

      const matchesTags = selectedTags.length > 0 
        ? selectedTags.some(tag => b.tags?.map(t => t.name).includes(tag))
        : true;

      let matchesDate = true;
      if (dateRange !== "all" && b.createdAt) {
        const createdDate = new Date(b.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        
        if (dateRange === "today") {
          matchesDate = diffDays <= 1;
        } else if (dateRange === "week") {
          matchesDate = diffDays <= 7;
        } else if (dateRange === "month") {
          matchesDate = diffDays <= 30;
        }
      }

      return matchesCategory && matchesSearch && matchesStatus && matchesTags && matchesDate;
    });

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [bookmarks, selectedCategoryId, debouncedSearch, selectedTags, dateRange, filterStatus]);

  const handleSaveBookmark = (data: {
    title: string;
    url: string;
    description?: string;
    categoryId?: string;
    categoryName?: string;
    tags: string[];
    favicon?: string;
  }) => {
    if (editingBookmark) {
      updateBookmark({
        id: editingBookmark.id,
        input: {
          title: data.title,
          url: data.url,
          description: data.description,
          categoryId: data.categoryId,
          favicon: data.favicon,
        },
      });
    } else {
      addBookmark({
        title: data.title,
        url: data.url,
        description: data.description,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        favicon: data.favicon,
      });
    }
    closeAddModal();
  };

  const handlePinBookmark = (id: string) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (bookmark) {
      updateBookmark({ id, input: { isPinned: !bookmark.isPinned } });
    }
  };

  const handleDeleteBookmark = (target: string | BookmarkItem) => {
    const id = typeof target === "string" ? target : target.id;
    deleteBookmark(id);
  };

  if (isLoadingBookmarks && bookmarks.length === 0) {
    return (
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48 bg-paper-3 rounded-lg" />
          <Skeleton className="h-9 w-32 bg-paper-3 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full bg-paper-3 rounded-xl" />
          <Skeleton className="h-40 w-full bg-paper-3 rounded-xl" />
          <Skeleton className="h-40 w-full bg-paper-3 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Modal */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={handleSaveBookmark}
        categories={categories}
        initialData={editingBookmark}
      />
      <ImportBookmarksModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          setIsImportModalOpen(false);
          // Allow realtime to sync or just reload to be safe
          window.location.reload();
        }}
      />

      {/* Top Bar: Category Filter on left, View Toggle & Add Button on right */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategory}
          bookmarks={bookmarks}
        />

        <div className="flex items-center gap-3 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-line-2 bg-paper-3 p-1 gap-1">
            <button
              onClick={() => setLayoutMode("grid")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === "grid"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink-3 hover:text-ink"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayoutMode("list")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === "list"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink-3 hover:text-ink"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Add Bookmark Trigger */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-paper-3 px-4 py-2 text-xs font-medium text-ink hover:bg-line-2 transition shadow-sm cursor-pointer active:translate-y-px border border-line-2"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          
          <button
            type="button"
            onClick={() => openAddModal(null)}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-medium text-paper hover:bg-ink-2 transition shadow-sm cursor-pointer active:translate-y-px"
          >
            <Plus className="h-4 w-4" />
            <span>Add Bookmark</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="mt-2 mb-4">
        <AdvancedFilters bookmarks={bookmarks} />
      </div>

      {/* Bookmark Grid / List */}
      <BookmarkGrid
        bookmarks={filteredBookmarks}
        layoutMode={layoutMode}
        onEdit={(bm) => openAddModal(bm)}
        onDelete={handleDeleteBookmark}
        onPin={handlePinBookmark}
        onAddClick={() => openAddModal(null)}
      />
    </div>
  );
}

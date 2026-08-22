"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useBookmarksRealtime } from "@/hooks/use-bookmarks-realtime";
import { useCategoriesQuery, useDeleteCategoryMutation } from "@/features/bookmarks/hooks/use-bookmark-queries";
import { BookmarkGrid } from "@/features/bookmarks/components/bookmark-grid";
import { CategoryFilter } from "@/features/bookmarks/components/category-filter";
import { AdvancedFilters } from "@/features/bookmarks/components/advanced-filters";
import { AddBookmarkModal } from "@/features/bookmarks/dialogs/add-bookmark-modal";
import { ImportBookmarksModal } from "@/features/bookmarks/dialogs/import-bookmarks-modal";
import { BookmarkItem, BookmarkCategory } from "@/features/bookmarks/components/bookmark-card";
import { ShareCategoryDialog } from "@/features/bookmarks/dialogs/share-category-dialog";
import { BulkActionBar } from "@/features/bookmarks/components/bulk-action-bar";
import { gooeyToast as toast } from "@/components/ui/goey-toaster";
import { useSearchStore } from "@/store/useSearchStore";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, LayoutGrid, List, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const deleteCategoryMutation = useDeleteCategoryMutation(user?.id);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetCategory, setShareTargetCategory] = useState<BookmarkCategory | null>(null);

  // 1. Activate Realtime Subscription for instantaneous PC ↔ Mobile sync
  useBookmarksRealtime(userId);

  // 2. Fetch & Mutate Bookmarks with 0ms perceived latency (Optimistic UI)
  const {
    bookmarks,
    isLoading: isLoadingBookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    bulkDeleteBookmarks,
    bulkUpdateBookmarks,
  } = useBookmarks(userId);

  const { data: queryCategories } = useCategoriesQuery();

  const {
    categories: storeCategories,
    selectedCategoryId,
    layoutMode,
    isAddModalOpen,
    editingBookmark,
    isImportModalOpen,
    selectedTags,
    dateRange,
    filterStatus,
    selectedBookmarkIds,
    toggleSelection,
    clearSelection,
    setSelectedCategory,
    setLayoutMode,
    openAddModal,
    closeAddModal,
    openImportModal,
    closeImportModal,
  } = useBookmarkStore();

  const { query } = useSearchStore();
  const debouncedSearch = useDebounce(query, 300);
  const fetchedCategories = queryCategories || storeCategories;

  // Only show categories that have at least one bookmark
  const categories = useMemo(() => {
    return fetchedCategories.filter((cat) => 
      bookmarks.some((b) => b.category?.id === cat.id || b.categoryId === cat.id)
    );
  }, [fetchedCategories, bookmarks]);

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

  const handleInlineEdit = (id: string, newTitle: string) => {
    updateBookmark({ id, input: { title: newTitle } });
  };

  const handleDeleteBookmark = (target: string | BookmarkItem) => {
    const id = typeof target === "string" ? target : target.id;
    deleteBookmark(id);
  };

  const handleBulkDelete = () => {
    bulkDeleteBookmarks(selectedBookmarkIds);
    clearSelection();
  };

  const handleBulkMove = (categoryId: string | null) => {
    bulkUpdateBookmarks({ ids: selectedBookmarkIds, input: { categoryId } });
    clearSelection();
  };

  const selectedCategoryObj = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  if (isLoadingBookmarks && bookmarks.length === 0) {
    return (
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48 bg-muted rounded-lg" />
          <Skeleton className="h-9 w-32 bg-muted rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full bg-muted rounded-xl" />
          <Skeleton className="h-40 w-full bg-muted rounded-xl" />
          <Skeleton className="h-40 w-full bg-muted rounded-xl" />
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
        onClose={closeImportModal}
        onSuccess={() => {
          closeImportModal();
          // Allow realtime to sync or just reload to be safe
          window.location.reload();
        }}
      />
      {(shareTargetCategory || selectedCategoryObj) && (
        <ShareCategoryDialog
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setShareTargetCategory(null);
          }}
          category={(shareTargetCategory || selectedCategoryObj)!}
          onShareUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
          }}
        />
      )}

      {/* Top Bar: Category Filter on left, View Toggle & Add Button on right */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategory}
          bookmarks={bookmarks}
          onShareClick={(category) => {
            setShareTargetCategory(category);
            setIsShareModalOpen(true);
          }}
          onDeleteClick={(category) => {
            toast.error("Delete this category?", {
              description: "All bookmarks in it will also be deleted.",
              action: {
                label: "Delete",
                onClick: () => {
                  deleteCategoryMutation.mutate(category.id, {
                    onSuccess: () => {
                      if (selectedCategoryId === category.id) setSelectedCategory(null);
                    }
                  });
                },
              },
            });
          }}
        />

        <div className="flex items-center gap-3 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-border bg-muted p-1 gap-1">
            <button
              onClick={() => setLayoutMode("grid")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayoutMode("list")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Share Category Trigger */}
          {selectedCategoryObj && (
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-xs font-medium text-foreground hover:bg-border transition shadow-sm cursor-pointer border border-border"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {/* Add Bookmark Trigger */}
          <button
            type="button"
            onClick={openImportModal}
            className="inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-xs font-medium text-foreground hover:bg-border transition shadow-sm cursor-pointer active:translate-y-px border border-border"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          
          <button
            type="button"
            onClick={() => openAddModal(null)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/80 transition shadow-sm cursor-pointer active:translate-y-px"
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
        selectedBookmarkIds={selectedBookmarkIds}
        onToggleSelect={toggleSelection}
        onEdit={(bm) => openAddModal(bm)}
        onInlineEdit={handleInlineEdit}
        onDelete={handleDeleteBookmark}
        onPin={handlePinBookmark}
        onAddClick={() => openAddModal(null)}
      />

      <BulkActionBar
        selectedCount={selectedBookmarkIds.length}
        categories={categories}
        onClear={clearSelection}
        onDelete={handleBulkDelete}
        onMoveToCategory={handleBulkMove}
      />
    </div>
  );
}

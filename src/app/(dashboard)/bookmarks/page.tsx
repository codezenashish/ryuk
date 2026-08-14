"use client";

import { useEffect, useMemo } from "react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import {
  useBookmarksQuery,
  useCategoriesQuery,
  useCreateBookmarkMutation,
  useUpdateBookmarkMutation,
  useDeleteBookmarkMutation,
} from "@/features/bookmarks/hooks/use-bookmark-queries";
import { BookmarkGrid } from "@/features/bookmarks/components/bookmark-grid";
import { CategoryFilter } from "@/features/bookmarks/components/category-filter";
import { AddBookmarkModal } from "@/features/bookmarks/dialogs/add-bookmark-modal";
import { BookmarkItem } from "@/features/bookmarks/components/bookmark-card";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksPage() {
  const { data: queryBookmarks, isLoading: isLoadingBookmarks } = useBookmarksQuery();
  const { data: queryCategories } = useCategoriesQuery();

  const createBookmarkMutation = useCreateBookmarkMutation();
  const updateBookmarkMutation = useUpdateBookmarkMutation();
  const deleteBookmarkMutation = useDeleteBookmarkMutation();

  const {
    bookmarks: storeBookmarks,
    categories: storeCategories,
    setBookmarks,
    setCategories,
    selectedCategoryId,
    searchQuery,
    layoutMode,
    isAddModalOpen,
    editingBookmark,
    togglePinBookmark,
    setSelectedCategory,
    setLayoutMode,
    openAddModal,
    closeAddModal,
  } = useBookmarkStore();

  useEffect(() => {
    if (queryBookmarks) {
      setBookmarks(queryBookmarks);
    }
  }, [queryBookmarks, setBookmarks]);

  useEffect(() => {
    if (queryCategories) {
      setCategories(queryCategories);
    }
  }, [queryCategories, setCategories]);

  const bookmarks = queryBookmarks || storeBookmarks;
  const categories = queryCategories || storeCategories;

  // Filter Bookmarks by search query (from nav) and category
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      const matchesCategory = selectedCategoryId
        ? b.category?.id === selectedCategoryId
        : true;
      const matchesSearch = searchQuery
        ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.tags?.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [bookmarks, selectedCategoryId, searchQuery]);

  const handleSaveBookmark = async (data: {
    title: string;
    url: string;
    description?: string;
    categoryId?: string;
    tags: string[];
    favicon?: string;
  }) => {
    if (editingBookmark) {
      await updateBookmarkMutation.mutateAsync({
        id: editingBookmark.id,
        data: {
          title: data.title,
          url: data.url,
          description: data.description,
          categoryId: data.categoryId,
          tags: data.tags,
          favicon: data.favicon,
        },
      });
    } else {
      await createBookmarkMutation.mutateAsync({
        title: data.title,
        url: data.url,
        description: data.description,
        categoryId: data.categoryId,
        tags: data.tags,
        favicon: data.favicon,
      });
    }
    closeAddModal();
  };

  const handleDeleteBookmark = async (target: string | BookmarkItem) => {
    const id = typeof target === "string" ? target : target.id;
    await deleteBookmarkMutation.mutateAsync(id);
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
            onClick={() => openAddModal(null)}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-medium text-paper hover:bg-ink-2 transition shadow-sm cursor-pointer active:translate-y-px"
          >
            <Plus className="h-4 w-4" />
            <span>Add Bookmark</span>
          </button>
        </div>
      </div>

      {/* Bookmark Grid / List */}
      <BookmarkGrid
        bookmarks={filteredBookmarks}
        layoutMode={layoutMode}
        onEdit={(bm) => openAddModal(bm)}
        onDelete={handleDeleteBookmark}
        onPin={togglePinBookmark}
        onAddClick={() => openAddModal(null)}
      />
    </div>
  );
}

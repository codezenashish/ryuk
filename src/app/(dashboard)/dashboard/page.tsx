"use client";

import { useUser } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { BookmarkGrid } from "@/features/bookmarks/components/bookmark-grid";
import { CategoryFilter } from "@/features/bookmarks/components/category-filter";
import { AddBookmarkModal } from "@/features/bookmarks/dialogs/add-bookmark-modal";
import { BookmarkItem } from "@/features/bookmarks/components/bookmark-card";
import { Plus, LayoutGrid, List } from "lucide-react";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const {
    bookmarks,
    categories,
    selectedCategoryId,
    searchQuery,
    layoutMode,
    isAddModalOpen,
    editingBookmark,
    isLoadingDb,
    fetchBookmarksFromDb,
    fetchCategoriesFromDb,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    togglePinBookmark,
    setSelectedCategory,
    setLayoutMode,
    openAddModal,
    closeAddModal,
  } = useBookmarkStore();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      fetchBookmarksFromDb();
      fetchCategoriesFromDb();
    }
  }, [isSignedIn, fetchBookmarksFromDb, fetchCategoriesFromDb]);

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

  const handleSaveBookmark = (data: {
    title: string;
    url: string;
    description?: string;
    categoryId?: string;
    tags: string[];
    favicon?: string;
  }) => {
    const selectedCat = categories.find((c) => c.id === data.categoryId) || null;
    const formattedTags = data.tags.map((t) => ({ id: t, name: t }));

    if (editingBookmark) {
      updateBookmark(editingBookmark.id, {
        title: data.title,
        url: data.url,
        description: data.description,
        category: selectedCat,
        tags: formattedTags,
        favicon: data.favicon,
      });
    } else {
      addBookmark({
        title: data.title,
        url: data.url,
        description: data.description,
        category: selectedCat,
        tags: formattedTags,
        favicon: data.favicon,
        isPinned: false,
      });
    }
  };

  const handleDeleteBookmark = (target: string | BookmarkItem) => {
    const id = typeof target === "string" ? target : target.id;
    deleteBookmark(id);
  };

  // 1. Loading state until Clerk completes initialization
  if (!isLoaded || isLoadingDb) {
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

  // 2. Unauthenticated state safety guard
  if (!isSignedIn) {
    return null;
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

      {/* Header Welcome Bar */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-ink font-body">
          Welcome back, {user?.firstName || user?.fullName || "Developer"} 👋
        </h1>
        <p className="text-xs text-ink-3">
          Manage your saved bookmarks, developer notes, and categories.
        </p>
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategory}
          bookmarks={bookmarks}
        />

        <div className="flex items-center gap-3 shrink-0">
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

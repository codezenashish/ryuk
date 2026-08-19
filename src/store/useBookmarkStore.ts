import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BookmarkItem,
  BookmarkCategory,
} from "@/features/bookmarks/components/bookmark-card";

interface BookmarkStore {
  // Data State
  bookmarks: BookmarkItem[];
  categories: BookmarkCategory[];
  isLoadingDb: boolean;

  // Filter & Layout State
  selectedCategoryId: string | null;
  searchQuery: string;
  selectedTags: string[];
  dateRange: "all" | "today" | "week" | "month";
  filterStatus: "all" | "pinned";
  layoutMode: "grid" | "list";

  // Modal State
  isAddModalOpen: boolean;
  editingBookmark: BookmarkItem | null;

  // Selection State
  selectedBookmarkIds: string[];
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Actions - Sync with DB
  fetchBookmarksFromDb: () => Promise<void>;
  fetchCategoriesFromDb: () => Promise<void>;

  // Actions - Bookmarks CRUD
  setBookmarks: (bookmarks: BookmarkItem[]) => void;
  addBookmark: (bookmark: Omit<BookmarkItem, "id"> & { id?: string }) => Promise<void>;
  updateBookmark: (id: string, updated: Partial<BookmarkItem>) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  togglePinBookmark: (id: string) => void;

  // Actions - Categories CRUD
  setCategories: (categories: BookmarkCategory[]) => void;
  addCategory: (category: Omit<BookmarkCategory, "id"> & { id?: string }) => Promise<void>;
  deleteCategory: (id: string) => void;

  // Actions - UI Controls
  setSelectedCategory: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setDateRange: (range: "all" | "today" | "week" | "month") => void;
  setFilterStatus: (status: "all" | "pinned") => void;
  setLayoutMode: (mode: "grid" | "list") => void;
  openAddModal: (bookmark?: BookmarkItem | null) => void;
  closeAddModal: () => void;
}

const defaultCategories: BookmarkCategory[] = [];
const defaultBookmarks: BookmarkItem[] = [];

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarks: defaultBookmarks,
      categories: defaultCategories,
      isLoadingDb: false,
      selectedCategoryId: null,
      searchQuery: "",
      selectedTags: [],
      dateRange: "all",
      filterStatus: "all",
      layoutMode: "grid",
      isAddModalOpen: false,
      editingBookmark: null,
      selectedBookmarkIds: [],

      // Selection Actions
      toggleSelection: (id) =>
        set((state) => ({
          selectedBookmarkIds: state.selectedBookmarkIds.includes(id)
            ? state.selectedBookmarkIds.filter((selectedId) => selectedId !== id)
            : [...state.selectedBookmarkIds, id],
        })),
      selectAll: (ids) => set({ selectedBookmarkIds: ids }),
      clearSelection: () => set({ selectedBookmarkIds: [] }),

      // Fetch Bookmarks from Prisma Database
      fetchBookmarksFromDb: async () => {
        try {
          set({ isLoadingDb: true });
          const res = await fetch("/api/bookmark");
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.bookmarks)) {
              set({ bookmarks: data.bookmarks });
            }
          }
        } catch (err) {
          console.error("Failed to fetch bookmarks from DB:", err);
        } finally {
          set({ isLoadingDb: false });
        }
      },

      // Fetch Categories from Prisma Database
      fetchCategoriesFromDb: async () => {
        try {
          const res = await fetch("/api/category");
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.categories) && data.categories.length > 0) {
              set({ categories: data.categories });
            }
          }
        } catch (err) {
          console.error("Failed to fetch categories from DB:", err);
        }
      },

      // Bookmarks CRUD
      setBookmarks: (bookmarks) => set({ bookmarks }),

      addBookmark: async (data) => {
        // Optimistic UI update
        const tempId = data.id || `bm-${Date.now()}`;
        const newBookmark: BookmarkItem = {
          ...data,
          id: tempId,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ bookmarks: [newBookmark, ...state.bookmarks] }));

        // Async Database Persist
        try {
          const res = await fetch("/api/bookmark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: data.title,
              url: data.url,
              description: data.description,
              categoryId: data.category?.id,
              categoryName: data.category?.name,
              tags: data.tags?.map((t) => t.name),
              favicon: data.favicon,
            }),
          });

          if (res.ok) {
            const result = await res.json();
            if (result.bookmark) {
              // Replace tempId with actual Prisma CUID from database
              set((state) => ({
                bookmarks: state.bookmarks.map((bm) =>
                  bm.id === tempId ? result.bookmark : bm
                ),
              }));
            }
          }
        } catch (err) {
          console.error("Error saving bookmark to DB:", err);
        }
      },

      updateBookmark: async (id, updated) => {
        // Optimistic UI update
        set((state) => ({
          bookmarks: state.bookmarks.map((bm) =>
            bm.id === id ? { ...bm, ...updated } : bm
          ),
        }));

        // Async Database Update
        try {
          await fetch(`/api/bookmark/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: updated.title,
              url: updated.url,
              description: updated.description,
              categoryId: updated.category?.id,
              tags: updated.tags?.map((t) => t.name),
              favicon: updated.favicon,
            }),
          });
        } catch (err) {
          console.error("Error updating bookmark in DB:", err);
        }
      },

      deleteBookmark: async (id) => {
        // Optimistic UI update
        set((state) => ({
          bookmarks: state.bookmarks.filter((bm) => bm.id !== id),
        }));

        // Async Database Delete
        try {
          await fetch(`/api/bookmark/${id}`, {
            method: "DELETE",
          });
        } catch (err) {
          console.error("Error deleting bookmark from DB:", err);
        }
      },

      togglePinBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((bm) =>
            bm.id === id ? { ...bm, isPinned: !bm.isPinned } : bm
          ),
        })),

      // Categories CRUD
      setCategories: (categories) => set({ categories }),

      addCategory: async (data) => {
        const tempId = data.id || `cat-${Date.now()}`;
        const newCategory: BookmarkCategory = {
          ...data,
          id: tempId,
        };

        set((state) => ({ categories: [...state.categories, newCategory] }));

        try {
          const res = await fetch("/api/category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.name,
              color: data.color,
              icon: data.icon,
            }),
          });

          if (res.ok) {
            const result = await res.json();
            if (result.category) {
              set((state) => ({
                categories: state.categories.map((cat) =>
                  cat.id === tempId ? result.category : cat
                ),
              }));
            }
          }
        } catch (err) {
          console.error("Error saving category to DB:", err);
        }
      },

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
          bookmarks: state.bookmarks.map((bm) =>
            bm.category?.id === id ? { ...bm, category: null } : bm
          ),
          selectedCategoryId:
            state.selectedCategoryId === id ? null : state.selectedCategoryId,
        })),

      // UI Controls
      setSelectedCategory: (selectedCategoryId) => set({ selectedCategoryId }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedTags: (selectedTags) => set({ selectedTags }),
      setDateRange: (dateRange) => set({ dateRange }),
      setFilterStatus: (filterStatus) => set({ filterStatus }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),

      openAddModal: (bookmark = null) =>
        set({ isAddModalOpen: true, editingBookmark: bookmark }),
      closeAddModal: () =>
        set({ isAddModalOpen: false, editingBookmark: null }),
    }),
    {
      name: "ryuk-bookmark-storage-v3",
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        categories: state.categories,
        layoutMode: state.layoutMode,
      }),
    }
  )
);

export default useBookmarkStore;

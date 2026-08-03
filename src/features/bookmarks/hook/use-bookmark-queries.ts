import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBookmarksAction,
  createBookmarkAction,
  deleteBookmarkAction,
} from "../actions/bookmark-action";

export interface BookmarkItem {
  id: number;
  title: string;
  url: string | null;
  favicon: string;
  createdAt: Date;
}

export interface CategoryWithBookmarks {
  id: string;
  name: string;
  icon: string;
  color: string;
  bookmarks: BookmarkItem[];
}

export const BOOKMARKS_KEY = ["bookmarks"] as const;

export function useBookmarksQuery(userId?: string | null) {
  return useQuery<CategoryWithBookmarks[]>({
    queryKey: [...BOOKMARKS_KEY, userId || "me"],
    queryFn: () => fetchBookmarksAction(userId || undefined),
    staleTime: 1000 * 60 * 5, // 5 minutes cache validity
    gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Alias for backwards compatibility / alternative import names
export const useBookmarkQuery = useBookmarksQuery;

interface CreateBookmarkVars {
  url: string;
  title: string;
  favicon: string;
  categoryName: string;
  categoryIcon?: string;
  userId: string;
}

export function useCreateBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: CreateBookmarkVars) => {
      const result = await createBookmarkAction(vars);
      if (!result.success) {
        throw new Error(result.error || "Failed to create bookmark");
      }
      return result;
    },

    onMutate: async (newBookmark) => {
      const queryKey = [...BOOKMARKS_KEY, newBookmark.userId];

      // 1. Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot current cached data for rollback
      const previousData =
        queryClient.getQueryData<CategoryWithBookmarks[]>(queryKey);

      // 3. Optimistically update the cache immediately
      queryClient.setQueryData<CategoryWithBookmarks[]>(queryKey, (old = []) => {
        const categoryName = newBookmark.categoryName.trim() || "General";
        const existingIndex = old.findIndex(
          (category) =>
            category.name.toLowerCase() === categoryName.toLowerCase(),
        );

        const optimisticBookmark: BookmarkItem = {
          id: -Date.now(),
          title: newBookmark.title,
          url: newBookmark.url,
          favicon: newBookmark.favicon,
          createdAt: new Date(),
        };

        if (existingIndex >= 0) {
          const updated = [...old];
          const existingCategory = updated[existingIndex];
          updated[existingIndex] = {
            ...existingCategory,
            bookmarks: [optimisticBookmark, ...existingCategory.bookmarks],
          };
          return updated;
        }

        const optimisticCategory: CategoryWithBookmarks = {
          id: `optimistic-${Date.now()}`,
          name: categoryName,
          icon: newBookmark.categoryIcon || "Folder01Icon",
          color: "#6366F1",
          bookmarks: [optimisticBookmark],
        };
        return [...old, optimisticCategory];
      });

      return { previousData };
    },

    onError: (_error, vars, context) => {
      // Rollback on error using snapshotted previousData
      if (context?.previousData) {
        queryClient.setQueryData(
          [...BOOKMARKS_KEY, vars.userId],
          context.previousData,
        );
      }
    },

    onSuccess: (result, vars) => {
      const queryKey = [...BOOKMARKS_KEY, vars.userId];
      if (result.success && result.bookmark) {
        queryClient.setQueryData<CategoryWithBookmarks[]>(queryKey, (old) => {
          if (!old) return old;
          return old.map((category) => {
            if (
              category.id === result.categoryId ||
              category.name.toLowerCase() ===
                vars.categoryName.trim().toLowerCase()
            ) {
              return {
                ...category,
                id: result.categoryId || category.id,
                bookmarks: category.bookmarks.map((b) =>
                  b.id < 0
                    ? {
                        id: result.bookmark.id,
                        title: result.bookmark.title,
                        url: result.bookmark.url,
                        favicon: result.bookmark.favicon,
                        createdAt: new Date(result.bookmark.createdAt),
                      }
                    : b,
                ),
              };
            }
            return category;
          });
        });
      }
    },

    onSettled: (_data, _error, vars) => {
      // Background refetch to ensure final server synchronization
      queryClient.invalidateQueries({
        queryKey: [...BOOKMARKS_KEY, vars.userId],
      });
    },
  });
}

interface DeleteBookmarkVars {
  bookmarkId: number;
  userId: string;
}

export function useDeleteBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: DeleteBookmarkVars) => {
      const result = await deleteBookmarkAction(vars.bookmarkId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete bookmark");
      }
      return result;
    },

    onMutate: async (vars) => {
      const queryKey = [...BOOKMARKS_KEY, vars.userId];
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<CategoryWithBookmarks[]>(queryKey);

      queryClient.setQueryData<CategoryWithBookmarks[]>(queryKey, (old) => {
        if (!old) return old;
        return old
          .map((category) => ({
            ...category,
            bookmarks: category.bookmarks.filter(
              (bookmark) => bookmark.id !== vars.bookmarkId,
            ),
          }))
          .filter((category) => category.bookmarks.length > 0);
      });

      return { previousData };
    },

    onError: (_error, vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [...BOOKMARKS_KEY, vars.userId],
          context.previousData,
        );
      }
    },

    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({
        queryKey: [...BOOKMARKS_KEY, vars.userId],
      });
    },
  });
}

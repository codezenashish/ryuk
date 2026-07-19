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

const BOOKMARKS_KEY = ["bookmarks"] as const;
export function useBookmarksQuery(userId: string | null | undefined) {
  return useQuery<CategoryWithBookmarks[]>({
    queryKey: [...BOOKMARKS_KEY, userId ?? ""],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchBookmarksAction(userId);
    },
    enabled: !!userId,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}

// ── 2. CREATE MUTATION (Bookmark Save Karne Ke Liye With Optimistic UI) ──

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
      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<CategoryWithBookmarks[]>(queryKey);
      queryClient.setQueryData<CategoryWithBookmarks[]>(queryKey, (old) => {
        if (!old) return old;

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
          updated[existingIndex] = {
            ...updated[existingIndex],
            bookmarks: [
              ...updated[existingIndex].bookmarks,
              optimisticBookmark,
            ],
          };
          return updated;
        }
        const optimisticCategory: CategoryWithBookmarks = {
          id: `optimistic-${Date.now()}`,
          name: categoryName,
          icon: newBookmark.categoryIcon || "Folder01Icon", // Default to Hugeicons name
          color: "#6366F1",
          bookmarks: [optimisticBookmark],
        };
        return [...old, optimisticCategory];
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

      // UI se instantly hata dein bookmark ko
      queryClient.setQueryData<CategoryWithBookmarks[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((category) => ({
          ...category,
          bookmarks: category.bookmarks.filter(
            (bookmark) => bookmark.id !== vars.bookmarkId,
          ),
        }));
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

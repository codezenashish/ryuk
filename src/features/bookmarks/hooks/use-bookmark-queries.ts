import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBookmarksAction,
  createBookmarkAction,
  deleteBookmarkAction,
  bulkUpdateBookmarksAction,
} from "../actions/bookmark-actions";

// ── Types ──────────────────────────────────────────────────────────────

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
  position: number;
  bookmarks: BookmarkItem[];
}

const BOOKMARKS_KEY = ["bookmarks"] as const;

// ── Query ──────────────────────────────────────────────────────────────

export function useBookmarksQuery(userId: string | null | undefined) {
  return useQuery<CategoryWithBookmarks[]>({
    queryKey: [...BOOKMARKS_KEY, userId ?? ""],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchBookmarksAction(userId);
    },
    enabled: !!userId,
  });
}

// ── Create Mutation (Optimistic) ───────────────────────────────────────

interface CreateBookmarkVars {
  url: string;
  title: string;
  favicon: string;
  categoryName: string;
  userId: string;
}

export function useCreateBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: CreateBookmarkVars) => createBookmarkAction(vars),

    onMutate: async (newBookmark) => {
      const queryKey = [...BOOKMARKS_KEY, newBookmark.userId];

      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<CategoryWithBookmarks[]>(queryKey);

      queryClient.setQueryData<CategoryWithBookmarks[]>(
        queryKey,
        (old: any) => {
          if (!old) return old;

          const categoryName = newBookmark.categoryName.trim() || "General";
          const existingIndex = old.findIndex(
            (c: any) => c.name.toLowerCase() === categoryName.toLowerCase(),
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
            icon: "RiFolder5Line",
            color: "#6366F1",
            position: old.length,
            bookmarks: [optimisticBookmark],
          };
          return [...old, optimisticCategory];
        },
      );

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

// ── Delete Mutation (Optimistic) ───────────────────────────────────────

interface DeleteBookmarkVars {
  bookmarkId: number;
  userId: string;
}

export function useDeleteBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: DeleteBookmarkVars) =>
      deleteBookmarkAction(vars.bookmarkId),

    onMutate: async (vars) => {
      const queryKey = [...BOOKMARKS_KEY, vars.userId];

      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<CategoryWithBookmarks[]>(queryKey);

      queryClient.setQueryData<CategoryWithBookmarks[]>(
        queryKey,
        (old: any) => {
          if (!old) return old;
          return old.map((category: any) => ({
            ...category,
            bookmarks: category.bookmarks.filter(
              (b: any) => b.id !== vars.bookmarkId,
            ),
          }));
        },
      );

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

// ── Bulk Update Mutation ───────────────────────────────────────────────

interface BulkUpdateVars {
  userId: string;
  bookmarks: {
    id: number;
    title: string;
    url: string;
    categoryId: string;
  }[];
}

export function useBulkUpdateBookmarksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: BulkUpdateVars) => {
      const result = await bulkUpdateBookmarksAction(vars);
      if (!result.success) {
        throw new Error(result.error || "Bulk update failed");
      }
      return result;
    },

    onMutate: async (vars) => {
      const queryKey = [...BOOKMARKS_KEY, vars.userId];

      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<CategoryWithBookmarks[]>(queryKey);

      queryClient.setQueryData<CategoryWithBookmarks[]>(queryKey, (old:any) => {
        if (!old) return old;

        const updatedBookmarksMap = new Map<
          number,
          (typeof vars.bookmarks)[0]
        >();
        for (const b of vars.bookmarks) {
          updatedBookmarksMap.set(b.id, b);
        }

        const finalBookmarks = new Map<
          number,
          BookmarkItem & { categoryId: string }
        >();
        for (const cat of old) {
          for (const b of cat.bookmarks) {
            const update = updatedBookmarksMap.get(b.id);
            if (update) {
              finalBookmarks.set(b.id, {
                ...b,
                title: update.title,
                url: update.url || null,
                categoryId: update.categoryId,
              });
            } else {
              finalBookmarks.set(b.id, {
                ...b,
                categoryId: cat.id,
              });
            }
          }
        }

        return old.map((cat: any) => {
          const retained = cat.bookmarks
            .map((b: any) => finalBookmarks.get(b.id))
            .filter(
              (b: any): b is NonNullable<typeof b> =>
                !!b && b.categoryId === cat.id,
            );

          const movedIn = Array.from(finalBookmarks.values()).filter(
            (b: any) =>
              b.categoryId === cat.id &&
              !cat.bookmarks.some((orig: any) => orig.id === b.id),
          );

          return {
            ...cat,
            bookmarks: [...retained, ...movedIn].map(
              ({ categoryId, ...item }: any) => item,
            ),
          };
        });
      });

      return { previousData };
    },

    onError: (error, vars, context) => {
      console.error("Bulk update mutation error:", error);
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

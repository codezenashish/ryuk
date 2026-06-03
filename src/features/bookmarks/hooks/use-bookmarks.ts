import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchBookmarksAction,
  createBookmarkAction,
  deleteBookmarkAction,
} from "../actions/db-operations";

// ── Types ──────────────────────────────────────────────────────────────

export interface BookmarkItem {
  id: number;
  title: string;
  url: string | null;
  favicon: string;
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

export function useBookmarksQuery(userId: string) {
  return useQuery<CategoryWithBookmarks[]>({
    queryKey: [...BOOKMARKS_KEY, userId],
    queryFn: () => fetchBookmarksAction(userId),
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

      // Cancel in-flight fetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<CategoryWithBookmarks[]>(queryKey);

      queryClient.setQueryData<CategoryWithBookmarks[]>(queryKey, (old) => {
        if (!old) return old;

        const categoryName = newBookmark.categoryName.trim() || "General";
        const existingIndex = old.findIndex(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
        );

        // Temporary optimistic bookmark with a negative ID to avoid
        // collisions with real DB IDs.
        const optimisticBookmark: BookmarkItem = {
          id: -Date.now(),
          title: newBookmark.title,
          url: newBookmark.url,
          favicon: newBookmark.favicon,
        };

        if (existingIndex >= 0) {
          // Category exists — append bookmark
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

        // Category doesn't exist yet — create optimistic category
        const optimisticCategory: CategoryWithBookmarks = {
          id: `optimistic-${Date.now()}`,
          name: categoryName,
          icon: "RiFolder5Line",
          color: "#6366F1",
          position: old.length,
          bookmarks: [optimisticBookmark],
        };
        return [...old, optimisticCategory];
      });

      return { previousData };
    },

    onError: (_error, vars, context) => {
      // Roll back to the snapshot
      if (context?.previousData) {
        queryClient.setQueryData(
          [...BOOKMARKS_KEY, vars.userId],
          context.previousData,
        );
      }
    },

    onSettled: (_data, _error, vars) => {
      // Always re-sync with the server
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

      queryClient.setQueryData<CategoryWithBookmarks[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((category) => ({
          ...category,
          bookmarks: category.bookmarks.filter(
            (b) => b.id !== vars.bookmarkId,
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

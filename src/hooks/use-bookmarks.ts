"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getBookmarksAction,
  createBookmarkAction,
  updateBookmarkAction,
  deleteBookmarkAction,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "@/app/actions/bookmarks";
import { BookmarkItem } from "@/features/bookmarks/components/bookmark-card";

const EMPTY_BOOKMARKS: BookmarkItem[] = [];

// Helper function to resolve active query key
export function getBookmarksQueryKey(userId?: string) {
  return userId ? ["bookmarks", userId] : ["bookmarks"];
}

/**
 * Custom hook for bookmark management with 0ms perceived latency (Optimistic UI)
 * and seamless TanStack Query v5 cache management.
 */
export function useBookmarks(userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = getBookmarksQueryKey(userId);

  // ----------------------------------------------------
  // 1. QUERY: Fetch Bookmarks
  // ----------------------------------------------------
  const query = useQuery<BookmarkItem[]>({
    queryKey,
    queryFn: async () => {
      const data = await getBookmarksAction(userId);
      return data as unknown as BookmarkItem[];
    },
    staleTime: 1000 * 60 * 5, // 5 Minutes fresh cache
    gcTime: 1000 * 60 * 30, // 30 Minutes garbage collection
  });

  // ----------------------------------------------------
  // 2. MUTATION: Optimistic Add Bookmark
  // ----------------------------------------------------
  const addMutation = useMutation({
    mutationFn: async (newBookmarkInput: CreateBookmarkInput) => {
      const result = await createBookmarkAction(newBookmarkInput);
      return result as unknown as BookmarkItem;
    },
    onMutate: async (newBookmarkInput) => {
      // Step A: Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Step B: Snapshot the previous bookmarks state for rollback
      const previousBookmarks =
        queryClient.getQueryData<BookmarkItem[]>(queryKey) || [];

      // Step C: Construct optimistic bookmark object (0ms UI latency)
      const optimisticBookmark: BookmarkItem = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: newBookmarkInput.title.trim(),
        url: newBookmarkInput.url.trim(),
        description: newBookmarkInput.description || null,
        favicon:
          newBookmarkInput.favicon ||
          `https://www.google.com/s2/favicons?domain=${
            newBookmarkInput.url.replace(/^https?:\/\//i, "").split("/")[0]
          }&sz=128`,
        userId: userId || "current-user",
        categoryId: newBookmarkInput.categoryId || null,
        category: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Step D: Optimistically update cache instantly
      queryClient.setQueryData<BookmarkItem[]>(queryKey, (old = []) => [
        optimisticBookmark,
        ...old,
      ]);

      // Return context containing snapshot for onError rollback
      return { previousBookmarks };
    },
    onError: (err, _newBookmark, context) => {
      // Step E: Roll back to previous snapshot state on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(queryKey, context.previousBookmarks);
      }
      toast.error(
        err instanceof Error ? err.message : "Failed to add bookmark. Rolled back changes."
      );
    },
    onSettled: () => {
      // Step F: Always invalidate to ensure cache syncs with exact DB state & returned ID
      queryClient.invalidateQueries({ queryKey });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      }
    },
  });

  // ----------------------------------------------------
  // 3. MUTATION: Optimistic Update Bookmark
  // ----------------------------------------------------
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateBookmarkInput;
    }) => {
      const result = await updateBookmarkAction(id, input);
      return result as unknown as BookmarkItem;
    },
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousBookmarks =
        queryClient.getQueryData<BookmarkItem[]>(queryKey) || [];

      // Optimistically update item in cache
      queryClient.setQueryData<BookmarkItem[]>(queryKey, (old = []) =>
        old.map((bm) =>
          bm.id === id
            ? {
                ...bm,
                ...(input.title !== undefined && { title: input.title }),
                ...(input.url !== undefined && { url: input.url }),
                ...(input.description !== undefined && {
                  description: input.description,
                }),
                ...(input.favicon !== undefined && { favicon: input.favicon }),
                ...(input.categoryId !== undefined && {
                  categoryId: input.categoryId,
                }),
                updatedAt: new Date(),
              }
            : bm
        )
      );

      return { previousBookmarks };
    },
    onError: (err, _variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(queryKey, context.previousBookmarks);
      }
      toast.error(
        err instanceof Error ? err.message : "Failed to update bookmark. Changes rolled back."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      }
    },
  });

  // ----------------------------------------------------
  // 4. MUTATION: Optimistic Delete Bookmark
  // ----------------------------------------------------
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteBookmarkAction(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previousBookmarks =
        queryClient.getQueryData<BookmarkItem[]>(queryKey) || [];

      // Optimistically remove item from cache instantly
      queryClient.setQueryData<BookmarkItem[]>(queryKey, (old = []) =>
        old.filter((bm) => bm.id !== id)
      );

      return { previousBookmarks };
    },
    onError: (err, _id, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(queryKey, context.previousBookmarks);
      }
      toast.error(
        err instanceof Error ? err.message : "Failed to delete bookmark. Restored state."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      }
    },
  });

  return {
    bookmarks: query.data ?? EMPTY_BOOKMARKS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    addBookmark: addMutation.mutate,
    addBookmarkAsync: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateBookmark: updateMutation.mutate,
    updateBookmarkAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteBookmark: deleteMutation.mutate,
    deleteBookmarkAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    addMutation,
    updateMutation,
    deleteMutation,
    refetch: query.refetch,
  };
}

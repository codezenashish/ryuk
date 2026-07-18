import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBookmarksAction,
  createBookmarkAction,
  deleteBookmarkAction,
} from "../actions/bookmark-action";

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

// ── 1. FETCH QUERY (Bookmarks Load Karne Ke Liye) ──────────────────────

export function useBookmarksQuery(userId: string | null | undefined) {
  return useQuery<CategoryWithBookmarks[]>({
    queryKey: [...BOOKMARKS_KEY, userId ?? ""],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchBookmarksAction(userId);
    },
    enabled: !!userId,
    refetchInterval: 5000, // Har 5 seconds me background me sync karega
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

    // Jaise hi user save dabayega, ye function turant chalega (Bina server response ka wait kiye)
    onMutate: async (newBookmark) => {
      const queryKey = [...BOOKMARKS_KEY, newBookmark.userId];

      // Pehle chal rahe fetches ko cancel karein taaki data overwrite na ho
      await queryClient.cancelQueries({ queryKey });

      // Purana data store karein cache se (agar error aaya toh rollback karne ke liye)
      const previousData =
        queryClient.getQueryData<CategoryWithBookmarks[]>(queryKey);

      // Cache ko instantly update karein naye bookmark ke sath
      queryClient.setQueryData<CategoryWithBookmarks[]>(
        queryKey,
        (old: any) => {
          if (!old) return old;

          const categoryName = newBookmark.categoryName.trim() || "General";
          const existingIndex = old.findIndex(
            (c: any) => c.name.toLowerCase() === categoryName.toLowerCase(),
          );

          // Fake temporary ID (Bina database ke UI me dikhane ke liye)
          const optimisticBookmark: BookmarkItem = {
            id: -Date.now(),
            title: newBookmark.title,
            url: newBookmark.url,
            favicon: newBookmark.favicon,
            createdAt: new Date(),
          };

          // Agar category pehle se frontend par hai
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

          // Agar user ne nayi category banayi hai toh use bhi instantly add karein
          const optimisticCategory: CategoryWithBookmarks = {
            id: `optimistic-${Date.now()}`,
            name: categoryName,
            icon: newBookmark.categoryIcon || "Folder01Icon", // Default to Hugeicons name
            color: "#6366F1",
            position: old.length,
            bookmarks: [optimisticBookmark],
          };
          return [...old, optimisticCategory];
        },
      );

      return { previousData };
    },

    // Agar server par save fail ho jata hai toh UI ko wapas purani state me le aayein
    onError: (_error, vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [...BOOKMARKS_KEY, vars.userId],
          context.previousData,
        );
      }
    },

    // Jab sab complete ho jaye (Success ho ya Error), database se fresh data fetch karein
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({
        queryKey: [...BOOKMARKS_KEY, vars.userId],
      });
    },
  });
}

// ── 3. DELETE MUTATION (Bookmark Delete Karne Ke Liye) ──────────────────

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

      // UI se instantly hata dein bookmark ko
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

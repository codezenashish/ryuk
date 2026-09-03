import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookmarksAction, createBookmarkAction } from "../actions";
import type { Bookmark } from "@ryuk/db";

export const BOOKMARKS_KEY = ["bookmarks"] as const;

export function useBookmarks(initialData?: Bookmark[]) {
  return useQuery({
    queryKey: BOOKMARKS_KEY,
    queryFn: async () => await getBookmarksAction(),
    initialData,
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await createBookmarkAction(formData);
      if (res?.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_KEY });
    },
  });
}

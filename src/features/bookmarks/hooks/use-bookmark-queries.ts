"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookmarkItem,
  BookmarkCategory,
} from "../components/bookmark-card";

export interface CategoryWithBookmarks extends BookmarkCategory {
  bookmarks: BookmarkItem[];
}

interface FetchBookmarksResponse {
  bookmarks: BookmarkItem[];
  isGuest: boolean;
}

// Fetch all bookmarks from API
async function fetchBookmarks(): Promise<BookmarkItem[]> {
  const res = await fetch("/api/bookmark");
  if (!res.ok) {
    throw new Error("Failed to fetch bookmarks");
  }
  const data: FetchBookmarksResponse = await res.json();
  return data.bookmarks || [];
}

// Create bookmark via API
async function createBookmark(newBookmark: {
  title: string;
  url: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
  favicon?: string;
}): Promise<BookmarkItem> {
  const res = await fetch("/api/bookmark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBookmark),
  });

  if (!res.ok) {
    throw new Error("Failed to create bookmark");
  }

  const data = await res.json();
  return data.bookmark;
}

// Update bookmark via API
async function updateBookmark({
  id,
  data,
}: {
  id: string;
  data: Partial<BookmarkItem> & { categoryId?: string; tags?: string[] };
}): Promise<BookmarkItem> {
  const res = await fetch(`/api/bookmark/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update bookmark");
  }

  const result = await res.json();
  return result.bookmark;
}

// Delete bookmark via API
async function deleteBookmark(id: string): Promise<string> {
  const res = await fetch(`/api/bookmark/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete bookmark");
  }

  return id;
}

// --- Hooks Export ---

export function useBookmarksQuery() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  });
}

export function useCreateBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useUpdateBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useDeleteBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

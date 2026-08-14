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
  isGuest?: boolean;
}

interface FetchCategoriesResponse {
  categories: BookmarkCategory[];
}

// ----------------------------------------------------
// API Fetchers
// ----------------------------------------------------

async function fetchBookmarks(): Promise<BookmarkItem[]> {
  const res = await fetch("/api/bookmark");
  if (!res.ok) {
    throw new Error("Failed to fetch bookmarks");
  }
  const data: FetchBookmarksResponse = await res.json();
  return data.bookmarks || [];
}

async function fetchCategories(): Promise<BookmarkCategory[]> {
  const res = await fetch("/api/category");
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  const data: FetchCategoriesResponse = await res.json();
  return data.categories || [];
}

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

async function updateBookmark({
  id,
  data,
}: {
  id: string;
  data: {
    title?: string;
    url?: string;
    description?: string | null;
    categoryId?: string | null;
    tags?: string[];
    favicon?: string | null;
    isPinned?: boolean;
  };
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

async function deleteBookmark(id: string): Promise<string> {
  const res = await fetch(`/api/bookmark/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete bookmark");
  }

  return id;
}

async function createCategory(newCategory: {
  name: string;
  color?: string;
  icon?: string;
}): Promise<BookmarkCategory> {
  const res = await fetch("/api/category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCategory),
  });

  if (!res.ok) {
    throw new Error("Failed to create category");
  }

  const data = await res.json();
  return data.category;
}

// ----------------------------------------------------
// Custom Hooks with TanStack Query (10 min stale time caching)
// ----------------------------------------------------

export function useBookmarksQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
    staleTime: 1000 * 60 * 10, // 10 Minutes memory cache (prevents DB calls on page navigation)
    gcTime: 1000 * 60 * 30, // 30 Minutes Garbage Collection Time
    enabled,
  });
}

export function useCategoriesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // 10 Minutes memory cache
    gcTime: 1000 * 60 * 30,
    enabled,
  });
}

export function useCreateBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBookmark,
    onSuccess: (newBm) => {
      queryClient.setQueryData<BookmarkItem[]>(["bookmarks"], (old = []) => [
        newBm,
        ...old,
      ]);
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useUpdateBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBookmark,
    onSuccess: (updatedBm) => {
      queryClient.setQueryData<BookmarkItem[]>(["bookmarks"], (old = []) =>
        old.map((bm) => (bm.id === updatedBm.id ? updatedBm : bm))
      );
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useDeleteBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBookmark,
    onSuccess: (deletedId) => {
      queryClient.setQueryData<BookmarkItem[]>(["bookmarks"], (old = []) =>
        old.filter((bm) => bm.id !== deletedId)
      );
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (newCat) => {
      queryClient.setQueryData<BookmarkCategory[]>(["categories"], (old = []) => [
        ...old,
        newCat,
      ]);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

"use server";

import { db } from "@/src/lib/prisma-client";

// ── Helpers ────────────────────────────────────────────────────────────

function getCategoryIconName(categoryName: string): string {
  const name = categoryName.toLowerCase().trim();
  if (name.includes("social") || name.includes("account")) return "RiGithubFill";
  if (name.includes("tool") || name.includes("dev") || name.includes("terminal")) return "RiTerminalBoxLine";
  if (name.includes("doc") || name.includes("book") || name.includes("api")) return "RiBookOpenLine";
  if (name.includes("design") || name.includes("palette") || name.includes("ui")) return "RiPaletteLine";
  return "RiFolder5Line";
}

async function findOrCreateCategory(categoryName: string, userId: string) {
  const trimmed = categoryName.trim() || "General";

  const existing = await db.category.findFirst({
    where: { name: trimmed, userId },
    select: { id: true },
  });
  if (existing) return existing;

  const { _max } = await db.category.aggregate({
    where: { userId },
    _max: { position: true },
  });
  const nextPosition = (_max.position ?? -1) + 1;

  return db.category.create({
    data: {
      name: trimmed,
      userId,
      icon: getCategoryIconName(trimmed),
      position: nextPosition,
    },
    select: { id: true },
  });
}

// ── Queries ────────────────────────────────────────────────────────────

export async function fetchBookmarksAction(userId: string) {
  const categories = await db.category.findMany({
    where: { userId },
    orderBy: { position: "asc" },
    include: {
      bookmarks: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          url: true,
          favicon: true,
        },
      },
    },
  });

  return categories;
}

// ── Mutations ──────────────────────────────────────────────────────────

interface CreateBookmarkInput {
  url: string;
  title: string;
  favicon: string;
  categoryName: string;
  userId: string;
}

export async function createBookmarkAction(input: CreateBookmarkInput) {
  try {
    const { url, title, favicon, categoryName, userId } = input;
    if (!url || !title) return { success: false as const, error: "URL and title are required" };

    const category = await findOrCreateCategory(categoryName, userId);

    const newBookmark = await db.$transaction(async (tx) => {
      const { _max } = await tx.bookmark.aggregate({
        where: { userId, categoryId: category.id },
        _max: { position: true },
      });

      return tx.bookmark.create({
        data: {
          title,
          url,
          favicon,
          userId,
          categoryId: category.id,
          position: (_max.position ?? -1) + 1,
        },
      });
    });

    return { success: true as const, bookmark: newBookmark, categoryId: category.id };
  } catch (error) {
    console.error("Database Save Action Error:", error);
    return { success: false as const, error: "Internal Server Error" };
  }
}

export async function deleteBookmarkAction(bookmarkId: number) {
  try {
    await db.bookmark.delete({ where: { id: bookmarkId } });
    return { success: true as const };
  } catch (error) {
    console.error("Delete Bookmark Error:", error);
    return { success: false as const, error: "Failed to delete bookmark" };
  }
}

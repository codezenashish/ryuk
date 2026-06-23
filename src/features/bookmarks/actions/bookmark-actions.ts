"use server";

import { db } from "@/src/lib/prisma-client";

function getCategoryIconName(categoryName: string): string {
  const name = categoryName.toLowerCase().trim();
  if (name.includes("social") || name.includes("account"))
    return "RiGithubFill";
  if (
    name.includes("tool") ||
    name.includes("dev") ||
    name.includes("terminal")
  )
    return "RiTerminalBoxLine";
  if (name.includes("doc") || name.includes("book") || name.includes("api"))
    return "RiBookOpenLine";
  if (
    name.includes("design") ||
    name.includes("palette") ||
    name.includes("ui")
  )
    return "RiPaletteLine";
  return "RiFolder5Line";
}

async function findOrCreateCategory(categoryName: string, userId: string, icon?: string) {
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
      icon: icon || getCategoryIconName(trimmed),
      position: nextPosition,
    },
    select: { id: true },
  });
}

export async function fetchBookmarksAction(userId: string) {
  if (!userId) {
    throw new Error("Unauthorized: userId is required");
  }

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
          createdAt: true,
        },
      },
    },
  });

  return categories;
}

interface CreateBookmarkInput {
  url: string;
  title: string;
  favicon: string;
  categoryName: string;
  categoryIcon?: string;
  userId: string;
}

export async function createBookmarkAction(input: CreateBookmarkInput) {
  try {
    const { url, title, favicon, categoryName, categoryIcon, userId } = input;
    if (!url || !title)
      return { success: false as const, error: "URL and title are required" };

    const category = await findOrCreateCategory(categoryName, userId, categoryIcon);

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

    return {
      success: true as const,
      bookmark: newBookmark,
      categoryId: category.id,
    };
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

interface BulkUpdateInput {
  userId: string;
  bookmarks: {
    id: number;
    title: string;
    url: string;
    categoryId: string;
  }[];
}

export async function bulkUpdateBookmarksAction(input: BulkUpdateInput) {
  try {
    const { userId, bookmarks } = input;

    if (!bookmarks || bookmarks.length === 0) {
      return { success: false as const, error: "No bookmarks to update" };
    }

    // FIX: Verify all bookmark IDs belong to this user before updating,

    const bookmarkIds = bookmarks.map((b) => b.id);
    const ownedBookmarks = await db.bookmark.findMany({
      where: { id: { in: bookmarkIds }, userId },
      select: { id: true },
    });

    const ownedIds = new Set(ownedBookmarks.map((b) => b.id));
    const unauthorizedIds = bookmarkIds.filter((id) => !ownedIds.has(id));

    if (unauthorizedIds.length > 0) {
      console.error(
        `Bulk update: ${unauthorizedIds.length} bookmark(s) not found for userId=${userId}. IDs: ${unauthorizedIds.join(", ")}`,
      );
      return {
        success: false as const,
        error: `${unauthorizedIds.length} bookmark(s) not found or unauthorized`,
      };
    }

    // FIX: Use a single $transaction to guarantee atomicity. All updates

    const results = await db.$transaction(
      async (tx) => {
        return Promise.all(
          bookmarks.map((b) =>
            tx.bookmark.update({
              where: {
                id: b.id,
              },
              data: {
                title: b.title,
                url: b.url || null,
                categoryId: b.categoryId,
              },
            })
          )
        );
      },
      {
        timeout: 15000,
      }
    );

    console.log(`Successfully updated ${results.length} bookmarks`);
    return { success: true as const, updatedCount: results.length };
  } catch (error) {
    console.error("Bulk Update Error:", error);
    return { success: false as const, error: String(error) };
  }
}

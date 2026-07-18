"use server";

import { db } from "@/lib/db";


function getCategoryIconName(categoryName: string): string {
  const name = categoryName.toLowerCase().trim();
  if (name.includes("social") || name.includes("account"))
    return "UserStar01Icon";
  if (
    name.includes("tool") ||
    name.includes("dev") ||
    name.includes("terminal")
  )
    return "TerminalIcon";
  if (name.includes("doc") || name.includes("book") || name.includes("api"))
    return "BookOpen01Icon";
  if (
    name.includes("design") ||
    name.includes("palette") ||
    name.includes("ui")
  )
    return "PaletteIcon";
  return "Folder01Icon";
}

/**
 * Check karega ki kya category pehle se bani hui hai.
 * Agar nahi bani hai, toh naya create karega automatic position tracking ke sath.
 */
async function findOrCreateCategory(
  categoryName: string,
  userId: string,
  icon?: string,
) {
  const trimmed = categoryName.trim() || "General";

  // Check if category already exists for this user
  const existing = await db.category.findFirst({
    where: { name: trimmed, userId },
    select: { id: true },
  });
  if (existing) return existing;

  // Find the next available position for sorting
  const { _max } = await db.category.aggregate({
    where: { userId },
    _max: { position: true },
  });
  const nextPosition = (_max.position ?? -1) + 1;

  // Create new category
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

/**
 * 1. FETCH ACTION: User ke saare bookmarks aur unki categories lane ke liye.
 */
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

// Create Bookmark Input Schema
interface CreateBookmarkInput {
  url: string;
  title: string;
  favicon: string;
  categoryName: string;
  categoryIcon?: string;
  userId: string;
}

/**
 * 2. CREATE ACTION: Naya bookmark save karne ke liye.
 * Yeh transaction ($transaction) use karta hai taaki data secure tarike se sequentially save ho.
 */
export async function createBookmarkAction(input: CreateBookmarkInput) {
  try {
    const { url, title, favicon, categoryName, categoryIcon, userId } = input;
    if (!url || !title) {
      return { success: false as const, error: "URL and title are required" };
    }

    // Pehle check karein ya banayein category
    const category = await findOrCreateCategory(
      categoryName,
      userId,
      categoryIcon,
    );

    // Database transaction use karke position manage aur add bookmark karein
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

/**
 * 3. DELETE ACTION: Kisi bookmark ko delete karne ke liye.
 */
export async function deleteBookmarkAction(bookmarkId: number) {
  try {
    await db.bookmark.delete({ where: { id: bookmarkId } });
    return { success: true as const };
  } catch (error) {
    console.error("Delete Bookmark Error:", error);
    return { success: false as const, error: "Failed to delete bookmark" };
  }
}

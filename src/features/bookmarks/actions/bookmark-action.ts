"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getAuthenticatedUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}
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
 * Creates a category when one with the same name does not already exist.
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

  return db.category.create({
    data: {
      name: trimmed,
      userId,
      icon: icon || getCategoryIconName(trimmed),
    },
    select: { id: true },
  });
}

/**
 * 1. FETCH ACTION: User ke saare bookmarks aur unki categories lane ke liye.
 */
export async function fetchBookmarksAction(userId: string) {
  const authenticatedUserId = await getAuthenticatedUserId();
  if (userId !== authenticatedUserId) {
    throw new Error("Unauthorized");
  }

  const categories = await db.category.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      bookmarks: {
        orderBy: { createdAt: "desc" },
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

export async function saveBookmarkToDatabase(input: CreateBookmarkInput) {
  const { url, title, favicon, categoryName, categoryIcon, userId } = input;
  if (!url || !title) {
    return { success: false as const, error: "URL and title are required" };
  }

  const category = await findOrCreateCategory(
    categoryName,
    userId,
    categoryIcon,
  );

  const newBookmark = await db.bookmark.create({
    data: {
      title,
      url,
      favicon,
      userId,
      categoryId: category.id,
    },
  });

  return {
    success: true as const,
    bookmark: newBookmark,
    categoryId: category.id,
  };
}


export async function createBookmarkAction(input: CreateBookmarkInput) {
  try {
    const authenticatedUserId = await getAuthenticatedUserId();
    if (input.userId !== authenticatedUserId) {
      return { success: false as const, error: "Unauthorized" };
    }
    return await saveBookmarkToDatabase(input);
  } catch (error) {
    console.error("Database Save Action Error:", error);
    return { success: false as const, error: "Internal Server Error" };
  }
}


export async function deleteBookmarkAction(bookmarkId: number) {
  try {
    const userId = await getAuthenticatedUserId();
    const result = await db.bookmark.deleteMany({
      where: { id: bookmarkId, userId },
    });
    if (!result.count) {
      return { success: false as const, error: "Bookmark not found" };
    }

    return { success: true as const };
  } catch (error) {
    console.error("Delete Bookmark Error:", error);
    return { success: false as const, error: "Failed to delete bookmark" };
  }
}

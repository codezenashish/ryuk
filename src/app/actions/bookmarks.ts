"use server";

import { db } from "@/db";
import { bookmarks, categories } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export interface CreateBookmarkInput {
  title: string;
  url: string;
  description?: string | null;
  favicon?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  isPinned?: boolean;
}

export interface UpdateBookmarkInput {
  title?: string;
  url?: string;
  description?: string | null;
  favicon?: string | null;
  categoryId?: string | null;
  isPinned?: boolean;
}

/**
 * Fetch all bookmarks for the authenticated user (or specified userId).
 */
export async function getBookmarksAction(userId?: string) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized. Please sign in.");
  }

  const targetUserId = userId || user.id;

  const data = await db.query.bookmarks.findMany({
    where: eq(bookmarks.userId, targetUserId),
    with: {
      category: true,
    },
    orderBy: [desc(bookmarks.createdAt)],
  });

  return data;
}

/**
 * Create a new bookmark in the database via Drizzle ORM.
 * Verifies foreign key relations before insertion to prevent invalid category ID crashes.
 */
export async function createBookmarkAction(input: CreateBookmarkInput) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized. Please sign in to add bookmarks.");
  }

  let formattedUrl = input.url.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  let validCategoryId: string | null = null;

  // 1. Check if categoryId is provided and exists in DB for this user
  if (input.categoryId) {
    const existingCat = await db.query.categories.findFirst({
      where: and(
        eq(categories.id, input.categoryId),
        eq(categories.userId, user.id)
      ),
    });
    if (existingCat) {
      validCategoryId = existingCat.id;
    }
  }

  // 2. If validCategoryId is still null but categoryName was provided, find or auto-create category in DB
  if (!validCategoryId && input.categoryName?.trim()) {
    const trimmedName = input.categoryName.trim();
    const existingByName = await db.query.categories.findFirst({
      where: and(
        eq(categories.name, trimmedName),
        eq(categories.userId, user.id)
      ),
    });

    if (existingByName) {
      validCategoryId = existingByName.id;
    } else {
      const [newCat] = await db
        .insert(categories)
        .values({
          name: trimmedName,
          userId: user.id,
        })
        .returning();
      validCategoryId = newCat.id;
    }
  }

  // Insert bookmark into Supabase DB via Drizzle
  const [inserted] = await db
    .insert(bookmarks)
    .values({
      title: input.title.trim(),
      url: formattedUrl,
      description: input.description?.trim() || null,
      favicon: input.favicon || null,
      isPinned: input.isPinned ?? false,
      userId: user.id,
      categoryId: validCategoryId,
    })
    .returning();

  // Fetch full bookmark with category relation
  const fullBookmark = await db.query.bookmarks.findFirst({
    where: eq(bookmarks.id, inserted.id),
    with: {
      category: true,
    },
  });

  if (!fullBookmark) {
    throw new Error("Failed to retrieve created bookmark.");
  }

  return fullBookmark;
}

/**
 * Update an existing bookmark by ID.
 */
export async function updateBookmarkAction(
  id: string,
  input: UpdateBookmarkInput
) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized. Please sign in.");
  }

  // Verify ownership
  const existing = await db.query.bookmarks.findFirst({
    where: and(eq(bookmarks.id, id), eq(bookmarks.userId, user.id)),
  });

  if (!existing) {
    throw new Error("Bookmark not found or access denied.");
  }

  let formattedUrl = input.url ? input.url.trim() : undefined;
  if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  let validCategoryId: string | null | undefined = undefined;
  if (input.categoryId !== undefined) {
    if (input.categoryId === null) {
      validCategoryId = null;
    } else {
      const existingCat = await db.query.categories.findFirst({
        where: and(
          eq(categories.id, input.categoryId),
          eq(categories.userId, user.id)
        ),
      });
      validCategoryId = existingCat ? existingCat.id : null;
    }
  }

  await db
    .update(bookmarks)
    .set({
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(formattedUrl !== undefined && { url: formattedUrl }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.favicon !== undefined && { favicon: input.favicon }),
      ...(validCategoryId !== undefined && { categoryId: validCategoryId }),
      ...(input.isPinned !== undefined && { isPinned: input.isPinned }),
      updatedAt: new Date(),
    })
    .where(eq(bookmarks.id, id));

  const updatedBookmark = await db.query.bookmarks.findFirst({
    where: eq(bookmarks.id, id),
    with: {
      category: true,
    },
  });

  if (!updatedBookmark) {
    throw new Error("Failed to retrieve updated bookmark.");
  }

  return updatedBookmark;
}

/**
 * Delete a bookmark by ID.
 */
export async function deleteBookmarkAction(id: string) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized. Please sign in.");
  }

  const existing = await db.query.bookmarks.findFirst({
    where: and(eq(bookmarks.id, id), eq(bookmarks.userId, user.id)),
  });

  if (!existing) {
    throw new Error("Bookmark not found or access denied.");
  }

  await db.delete(bookmarks).where(eq(bookmarks.id, id));
  return { id };
}

/**
 * Bulk delete bookmarks by IDs.
 */
export async function bulkDeleteBookmarksAction(ids: string[]) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized. Please sign in.");
  }
  
  if (!ids || ids.length === 0) return { deletedCount: 0 };

  // Only delete bookmarks belonging to the user
  const result = await db
    .delete(bookmarks)
    .where(and(inArray(bookmarks.id, ids), eq(bookmarks.userId, user.id)))
    .returning({ id: bookmarks.id });

  return { deletedCount: result.length, deletedIds: result.map((r) => r.id) };
}

/**
 * Bulk update bookmarks by IDs.
 */
export async function bulkUpdateBookmarksAction(
  ids: string[],
  input: { categoryId?: string | null; isPinned?: boolean }
) {
  const user = await getOrCreateDbUser();
  if (!user) {
    throw new Error("Unauthorized. Please sign in.");
  }

  if (!ids || ids.length === 0) return { updatedCount: 0 };

  let validCategoryId: string | null | undefined = undefined;
  if (input.categoryId !== undefined) {
    if (input.categoryId === null) {
      validCategoryId = null;
    } else {
      const existingCat = await db.query.categories.findFirst({
        where: and(
          eq(categories.id, input.categoryId),
          eq(categories.userId, user.id)
        ),
      });
      validCategoryId = existingCat ? existingCat.id : null;
    }
  }

  const result = await db
    .update(bookmarks)
    .set({
      ...(validCategoryId !== undefined && { categoryId: validCategoryId }),
      ...(input.isPinned !== undefined && { isPinned: input.isPinned }),
      updatedAt: new Date(),
    })
    .where(and(inArray(bookmarks.id, ids), eq(bookmarks.userId, user.id)))
    .returning({ id: bookmarks.id });

  return { updatedCount: result.length, updatedIds: result.map((r) => r.id) };
}

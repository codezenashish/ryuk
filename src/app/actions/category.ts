"use server";

import { db } from "@/db";
import { categories, bookmarks, categoryCollaborators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export async function deleteCategoryAction(categoryId: string) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Verify the user owns the category
  const [existingCat] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));

  if (!existingCat) throw new Error("Category not found");
  if (existingCat.userId !== user.id) throw new Error("Unauthorized to delete this category");

  // 2. Delete all bookmarks associated with this category
  await db.delete(bookmarks).where(eq(bookmarks.categoryId, categoryId));

  // 3. Delete all collaborators for this category
  await db.delete(categoryCollaborators).where(eq(categoryCollaborators.categoryId, categoryId));

  // 4. Delete the category itself
  await db.delete(categories).where(eq(categories.id, categoryId));

  return true;
}

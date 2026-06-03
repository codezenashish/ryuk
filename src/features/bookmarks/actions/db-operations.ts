"use server";

import { db } from "@/src/lib/db";
import { revalidatePath } from "next/cache";

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

interface CreateBookmarkInput {
  url: string;
  title: string;
  categoryName: string;
  userId: string;
}

export async function createBookmarkAction(input: CreateBookmarkInput) {
  try {
    const { url, title, categoryName, userId } = input;
    if (!url || !title) return { success: false, error: "URL and title are required" };

    const [category, { _max: bmMax }] = await Promise.all([
      findOrCreateCategory(categoryName, userId),
      db.bookmark.aggregate({
        where: { userId, categoryId: undefined }, // resolved after category
        _max: { position: true },
      }),
    ]);

    const newBookmark = await db.$transaction(async (tx) => {
      const { _max } = await tx.bookmark.aggregate({
        where: { userId, categoryId: category.id },
        _max: { position: true },
      });

      const domainUrl = new URL(url).hostname;
      return tx.bookmark.create({
        data: {
          title,
          url,
          favicon: `https://www.google.com/s2/favicons?sz=64&domain=${domainUrl}`,
          userId,
          categoryId: category.id,
          position: (_max.position ?? -1) + 1,
        },
      });
    });

    revalidatePath("/bookmarks");
    return { success: true, bookmark: newBookmark };
  } catch (error) {
    console.error("Database Save Action Error:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function updateBookmarkMetadataInBackground(
  bookmarkId: number,
  title: string,
  categoryName: string,
  userId: string,
) {
  try {
    const category = await findOrCreateCategory(categoryName, userId);

    await db.bookmark.update({
      where: { id: bookmarkId },
      data: {
        title: title || undefined,
        categoryId: category.id,
      },
    });

    revalidatePath("/bookmarks");
  } catch (error) {
    console.error("Background Metadata Update Error:", error);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@ryuk/auth/server";
import { db, bookmarks } from "@ryuk/db";
import { desc, eq } from "drizzle-orm";
import { createBookmarkSchema } from "../schemas";
import { scrapeUrlMetadata } from "../utils/scrape-metadata";

export async function fetchUrlMetadataAction(url: string) {
  const user = await getUser();

  if (!user) return { error: "Unauthorized" };
  const metadata = await scrapeUrlMetadata(url);
  return { data: metadata };
}
export async function createBookmarkAction(formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized. Please login." };
  }

  const rawUrl = formData.get("url") as string;
  let title = (formData.get("title") as string)?.trim();
  let description =
    (formData.get("description") as string)?.trim() || undefined;
  const categoryId = (formData.get("categoryId") as string) || undefined;

  let faviconUrl: string | undefined;
  if (!title || !description) {
    const scraped = await scrapeUrlMetadata(rawUrl);
    if (!title) title = scraped.title || new URL(rawUrl).hostname;
    if (!description) description = scraped.description;
    faviconUrl = scraped.faviconUrl;
  }

  const parsed = createBookmarkSchema.safeParse({
    url: rawUrl,
    title,
    description,
    categoryId,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    if (!faviconUrl) {
      const parsedUrl = new URL(parsed.data.url);
      faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;
    }

    const [inserted] = await db
      .insert(bookmarks)
      .values({
        userId: user.id,
        url: parsed.data.url,
        title: parsed.data.title,
        description: parsed.data.description,
        faviconUrl,
        categoryId: parsed.data.categoryId,
      })
      .returning();

    revalidatePath("/dashboard");
    return { data: inserted };
  } catch {
    return { error: "Failed to save bookmark to database." };
  }
}

export async function getBookmarksAction() {
  try {
    const user = await getUser();
    if (!user) return [];
    return await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, user.id))
      .orderBy(desc(bookmarks.createdAt));
  } catch {
    return [];
  }
}

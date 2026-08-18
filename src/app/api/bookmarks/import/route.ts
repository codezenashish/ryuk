import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookmarks, categories } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in or create a user." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookmarks: incomingBookmarks, skipDuplicates = true } = body as {
      bookmarks: { title: string; url: string; categoryName?: string }[];
      skipDuplicates: boolean;
    };

    if (!incomingBookmarks || !Array.isArray(incomingBookmarks)) {
      return NextResponse.json(
        { error: "Invalid payload: bookmarks array is required" },
        { status: 400 }
      );
    }

    let toInsert = incomingBookmarks.map((b) => ({
      title: b.title.trim(),
      url: b.url.trim(),
      categoryName: b.categoryName?.trim(),
    }));

    // Handle skip duplicates
    if (skipDuplicates && toInsert.length > 0) {
      const existingBookmarks = await db.query.bookmarks.findMany({
        where: eq(bookmarks.userId, user.id),
        columns: { url: true },
      });
      const existingUrls = new Set(existingBookmarks.map((b) => b.url));

      toInsert = toInsert.filter((b) => {
        let formattedUrl = b.url;
        if (!/^https?:\/\//i.test(formattedUrl)) {
          formattedUrl = `https://${formattedUrl}`;
        }
        return !existingUrls.has(formattedUrl);
      });
    }

    if (toInsert.length === 0) {
      return NextResponse.json({
        message: "No new bookmarks to import.",
        importedCount: 0,
        skippedCount: incomingBookmarks.length,
      });
    }

    // Process Categories
    // Extract unique category names
    const uniqueCategoryNames = Array.from(
      new Set(toInsert.map((b) => b.categoryName).filter(Boolean))
    ) as string[];

    const categoryMap = new Map<string, string>(); // name -> id

    if (uniqueCategoryNames.length > 0) {
      // Find existing categories
      const existingCategories = await db.query.categories.findMany({
        where: and(
          eq(categories.userId, user.id),
          inArray(categories.name, uniqueCategoryNames)
        ),
      });

      existingCategories.forEach((cat) => categoryMap.set(cat.name, cat.id));

      // Create missing categories
      const missingCategories = uniqueCategoryNames.filter(
        (name) => !categoryMap.has(name)
      );

      if (missingCategories.length > 0) {
        const newCatsToInsert = missingCategories.map((name) => ({
          name,
          userId: user.id,
        }));

        const insertedCats = await db
          .insert(categories)
          .values(newCatsToInsert)
          .returning();

        insertedCats.forEach((cat) => categoryMap.set(cat.name, cat.id));
      }
    }

    // Prepare final bookmark inserts
    const bookmarksToInsert = toInsert.map((b) => {
      let formattedUrl = b.url;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      return {
        title: b.title || formattedUrl,
        url: formattedUrl,
        categoryId: b.categoryName ? categoryMap.get(b.categoryName) || null : null,
        userId: user.id,
      };
    });

    // Bulk insert bookmarks (Drizzle can handle decent sized batches, but we might want to chunk if > 1000)
    // We'll chunk to 500 max per insert to be safe
    const CHUNK_SIZE = 500;
    let totalInserted = 0;

    for (let i = 0; i < bookmarksToInsert.length; i += CHUNK_SIZE) {
      const chunk = bookmarksToInsert.slice(i, i + CHUNK_SIZE);
      await db.insert(bookmarks).values(chunk);
      totalInserted += chunk.length;
    }

    return NextResponse.json(
      {
        message: "Import successful",
        importedCount: totalInserted,
        skippedCount: incomingBookmarks.length - totalInserted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/bookmarks/import error:", error);
    return NextResponse.json(
      { error: "Failed to import bookmarks" },
      { status: 500 }
    );
  }
}

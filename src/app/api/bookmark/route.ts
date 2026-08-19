import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookmarks, categories, categoryCollaborators } from "@/db/schema";
import { eq, and, desc, or, inArray } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ bookmarks: [], isGuest: true });
    }

    // Find categories the user is collaborating on
    const sharedCategories = await db
      .select({ categoryId: categoryCollaborators.categoryId })
      .from(categoryCollaborators)
      .where(eq(categoryCollaborators.userId, user.id));

    const sharedIds = sharedCategories.map(sc => sc.categoryId);

    const userBookmarks = await db.query.bookmarks.findMany({
      where: sharedIds.length > 0 
        ? or(
            eq(bookmarks.userId, user.id), 
            inArray(bookmarks.categoryId, sharedIds)
          )
        : eq(bookmarks.userId, user.id),
      with: {
        category: true,
      },
      orderBy: [desc(bookmarks.createdAt)],
    });

    return NextResponse.json({ bookmarks: userBookmarks, isGuest: false });
  } catch (error) {
    console.error("GET /api/bookmark error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

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
    const { title, url, description, categoryId, categoryName, favicon } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Resolve Category ID (find by ID -> find by Name -> Auto Create)
    let validCategoryId: string | null = null;

    if (categoryId) {
      const existingCategory = await db.query.categories.findFirst({
        where: eq(categories.id, categoryId),
      });
      if (existingCategory && existingCategory.userId === user.id) {
        validCategoryId = existingCategory.id;
      }
    }

    if (!validCategoryId && categoryName) {
      const existingByName = await db.query.categories.findFirst({
        where: and(
          eq(categories.name, categoryName.trim()),
          eq(categories.userId, user.id)
        ),
      });
      if (existingByName) {
        validCategoryId = existingByName.id;
      } else {
        const [createdCat] = await db
          .insert(categories)
          .values({
            name: categoryName.trim(),
            userId: user.id,
          })
          .returning();
        validCategoryId = createdCat.id;
      }
    }

    // Stream & Auto-fetch description if missing (max 30KB)
    let finalDescription = description ? description.trim() : null;
    if (!finalDescription) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        const res = await fetch(formattedUrl, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        clearTimeout(timeoutId);

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          let chunks = "";
          let receivedBytes = 0;
          const maxBytes = 30000;

          while (receivedBytes < maxBytes) {
            const { done, value } = await reader.read();
            if (done || !value) break;
            chunks += new TextDecoder().decode(value);
            receivedBytes += value.byteLength;
            if (chunks.includes("</head>") || chunks.includes("</HEAD>")) {
              reader.cancel();
              break;
            }
          }

          const $ = cheerio.load(chunks);
          const metaDesc =
            $('meta[name="description"]').attr("content") ||
            $('meta[property="og:description"]').attr("content") ||
            $('meta[name="twitter:description"]').attr("content") ||
            null;
          if (metaDesc) {
            finalDescription = metaDesc.trim();
          }
        }
      } catch {
        // Ignore timeout or fetch error
      }
    }

    const [inserted] = await db
      .insert(bookmarks)
      .values({
        title: title.trim(),
        url: formattedUrl,
        description: finalDescription,
        favicon: favicon || null,
        userId: user.id,
        categoryId: validCategoryId,
      })
      .returning();

    const newBookmark = await db.query.bookmarks.findFirst({
      where: eq(bookmarks.id, inserted.id),
      with: {
        category: true,
      },
    });

    return NextResponse.json({ bookmark: newBookmark }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookmark error:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

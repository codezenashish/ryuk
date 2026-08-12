import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ bookmarks: [], isGuest: true });
    }

    const bookmarks = await db.bookmark.findMany({
      where: { userId },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks, isGuest: false });
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
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
      const existingCategory = await db.category.findUnique({
        where: { id: categoryId },
      });
      if (existingCategory) {
        validCategoryId = existingCategory.id;
      }
    }

    if (!validCategoryId && categoryName) {
      const existingByName = await db.category.findFirst({
        where: { name: categoryName.trim(), userId },
      });
      if (existingByName) {
        validCategoryId = existingByName.id;
      } else {
        const createdCat = await db.category.create({
          data: {
            name: categoryName.trim(),
            userId,
          },
        });
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

    const newBookmark = await db.bookmark.create({
      data: {
        title: title.trim(),
        url: formattedUrl,
        description: finalDescription,
        favicon: favicon || null,
        userId,
        categoryId: validCategoryId,
      },
      include: {
        category: true,
        tags: true,
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

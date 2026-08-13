import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, bookmarks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization Bearer header" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7).trim();
    const user = await db.query.users.findFirst({
      where: eq(users.apiKey, apiKey),
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const userBookmarks = await db.query.bookmarks.findMany({
      where: eq(bookmarks.userId, user.id),
      with: { category: true },
      orderBy: [desc(bookmarks.createdAt)],
    });

    return NextResponse.json({
      count: userBookmarks.length,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      bookmarks: userBookmarks,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization Bearer header" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7).trim();
    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 });
    }

    // Rate Limiting Protection (Max 30 POST requests per minute per API key)
    const rateLimit = checkRateLimit(`bm_post_${apiKey}`, 30, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Rate limit exceeded (Max 30 bookmarks/min)." },
        { status: 429 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.apiKey, apiKey),
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const body = await req.json();
    const { title, url, description, favicon } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    // Input Length Validation
    if (title.length > 300 || url.length > 2048) {
      return NextResponse.json(
        { error: "Title (max 300 chars) or URL (max 2048 chars) length limit exceeded." },
        { status: 400 }
      );
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const [newBookmark] = await db
      .insert(bookmarks)
      .values({
        title: title.trim(),
        url: formattedUrl,
        description: description ? description.trim() : null,
        favicon: favicon || null,
        userId: user.id,
      })
      .returning();

    return NextResponse.json(
      {
        bookmark: newBookmark,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to save bookmark" }, { status: 500 });
  }
}

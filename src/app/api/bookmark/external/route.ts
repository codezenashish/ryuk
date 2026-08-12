import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

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
    const user = await db.user.findFirst({ where: { apiKey } });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const bookmarks = await db.bookmark.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
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

    const user = await db.user.findFirst({ where: { apiKey } });

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

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newBookmark = await db.bookmark.create({
      data: {
        title: title.trim(),
        url: formattedUrl,
        description: description ? description.trim() : null,
        favicon: favicon || null,
        userId: user.id,
      },
    });

    return NextResponse.json({ bookmark: newBookmark }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save bookmark" }, { status: 500 });
  }
}

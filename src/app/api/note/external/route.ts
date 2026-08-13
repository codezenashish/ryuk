import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, notes } from "@/db/schema";
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

    const userNotes = await db.query.notes.findMany({
      where: eq(notes.userId, user.id),
      orderBy: [desc(notes.updatedAt)],
    });

    return NextResponse.json({
      count: userNotes.length,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      notes: userNotes,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
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
    const rateLimit = checkRateLimit(`note_post_${apiKey}`, 30, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Rate limit exceeded (Max 30 notes/min)." },
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
    const { title, content, language, isSnippet } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    // Input Length Validation (Max 100KB note content limit)
    if (content.length > 100000) {
      return NextResponse.json(
        { error: "Note content length exceeds 100KB limit." },
        { status: 400 }
      );
    }

    const [newNote] = await db
      .insert(notes)
      .values({
        title: title ? title.trim() : "Untitled Note",
        content: content.trim(),
        language: language || "plaintext",
        isSnippet: Boolean(isSnippet),
        userId: user.id,
      })
      .returning();

    return NextResponse.json(
      {
        note: newNote,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}

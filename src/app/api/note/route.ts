import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ notes: [], isGuest: true });
    }

    const userNotes = await db.query.notes.findMany({
      where: eq(notes.userId, user.id),
      orderBy: [desc(notes.updatedAt)],
    });

    return NextResponse.json({ notes: userNotes, isGuest: false });
  } catch (error) {
    console.error("GET /api/note error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, language, isSnippet } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Note content is required." },
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

    return NextResponse.json({ note: newNote }, { status: 201 });
  } catch (error) {
    console.error("POST /api/note error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ notes: [], isGuest: true });
    }

    const notes = await db.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ notes, isGuest: false });
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
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

    const newNote = await db.note.create({
      data: {
        title: title ? title.trim() : "Untitled Note",
        content: content.trim(),
        language: language || "plaintext",
        isSnippet: Boolean(isSnippet),
        userId,
      },
    });

    return NextResponse.json({ note: newNote }, { status: 201 });
  } catch (error) {
    console.error("POST /api/note error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

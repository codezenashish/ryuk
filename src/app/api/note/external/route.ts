import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

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
    const user = await db.user.findFirst({ where: { apiKey } });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const notes = await db.note.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      count: notes.length,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      notes,
    });
  } catch (error) {
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

    const user = await db.user.findFirst({ where: { apiKey } });
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

    const newNote = await db.note.create({
      data: {
        title: title ? title.trim() : "Untitled Note",
        content: content.trim(),
        language: language || "plaintext",
        isSnippet: Boolean(isSnippet),
        userId: user.id,
      },
    });

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
  } catch (error) {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, language, isSnippet } = body;

    const existing = await db.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    const updatedNote = await db.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(language !== undefined && { language }),
        ...(isSnippet !== undefined && { isSnippet: Boolean(isSnippet) }),
      },
    });

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("PATCH /api/note/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await db.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    await db.note.delete({ where: { id } });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/note/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}

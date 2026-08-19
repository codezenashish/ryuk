import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notes, noteVersions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const user = await getOrCreateDbUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { id, versionId } = await params;

    const existingNote = await db.query.notes.findFirst({
      where: eq(notes.id, id),
    });
    
    if (!existingNote || existingNote.userId !== user.id) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    const versionToRestore = await db.query.noteVersions.findFirst({
      where: and(
        eq(noteVersions.id, versionId),
        eq(noteVersions.noteId, id),
        eq(noteVersions.userId, user.id)
      ),
    });

    if (!versionToRestore) {
      return NextResponse.json(
        { error: "Version not found" },
        { status: 404 }
      );
    }

    // Save current state as a new version before restoring
    await db.insert(noteVersions).values({
      noteId: existingNote.id,
      title: existingNote.title,
      content: existingNote.content,
      language: existingNote.language || "plaintext",
      isSnippet: existingNote.isSnippet,
      userId: user.id,
    });

    // Update note to match the restored version
    const [updatedNote] = await db
      .update(notes)
      .set({
        title: versionToRestore.title,
        content: versionToRestore.content,
        language: versionToRestore.language,
        isSnippet: versionToRestore.isSnippet,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id))
      .returning();

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("POST /api/note/[id]/versions/[versionId]/restore error:", error);
    return NextResponse.json(
      { error: "Failed to restore note version" },
      { status: 500 }
    );
  }
}

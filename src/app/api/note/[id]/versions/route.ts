import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notes, noteVersions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getOrCreateDbUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingNote = await db.query.notes.findFirst({
      where: eq(notes.id, id),
    });
    
    if (!existingNote || existingNote.userId !== user.id) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    const versions = await db.query.noteVersions.findMany({
      where: eq(noteVersions.noteId, id),
      orderBy: [desc(noteVersions.createdAt)],
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("GET /api/note/[id]/versions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch note versions" },
      { status: 500 }
    );
  }
}

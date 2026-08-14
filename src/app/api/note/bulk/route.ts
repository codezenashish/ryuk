import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { action, noteIds, folderId, isPinned, isBookmarked } = body;

    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      return NextResponse.json({ error: "No notes selected." }, { status: 400 });
    }

    if (action === "delete") {
      await db.delete(notes).where(
        and(eq(notes.userId, user.id), inArray(notes.id, noteIds))
      );
      return NextResponse.json({ success: true, count: noteIds.length });
    }

    if (action === "update") {
      await db.update(notes).set({
        ...(folderId !== undefined && { folderId: folderId || null }),
        ...(isPinned !== undefined && { isPinned: Boolean(isPinned) }),
        ...(isBookmarked !== undefined && { isBookmarked: Boolean(isBookmarked) }),
        updatedAt: new Date(),
      }).where(
        and(eq(notes.userId, user.id), inArray(notes.id, noteIds))
      );
      return NextResponse.json({ success: true, count: noteIds.length });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("POST /api/note/bulk error:", error);
    return NextResponse.json({ error: "Bulk action failed" }, { status: 500 });
  }
}

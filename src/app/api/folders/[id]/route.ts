import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { folders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, color } = body;

    const existing = await db.query.folders.findFirst({
      where: eq(folders.id, id),
    });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Folder not found or access denied" }, { status: 404 });
    }

    const [updatedFolder] = await db
      .update(folders)
      .set({
        ...(name !== undefined && { name: name.trim() }),
        ...(color !== undefined && { color }),
        updatedAt: new Date(),
      })
      .where(eq(folders.id, id))
      .returning();

    return NextResponse.json({ folder: updatedFolder });
  } catch (error) {
    console.error("PATCH /api/folders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update folder" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.query.folders.findFirst({
      where: eq(folders.id, id),
    });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Folder not found or access denied" }, { status: 404 });
    }

    await db.delete(folders).where(eq(folders.id, id));

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/folders/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}

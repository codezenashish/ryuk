import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export async function PATCH(
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
    const body = await req.json();
    const { title, url, description, categoryId, favicon } = body;

    // Check ownership
    const existing = await db.query.bookmarks.findFirst({
      where: eq(bookmarks.id, id),
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Bookmark not found or access denied" },
        { status: 404 }
      );
    }

    let formattedUrl = url ? url.trim() : undefined;
    if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    await db
      .update(bookmarks)
      .set({
        ...(title && { title: title.trim() }),
        ...(formattedUrl && { url: formattedUrl }),
        description: description !== undefined ? description : existing.description,
        favicon: favicon !== undefined ? favicon : existing.favicon,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        updatedAt: new Date(),
      })
      .where(eq(bookmarks.id, id));

    const updatedBookmark = await db.query.bookmarks.findFirst({
      where: eq(bookmarks.id, id),
      with: {
        category: true,
      },
    });

    return NextResponse.json({ bookmark: updatedBookmark });
  } catch (error) {
    console.error("PATCH /api/bookmark/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
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

    // Check ownership
    const existing = await db.query.bookmarks.findFirst({
      where: eq(bookmarks.id, id),
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Bookmark not found or access denied" },
        { status: 404 }
      );
    }

    await db.delete(bookmarks).where(eq(bookmarks.id, id));

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/bookmark/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}

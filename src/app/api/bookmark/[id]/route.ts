import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
    const { title, url, description, categoryId, favicon } = body;

    // Check ownership
    const existing = await db.bookmark.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bookmark not found or access denied" },
        { status: 404 }
      );
    }

    let formattedUrl = url ? url.trim() : undefined;
    if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const updatedBookmark = await db.bookmark.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(formattedUrl && { url: formattedUrl }),
        description: description !== undefined ? description : existing.description,
        favicon: favicon !== undefined ? favicon : existing.favicon,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
      },
      include: {
        category: true,
        tags: true,
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

    // Check ownership
    const existing = await db.bookmark.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Bookmark not found or access denied" },
        { status: 404 }
      );
    }

    await db.bookmark.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/bookmark/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}

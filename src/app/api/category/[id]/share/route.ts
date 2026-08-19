import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

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
    const { isShared } = body;

    const existingCategory = await db.query.categories.findFirst({
      where: and(eq(categories.id, id), eq(categories.userId, user.id)),
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found or access denied" },
        { status: 404 }
      );
    }

    const shareToken = isShared ? crypto.randomUUID() : null;

    const [updatedCategory] = await db
      .update(categories)
      .set({
        isShared: Boolean(isShared),
        shareToken,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error("PATCH /api/category/[id]/share error:", error);
    return NextResponse.json(
      { error: "Failed to update category share settings" },
      { status: 500 }
    );
  }
}

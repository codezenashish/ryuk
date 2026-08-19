import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, categoryCollaborators } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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

    // Verify ownership
    const category = await db.query.categories.findFirst({
      where: and(eq(categories.id, id), eq(categories.userId, user.id)),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found or access denied." },
        { status: 403 }
      );
    }

    const collaborators = await db.query.categoryCollaborators.findMany({
      where: eq(categoryCollaborators.categoryId, id),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
      },
    });

    return NextResponse.json({ collaborators }, { status: 200 });
  } catch (error) {
    console.error("GET /api/category/[id]/collaborators error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, categoryCollaborators } from "@/db/schema";
import { eq, asc, or, inArray } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getOrCreateDbUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // First find categories the user is collaborating on
    const sharedCategories = await db
      .select({ categoryId: categoryCollaborators.categoryId })
      .from(categoryCollaborators)
      .where(eq(categoryCollaborators.userId, user.id));

    const sharedIds = sharedCategories.map(sc => sc.categoryId);

    // Fetch owned + shared categories
    const categoryList = await db
      .select()
      .from(categories)
      .where(
        sharedIds.length > 0 
          ? or(eq(categories.userId, user.id), inArray(categories.id, sharedIds))
          : eq(categories.userId, user.id)
      )
      .orderBy(asc(categories.createdAt));

    // Append isCollaborator flag
    const categoriesWithFlag = categoryList.map(cat => ({
      ...cat,
      isCollaborator: cat.userId !== user.id
    }));

    return NextResponse.json({ categories: categoriesWithFlag }, { status: 200 });
  } catch (error) {
    console.error("GET /api/category error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, color, icon } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const [category] = await db
      .insert(categories)
      .values({
        name: name.trim(),
        color: color || "#6366F1",
        icon: icon || "Folder01Icon",
        userId: user.id,
      })
      .returning();

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

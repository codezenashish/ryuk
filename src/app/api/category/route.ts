import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
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

    const categoryList = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, user.id))
      .orderBy(asc(categories.createdAt));

    return NextResponse.json({ categories: categoryList }, { status: 200 });
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

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { folders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ folders: [], isGuest: true });
    }

    const userFolders = await db.query.folders.findMany({
      where: eq(folders.userId, user.id),
      orderBy: [desc(folders.updatedAt)],
    });

    return NextResponse.json({ folders: userFolders, isGuest: false });
  } catch (error) {
    console.error("GET /api/folders error:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDbUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { name, color } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Folder name is required." }, { status: 400 });
    }

    const [newFolder] = await db
      .insert(folders)
      .values({
        name: name.trim(),
        color: color || "#6366F1",
        userId: user.id,
      })
      .returning();

    return NextResponse.json({ folder: newFolder }, { status: 201 });
  } catch (error) {
    console.error("POST /api/folders error:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}

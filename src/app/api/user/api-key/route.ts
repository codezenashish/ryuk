import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrCreateDbUser } from "@/lib/syncUser";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getOrCreateDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ apiKey: user.apiKey || null });
  } catch {
    return NextResponse.json({ error: "Failed to fetch API key" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const user = await getOrCreateDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newApiKey = `ryuk_sk_${randomBytes(24).toString("hex")}`;

    const [updatedUser] = await db
      .update(users)
      .set({ apiKey: newApiKey })
      .where(eq(users.id, user.id))
      .returning({ apiKey: users.apiKey });

    return NextResponse.json({ apiKey: updatedUser.apiKey });
  } catch {
    return NextResponse.json({ error: "Failed to generate API key" }, { status: 500 });
  }
}

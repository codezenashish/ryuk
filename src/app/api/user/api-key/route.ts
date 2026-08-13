import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getOrCreateDbUser } from "@/lib/syncUser";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const user = await getOrCreateDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ apiKey: user.apiKey || null });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch API key" }, { status: 500 });
  }
}

export async function POST(_req: NextRequest) {
  try {
    const user = await getOrCreateDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newApiKey = `ryuk_sk_${randomBytes(24).toString("hex")}`;

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { apiKey: newApiKey },
      select: { apiKey: true },
    });

    return NextResponse.json({ apiKey: updatedUser.apiKey });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate API key" }, { status: 500 });
  }
}

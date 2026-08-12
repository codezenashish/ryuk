import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { apiKey: true },
    });

    return NextResponse.json({ apiKey: user?.apiKey || null });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch API key" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newApiKey = `ryuk_sk_${randomBytes(24).toString("hex")}`;

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { apiKey: newApiKey },
      select: { apiKey: true },
    });

    return NextResponse.json({ apiKey: updatedUser.apiKey });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate API key" }, { status: 500 });
  }
}

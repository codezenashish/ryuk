"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { randomBytes } from "crypto";

async function getAuthenticatedUserId() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

async function generateUniqueApiKey() {
  const prefix = "devnest_sec_";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const apiKey = `${prefix}${randomBytes(24).toString("hex")}`;

    const existingUser = await db.user.findUnique({
      where: { apiKey },
      select: { id: true },
    });

    if (!existingUser) {
      return apiKey;
    }
  }

  throw new Error("Failed to generate unique API key");
}

export async function getApiKeyAction(userId: string) {
  try {
    if (!userId) {
      return { success: false as const, error: "Unauthorized" };
    }

    const authenticatedUserId = await getAuthenticatedUserId();
    if (userId !== authenticatedUserId) {
      return { success: false as const, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { apiKey: true },
    });

    return { success: true as const, apiKey: user?.apiKey ?? null };
  } catch (error) {
    console.error("API Key Fetch Error:", error);
    return { success: false as const, error: "Failed to fetch API key" };
  }
}

export async function generateApiKeyAction(userId: string) {
  try {
    if (!userId) {
      return { success: false as const, error: "Unauthorized" };
    }

    const authenticatedUserId = await getAuthenticatedUserId();
    if (userId !== authenticatedUserId) {
      return { success: false as const, error: "Unauthorized" };
    }

    const newApiKey = await generateUniqueApiKey();

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { apiKey: newApiKey },
      select: { apiKey: true },
    });

    return { success: true as const, apiKey: updatedUser.apiKey };
  } catch (error) {
    console.error("API Key Gen Error:", error);
    return { success: false as const, error: "Failed to generate key" };
  }
}

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { randomBytes } from "crypto";

/**
 * Unified User Sync Helper for Clerk & Prisma PostgreSQL DB.
 * Ensures the logged-in Clerk user exists in the PostgreSQL User table,
 * automatically creating or updating the record with an API key if needed.
 */
export async function getOrCreateDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  // 1. Return existing DB user if already synced by Clerk userId
  const existingById = await db.user.findUnique({ where: { id: userId } });
  if (existingById) {
    if (!existingById.apiKey) {
      const apiKey = `ryuk_sk_${randomBytes(24).toString("hex")}`;
      return db.user.update({
        where: { id: userId },
        data: { apiKey },
      });
    }
    return existingById;
  }

  // 2. Fetch active Clerk user details
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.primaryEmailAddress?.emailAddress;
  if (!email) return null;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    email;
  const image = clerkUser.imageUrl || null;
  const apiKey = `ryuk_sk_${randomBytes(24).toString("hex")}`;

  // 3. Safely adopt existing legacy user by email if present
  const legacyUser = await db.user.findUnique({ where: { email } });
  if (legacyUser) {
    return db.user.update({
      where: { email },
      data: {
        id: userId,
        name,
        image,
        apiKey: legacyUser.apiKey || apiKey,
      },
    });
  }

  // 4. Create new user in PostgreSQL database
  return db.user.create({
    data: {
      id: userId,
      name,
      email,
      image,
      apiKey,
    },
  });
}

/**
 * Helper to require active DB User ID or return null if unauthenticated.
 */
export async function requireCurrentUserId(): Promise<string | null> {
  const user = await getOrCreateDbUser();
  return user?.id ?? null;
}

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

/**
 * Returns a local user tied to the active Clerk identity. Existing Better Auth
 * users are safely adopted by their verified email so their saved data remains
 * attached after the migration.
 */
export async function getCurrentDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.primaryEmailAddress?.emailAddress;
  if (!email) return null;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    email;
  const image = clerkUser.imageUrl || null;

  const existingById = await db.user.findUnique({ where: { id: userId } });
  if (existingById) return existingById;

  const legacyUser = await db.user.findUnique({ where: { email } });
  if (legacyUser) {
    return db.user.update({
      where: { email },
      data: { id: userId, name, image },
    });
  }

  return db.user.create({
    data: { id: userId, name, email, image },
  });
}

export async function requireCurrentUserId() {
  const user = await getCurrentDbUser();
  return user?.id ?? null;
}

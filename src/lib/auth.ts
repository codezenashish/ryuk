import { auth as clerkAuth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export type SessionPayload = {
  user: SessionUser | null;
} | null;

async function getClerkSessionUser(): Promise<SessionUser | null> {
  const { userId } = await clerkAuth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.primaryEmailAddress?.emailAddress ?? null;
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    email ||
    "User";

  const image = clerkUser.imageUrl || null;

  const existingDbUser = await db.user.findUnique({ where: { id: userId } });
  if (existingDbUser) {
    return {
      id: existingDbUser.id,
      email: existingDbUser.email,
      name: existingDbUser.name,
      image: existingDbUser.image,
    };
  }

  return {
    id: userId,
    email,
    name,
    image,
  };
}

export const auth = {
  api: {
    async getSession(
      _context: { headers?: Headers | Promise<Headers> } = {}
    ): Promise<SessionPayload> {
      const user = await getClerkSessionUser();
      if (!user) return null;

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      };
    },
  },
};

export default auth;

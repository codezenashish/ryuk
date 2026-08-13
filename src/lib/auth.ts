import { getCurrentDbUser } from "@/lib/clerk";

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
  const dbUser = await getCurrentDbUser();
  if (!dbUser) return null;

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    image: dbUser.image,
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

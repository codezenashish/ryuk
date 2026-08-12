import { createAuthClient } from "better-auth/react";

// Let Better Auth use the current browser origin. This keeps auth requests on
// the active app instance in local development, preview deployments, and prod.
export const authClient = createAuthClient();

export const { signIn, signUp, useSession, signOut, updateUser } = authClient;

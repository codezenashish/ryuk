"use client";

import { useSession as useClerkSession, useClerk } from "@clerk/nextjs";

export function useSession() {
  const { isLoaded, session } = useClerkSession();

  const user = session?.user ?? null;
  const data =
    isLoaded && user
      ? {
          user: {
            id: user.id,
            name: user.fullName || user.firstName || "User",
            email: user.primaryEmailAddress?.emailAddress ?? "",
            image: user.imageUrl ?? null,
          },
        }
      : null;

  return {
    data,
    isPending: !isLoaded,
  };
}

export async function updateUser(_payload: { name?: string; image?: string } = {}) {
  return { success: true };
}

/**
 * Sign out using Clerk. Must be called from within a component that
 * has access to the ClerkProvider context (i.e. use the hook version
 * `useSignOut` below for components, or call `clerk.signOut()` directly).
 */
export { useClerk };

export async function signOut(options?: {
  fetchOptions?: { onSuccess?: () => void };
}) {
  // This is a fallback for non-hook contexts.
  // For proper Clerk sign-out, use the `useSignOut` hook below.
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
  options?.fetchOptions?.onSuccess?.();
}

/**
 * Hook that returns a proper Clerk-backed signOut function.
 * Use this inside React components instead of the plain `signOut` export.
 */
export function useSignOut() {
  const { signOut: clerkSignOut } = useClerk();

  return async (options?: { fetchOptions?: { onSuccess?: () => void } }) => {
    await clerkSignOut({ redirectUrl: "/" });
    options?.fetchOptions?.onSuccess?.();
  };
}

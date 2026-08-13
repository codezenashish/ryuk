"use client";

import { useSession as useClerkSession } from "@clerk/nextjs";

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

export async function signOut(options?: {
  fetchOptions?: { onSuccess?: () => void };
}) {
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }

  options?.fetchOptions?.onSuccess?.();
}

"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function getRegisteredUserCountAction() {
  try {
    const client = await clerkClient();
    const count = await client.users.getCount();
    
    return { success: true as const, count };
  } catch (error) {
    console.error("Failed to fetch user count from Clerk:", error);
    return { success: false as const, error: "Failed to fetch user count" };
  }
}

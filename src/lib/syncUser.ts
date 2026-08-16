import { createServerSupabaseClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users } from "@/db/schema";

import { cache } from "react";
import { eq } from "drizzle-orm";

export const getOrCreateDbUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const supabaseUser = session?.user;

  if (error || !supabaseUser) {
    return null;
  }

  // Check if user already exists to avoid expensive UPSERT
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, supabaseUser.id),
  });

  if (existingUser) {
    return existingUser;
  }

  const name =
    supabaseUser.user_metadata?.full_name ||
    supabaseUser.user_metadata?.name ||
    supabaseUser.email?.split("@")[0] ||
    "User";
  const image = supabaseUser.user_metadata?.avatar_url || null;
  const email = supabaseUser.email || "";

  const [dbUser] = await db
    .insert(users)
    .values({
      id: supabaseUser.id,
      email,
      name,
      image,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email,
        name,
        image,
      },
    })
    .returning();

  return dbUser;
});

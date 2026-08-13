import { createServerSupabaseClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function getOrCreateDbUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    return null;
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
}

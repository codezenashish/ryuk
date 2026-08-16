import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getBookmarksAction } from "@/app/actions/bookmarks";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // Middleware will handle redirection
  }

  const queryClient = new QueryClient();

  // Prefetch bookmarks and categories in parallel directly from the DB on the server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["bookmarks", user.id],
      queryFn: () => getBookmarksAction(user.id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const categoryList = await db
          .select()
          .from(categories)
          .where(eq(categories.userId, user.id))
          .orderBy(asc(categories.createdAt));
        return categoryList;
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient userId={user.id} />
    </HydrationBoundary>
  );
}

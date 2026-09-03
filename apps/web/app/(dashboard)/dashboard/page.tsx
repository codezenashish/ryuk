import { redirect } from "next/navigation";
import { getUser } from "@ryuk/auth/server";
import { getBookmarksAction } from "../../../src/features/bookmarks/actions";
import { BookmarkForm } from "../../../src/features/bookmarks/components/bookmark-form";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const initialBookmarks = await getBookmarksAction();

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <h1 className="text-xl font-bold tracking-tight">Bookmarks</h1>
          <p className="text-xs text-zinc-400">Save and manage your links</p>
        </div>

        <BookmarkForm />
        {/* <BookmarkList initialBookmarks={initialBookmarks} /> */}
      </div>
    </main>
  );
}

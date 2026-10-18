import { redirect } from "next/navigation";
import { getUser } from "@ryuk/auth/server";
import { getBookmarksAction } from "@/features/bookmarks/actions";
import { BookmarkForm } from "@/features/bookmarks/components/bookmark-form";
import { BookmarkCard } from "@/features/bookmarks/components/bookmark-card";

export default async function BookmarksPage() {
  const user = await getUser();
  const initialBookmarks = user ? await getBookmarksAction() : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Bookmarks</h1>
        <p className="text-xs text-muted-foreground">Save and manage your links</p>
      </div>

      <BookmarkForm />

      <div className="space-y-3">
        {initialBookmarks && initialBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {initialBookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
            No bookmarks saved yet. Add your first link above!
          </div>
        )}
      </div>
    </div>
  );
}

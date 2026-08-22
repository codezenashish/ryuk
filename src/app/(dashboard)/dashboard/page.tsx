"use client";

import { useBookmarks } from "@/hooks/use-bookmarks";
import { useUser } from "@/providers/auth-provider";
import { BookmarkGrid } from "@/features/bookmarks/components/bookmark-grid";
import { Pin } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const { bookmarks, isLoading, updateBookmark } = useBookmarks(user?.id);

  const pinnedBookmarks = bookmarks.filter((b) => b.isPinned);

  const handlePinBookmark = (id: string) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    if (bookmark) {
      updateBookmark({ id, input: { isPinned: !bookmark.isPinned } });
    }
  };

  const handleInlineEdit = (id: string, newTitle: string) => {
    updateBookmark({ id, input: { title: newTitle } });
  };

  return (
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-sans font-semibold text-foreground tracking-tight">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here is an overview of your activity.</p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <Pin className="h-4 w-4" fill="currentColor" />
            <h2 className="text-lg font-semibold tracking-tight">Quick Access</h2>
          </div>
          <Link href="/bookmarks" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            View all
          </Link>
        </div>

        <BookmarkGrid 
          bookmarks={pinnedBookmarks} 
          isLoading={isLoading && bookmarks.length === 0} 
          onPin={handlePinBookmark}
          onInlineEdit={handleInlineEdit}
          emptyTitle="No pinned bookmarks"
          emptyDescription="Star your most important bookmarks to see them here for quick access."
        />
      </section>
    </div>
  );
}
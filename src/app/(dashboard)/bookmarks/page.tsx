"use client";

import { authClient } from "@/lib/auth-client";
import BookmarkEmptyState from "@/features/bookmarks/components/bookmark-empty-state";
import BookmarkLoadingState from "@/features/bookmarks/components/bookmark-loading-state";
import BookmarkView from "@/features/bookmarks/components/bookmark-view";
import { useBookmarksQuery } from "@/features/bookmarks/hook/use-bookmark-queries";

export default function BookmarksPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const userId = session?.user?.id;
  const { data: categories = [], isLoading } = useBookmarksQuery(userId);

  if (isSessionPending || isLoading) {
    return <BookmarkLoadingState />;
  }

  if (categories.length === 0) {
    return (
      <BookmarkEmptyState
        title="No bookmarks yet"
        description="Add your first link from the toolbar above to get started."
        ctaLabel="Add bookmark"
      />
    );
  }

  return <BookmarkView categories={categories} userId={userId ?? ""} />;
}

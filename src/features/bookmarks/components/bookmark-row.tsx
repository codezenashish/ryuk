"use client";

import { BookmarkItem, BookmarkCard } from "./bookmark-card";

interface BookmarkRowProps {
  bookmarks: BookmarkItem[];
  onDelete: (bookmark: BookmarkItem | string) => void;
  isDeleting?: boolean;
}

export function BookmarkRow({
  bookmarks,
  onDelete,
  isDeleting = false,
}: BookmarkRowProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          isDeleting={isDeleting}
          layoutMode="list"
        />
      ))}
    </div>
  );
}

export default BookmarkRow;

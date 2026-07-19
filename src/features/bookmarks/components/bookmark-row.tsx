import type { BookmarkItem } from "../hook/use-bookmark-queries";
import BookmarkCard from "./bookmark-card";

interface BookmarkRowProps {
  bookmarks: BookmarkItem[];
  onDelete: (bookmark: BookmarkItem) => void;
  isDeleting?: boolean;
}

/** The compact row view within one category. */
export default function BookmarkRow({
  bookmarks,
  onDelete,
  isDeleting,
}: BookmarkRowProps) {
  return (
    <div className="space-y-2">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}

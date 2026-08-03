import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type {
  BookmarkItem,
  CategoryWithBookmarks,
} from "../hook/use-bookmark-queries";
import { getIconComponent } from "../utils/category-icon-registry";
import BookmarkCard from "./bookmark-card";
import BookmarkRow from "./bookmark-row";

interface BookmarkListProps {
  categories: CategoryWithBookmarks[];
  viewType: "grid" | "list";
  onDelete: (bookmark: BookmarkItem) => void;
  isDeleting?: boolean;
}

/** Renders category sections and selects the requested bookmark layout. */
export default function BookmarkList({
  categories,
  viewType,
  onDelete,
  isDeleting,
}: BookmarkListProps) {
  return (
    <div
      className={cn(viewType === "list" ? "flex flex-col gap-8" : "space-y-8")}
    >
      {categories.map((category) => {
        const categoryIcon = getIconComponent(category.icon) || Folder01Icon;

        return (
          <section key={category.id}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition-colors">
              <HugeiconsIcon
                icon={categoryIcon}
                size={16}
                className="text-zinc-500 dark:text-zinc-400 transition-colors"
              />
              {category.name}
              <span className="rounded-full bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 text-xs font-normal text-zinc-500 dark:text-zinc-400 transition-colors">
                {category.bookmarks.length}
              </span>
            </h2>
            {viewType === "grid" ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {category.bookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            ) : (
              <BookmarkRow
                bookmarks={category.bookmarks}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}

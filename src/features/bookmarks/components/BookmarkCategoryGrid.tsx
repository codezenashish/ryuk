"use client";

import { useState } from "react";
import {
  RiEditLine,
  RiPushpinLine,
  RiPushpinFill,
  RiCheckLine,
} from "react-icons/ri";

import { getIconComponent } from "../utils/category-icon-registry";
import { useDeleteBookmarkMutation } from "../hooks/use-bookmark-queries";
import BookmarkCard from "./BookmarkCard";
import type { BookmarkItem } from "../hooks/use-bookmark-queries";

interface CategoryGridSectionProps {
  id: string;
  initialName: string;
  initialIcon: string;
  bookmarks: BookmarkItem[];
  viewMode: "grid" | "list";
}

export default function CategoryGridSection({
  id: _id,
  initialName,
  initialIcon,
  bookmarks,
  viewMode,
}: CategoryGridSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [categoryName, setCategoryName] = useState(initialName);

  const deleteMutation = useDeleteBookmarkMutation();

  const CategoryHeaderIcon = getIconComponent(initialIcon);

  const handleDelete = (bookmarkId: number) => {
    deleteMutation.mutate({
      bookmarkId,
      userId: "mock-user-id-123", // TODO: Replace with actual user ID from auth context
    });
  };

  if (bookmarks.length === 0) return null;

  return (
    <div className="mt-8 w-full select-none">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 border border-white/10">
            <CategoryHeaderIcon className="h-3.5 w-3.5 text-zinc-400" />
          </div>

          {isEditing ? (
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="rounded border-dashed border-white/20 bg-white/5 px-2 py-0.5 text-sm font-semibold tracking-wide text-white outline-none focus:border-zinc-500"
              autoFocus
            />
          ) : (
            <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
              {categoryName}
            </h2>
          )}

          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
            {bookmarks.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 md:opacity-100">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`cursor-pointer rounded-lg border p-1.5 transition-colors active:scale-95 ${
              isPinned
                ? "border-zinc-500/30 bg-zinc-500/10 text-zinc-300"
                : "border-transparent bg-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
            }`}
          >
            {isPinned ? (
              <RiPushpinFill size={14} />
            ) : (
              <RiPushpinLine size={14} />
            )}
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`cursor-pointer rounded-lg border p-1.5 transition-colors active:scale-95 ${
              isEditing
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-transparent bg-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
            }`}
          >
            {isEditing ? <RiCheckLine size={14} /> : <RiEditLine size={14} />}
          </button>
        </div>
      </div>

      <div
        className={`w-full transition-all duration-300 ${
          isEditing
            ? "rounded-2xl border border-dashed border-zinc-500/50 p-4"
            : ""
        }`}
      >
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                categoryName={categoryName}
                viewMode="grid"
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                categoryName={categoryName}
                viewMode="list"
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

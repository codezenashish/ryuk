"use client";

import { useState } from "react";
import {
  RiEditLine,
  RiPushpinLine,
  RiPushpinFill,
  RiCloseLine,
  RiCheckLine,
} from "react-icons/ri";

import { getIconComponent } from "../utils/icon-mapper";
import { useDeleteBookmarkMutation } from "../hooks/use-bookmarks";

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  favicon?: string | null;
}

interface CategoryGridSectionProps {
  id: string;
  initialName: string;
  initialIcon: string;
  bookmarks: BookmarkItem[];
}

export default function CategoryGridSection({
  id: _id,
  initialName,
  initialIcon,
  bookmarks,
}: CategoryGridSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [categoryName, setCategoryName] = useState(initialName);

  const deleteMutation = useDeleteBookmarkMutation();

  const CategoryHeaderIcon = getIconComponent(initialIcon);

  const handleDelete = (bookmarkId: number) => {
    deleteMutation.mutate({
      bookmarkId,
      userId: "mock-user-id-123",
    });
  };

  return (
    <div className="mt-6 w-full max-w-7xl select-none">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <CategoryHeaderIcon className="h-4 w-4 shrink-0 text-zinc-400" />

          {isEditing ? (
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="rounded border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 font-mono text-xs font-bold tracking-widest text-white outline-none focus:border-indigo-500"
              autoFocus
            />
          ) : (
            <h2 className="font-mono text-xs font-bold tracking-widest text-zinc-400">
              {categoryName}
            </h2>
          )}

          <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-500">
            {bookmarks.length} Total
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`cursor-pointer rounded-lg border p-1.5 transition-colors active:scale-95 ${
              isPinned
                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-white"
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
                : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:border-white/12 hover:text-white"
            }`}
          >
            {isEditing ? <RiCheckLine size={14} /> : <RiEditLine size={14} />}
          </button>
        </div>
      </div>

      <div
        className={`w-full rounded-2xl p-2 transition-all duration-300 ${
          isEditing
            ? "border border-indigo-500/30 bg-indigo-500/[0.01]"
            : "border border-transparent bg-transparent"
        }`}
        style={{
          boxShadow: isEditing
            ? "inset 0 0 30px rgba(99, 102, 241, 0.06), inset 0 0 15px rgba(99, 102, 241, 0.04)"
            : "inset 0 0 24px rgba(99, 102, 241, 0.03), inset 0 0 12px rgba(99, 102, 241, 0.02)",
        }}
      >
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
          {bookmarks.map((bookmark) => {
            return (
              <div
                key={bookmark.id}
                className="group relative flex h-20 w-full flex-col items-center justify-center overflow-visible rounded-xl border border-white/[0.04] bg-white/[0.01] text-zinc-500 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.03]"
              >
                {isEditing && (
                  <button
                    onClick={() => handleDelete(bookmark.id)}
                    className="animate-in fade-in zoom-in-75 absolute -top-1 -right-1 z-30 cursor-pointer rounded-md border border-white/10 bg-zinc-900 p-0.5 text-zinc-400 transition-colors duration-150 hover:border-red-500/30 hover:text-red-400"
                  >
                    <RiCloseLine size={12} />
                  </button>
                )}

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={isEditing ? undefined : bookmark.url}
                  className={`flex h-full w-full flex-col items-center justify-center rounded-xl p-2 ${
                    isEditing
                      ? "pointer-events-none opacity-40"
                      : "cursor-pointer"
                  }`}
                >
                  {bookmark.favicon ? (
                    <img
                      src={bookmark.favicon}
                      alt={bookmark.title}
                      className="h-6 w-6 rounded object-contain transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://avatar.vercel.sh/${new URL(bookmark.url).hostname}`;
                      }}
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-400">
                      {bookmark.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </a>

                {!isEditing && (
                  <div className="pointer-events-none absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 scale-95 rounded-md border border-white/[0.08] bg-zinc-950 px-2 py-1 font-mono text-[10px] font-medium whitespace-nowrap text-zinc-300 opacity-0 shadow-xl transition-all duration-200 group-hover:-bottom-10 group-hover:scale-100 group-hover:opacity-100">
                    {bookmark.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
    <div className="w-full max-w-7xl mt-6 select-none">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <CategoryHeaderIcon className="h-4 w-4 text-zinc-400 shrink-0" />
          
          {isEditing ? (
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="text-xs font-bold uppercase tracking-widest text-white font-mono bg-white/[0.04] border border-white/[0.1] rounded px-2 py-0.5 outline-none focus:border-indigo-500"
              autoFocus
            />
          ) : (
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
              {categoryName}
            </h2>
          )}

          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border border-white/[0.06] bg-white/[0.02] text-zinc-500">
            {bookmarks.length} Total
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer active:scale-95 ${
              isPinned
                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-white"
            }`}
          >
            {isPinned ? <RiPushpinFill size={14} /> : <RiPushpinLine size={14} />}
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer active:scale-95 ${
              isEditing
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-white hover:border-white/12"
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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {bookmarks.map((bookmark) => {
            return (
              <div
                key={bookmark.id}
                className="group relative flex flex-col items-center justify-center h-20 w-full rounded-xl border border-white/[0.04] bg-white/[0.01] text-zinc-500 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.03] overflow-visible"
              >
                {isEditing && (
                  <button
                    onClick={() => handleDelete(bookmark.id)}
                    className="absolute -top-1 -right-1 z-30 p-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer animate-in fade-in zoom-in-75 duration-150"
                  >
                    <RiCloseLine size={12} />
                  </button>
                )}

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={isEditing ? undefined : bookmark.url}
                  className={`w-full h-full flex flex-col items-center justify-center rounded-xl p-2 ${
                    isEditing ? "pointer-events-none opacity-40" : "cursor-pointer"
                  }`}
                >
                  {bookmark.favicon ? (
                    <img
                      src={bookmark.favicon}
                      alt={bookmark.title}
                      className="w-6 h-6 object-contain rounded transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://avatar.vercel.sh/${new URL(bookmark.url).hostname}`;
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                      {bookmark.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </a>

                {!isEditing && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-95 opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:-bottom-10 z-20 whitespace-nowrap px-2 py-1 rounded-md border border-white/[0.08] bg-zinc-950 text-[10px] font-medium font-mono text-zinc-300 shadow-xl">
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
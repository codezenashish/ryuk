import type { Bookmark } from "@ryuk/db";
import Image from "next/image";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-3 border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-600 transition"
    >
      {bookmark.faviconUrl && (
        <Image
          src={bookmark.faviconUrl}
          alt=""
          className="w-4 h-4 mt-0.5 rounded-sm shrink-0"
        />
      )}
      <div className="overflow-hidden">
        <h3 className="text-sm font-medium text-white group-hover:underline truncate">
          {bookmark.title}
        </h3>
        <p className="text-xs text-zinc-400 truncate mt-0.5">{bookmark.url}</p>
      </div>
    </a>
  );
}

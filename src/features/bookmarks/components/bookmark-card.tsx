"use client";

/* eslint-disable @next/next/no-img-element */

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  ExternalLinkIcon,
  Folder01Icon,
} from "@hugeicons/core-free-icons";
import type { BookmarkItem } from "../hook/use-bookmark-queries";

interface BookmarkCardProps {
  bookmark: BookmarkItem;
  onDelete: (bookmark: BookmarkItem) => void;
  isDeleting?: boolean;
}

export default function BookmarkCard({
  bookmark,
  onDelete,
  isDeleting = false,
}: BookmarkCardProps) {
  const content = (
    <>
      {bookmark.favicon ? (
        <img
          src={bookmark.favicon}
          alt=""
          className="h-5 w-5 shrink-0 rounded object-contain"
        />
      ) : (
        <HugeiconsIcon
          icon={Folder01Icon}
          size={18}
          className="shrink-0 text-zinc-400 dark:text-zinc-500"
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-colors">
          {bookmark.title}
        </span>
        <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400 transition-colors">
          {bookmark.url}
        </span>
      </span>
    </>
  );

  return (
    <article className="group flex min-w-0 items-center gap-3 rounded-xl border border-zinc-200/80 bg-white p-3 shadow-xs transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50/80 dark:border-zinc-900 dark:bg-zinc-900/20 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/50">
      {bookmark.url ? (
        <a
          href={bookmark.url}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          {content}
        </a>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{content}</div>
      )}
      {bookmark.url && (
        <a
          href={bookmark.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${bookmark.title}`}
          className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
        >
          <HugeiconsIcon icon={ExternalLinkIcon} size={15} />
        </a>
      )}
      <button
        type="button"
        aria-label={`Delete ${bookmark.title}`}
        onClick={() => onDelete(bookmark)}
        disabled={isDeleting}
        className="text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors disabled:opacity-40"
      >
        <HugeiconsIcon icon={Delete02Icon} size={15} />
      </button>
    </article>
  );
}

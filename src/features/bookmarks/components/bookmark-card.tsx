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
          className="shrink-0 text-stone-400 dark:text-stone-500"
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-stone-900 dark:text-stone-200 transition-colors">
          {bookmark.title}
        </span>
        <span className="block truncate text-xs text-stone-500 dark:text-stone-400 transition-colors">
          {bookmark.url}
        </span>
      </span>
    </>
  );

  return (
    <article className="group flex min-w-0 items-center gap-3 rounded-xl border border-stone-200/80 bg-white p-3 shadow-xs transition-all duration-300 hover:border-stone-300 hover:bg-stone-50/80 hover:shadow-md hover:shadow-stone-200/30 dark:border-white/6 dark:bg-[#111110] dark:hover:border-white/12 dark:hover:bg-white/4 dark:hover:shadow-xl dark:hover:shadow-black/20">
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
          className="text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300 transition-colors"
        >
          <HugeiconsIcon icon={ExternalLinkIcon} size={15} />
        </a>
      )}
      <button
        type="button"
        aria-label={`Delete ${bookmark.title}`}
        onClick={() => onDelete(bookmark)}
        disabled={isDeleting}
        className="text-stone-400 hover:text-red-500 dark:text-stone-500 dark:hover:text-red-400 transition-colors disabled:opacity-40"
      >
        <HugeiconsIcon icon={Delete02Icon} size={15} />
      </button>
    </article>
  );
}

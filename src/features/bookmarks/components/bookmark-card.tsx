"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GlobalIcon,
  ExternalLinkIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

export interface BookmarkTag {
  id: string;
  name: string;
}

export interface BookmarkCategory {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  favicon?: string | null;
  category?: BookmarkCategory | null;
  tags?: BookmarkTag[];
  createdAt?: string | Date;
  isPinned?: boolean;
}

interface BookmarkCardProps {
  bookmark: BookmarkItem;
  onEdit?: (bookmark: BookmarkItem) => void;
  onDelete?: (bookmark: BookmarkItem | string) => void;
  onPin?: (id: string) => void;
  isDeleting?: boolean;
  layoutMode?: "grid" | "list";
}

export function BookmarkCard({
  bookmark,
  onDelete,
  isDeleting = false,
}: BookmarkCardProps) {
  const [imgError, setImgError] = useState(false);

  // Extract hostname domain for fallback favicon
  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const domain = getDomain(bookmark.url);
  const faviconUrl =
    bookmark.favicon ||
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(bookmark);
    }
  };

  const content = (
    <>
      {faviconUrl && !imgError ? (
        <Image
          src={faviconUrl}
          alt=""
          width={20}
          height={20}
          unoptimized
          className="h-5 w-5 shrink-0 rounded object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <HugeiconsIcon
          icon={GlobalIcon}
          size={18}
          className="shrink-0 text-ink-3"
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink font-sans tracking-tight transition-colors">
          {bookmark.title}
        </span>
        <span className="block truncate text-xs text-ink-3 font-mono transition-colors">
          {bookmark.url}
        </span>
      </span>
    </>
  );

  return (
    <article className="group flex min-w-0 items-center gap-3 rounded-xl border border-line-2 bg-paper-card p-3 shadow-xs transition-all duration-200 hover:border-line-strong hover:bg-paper-3 hover:shadow-md">
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
          className="text-ink-4 hover:text-ink transition-colors p-1"
        >
          <HugeiconsIcon icon={ExternalLinkIcon} size={15} />
        </a>
      )}
      {onDelete && (
        <button
          type="button"
          aria-label={`Delete ${bookmark.title}`}
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-ink-4 hover:text-rose-400 transition-colors disabled:opacity-40 cursor-pointer p-1"
        >
          <HugeiconsIcon icon={Delete02Icon} size={15} />
        </button>
      )}
    </article>
  );
}

export default BookmarkCard;
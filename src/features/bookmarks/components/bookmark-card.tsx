"use client";

import { useState } from "react";
// import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GlobalIcon,
  ExternalLinkIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { Star } from "lucide-react";
import { BookmarkContextMenu } from "./bookmark-context-menu";

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
  userId?: string;
  categoryId?: string | null;
  category?: BookmarkCategory | null;
  tags?: BookmarkTag[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isPinned?: boolean;
}

interface BookmarkCardProps {
  bookmark: BookmarkItem;
  onEdit?: (bookmark: BookmarkItem) => void;
  onInlineEdit?: (id: string, newTitle: string) => void;
  onDelete?: (bookmark: BookmarkItem | string) => void;
  onPin?: (id: string) => void;
  isDeleting?: boolean;
  layoutMode?: "grid" | "list";
  isSelected?: boolean;
  onToggleSelect?: (id: string, e: React.MouseEvent) => void;
  selectionMode?: boolean;
}

export function BookmarkCard({
  bookmark,
  // onEdit,
  onInlineEdit,
  onDelete,
  onPin,
  isDeleting = false,
  isSelected = false,
  onToggleSelect,
  selectionMode = false,
}: BookmarkCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inlineTitle, setInlineTitle] = useState(bookmark.title);

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

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onDelete) {
      onDelete(bookmark);
    }
  };

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPin) {
      onPin(bookmark.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (onInlineEdit && inlineTitle.trim() !== bookmark.title) {
        onInlineEdit(bookmark.id, inlineTitle.trim());
      }
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setInlineTitle(bookmark.title);
      setIsEditing(false);
    }
  };

  const content = (
    <>
      <div className="relative">
        {faviconUrl && !imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={faviconUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-line/50 transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper-3 ring-1 ring-line/50 transition-transform group-hover:scale-105">
            <HugeiconsIcon icon={GlobalIcon} size={20} className="text-ink-3" />
          </div>
        )}
        
        {/* Checkbox for Selection Mode */}
        {(selectionMode || isSelected) && (
          <div 
            className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded bg-paper-card ring-1 ring-line"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onToggleSelect) onToggleSelect(bookmark.id, e);
            }}
          >
            <input 
              type="checkbox" 
              checked={isSelected}
              readOnly
              className="h-3.5 w-3.5 cursor-pointer rounded-sm border-line text-ink focus:ring-ink"
            />
          </div>
        )}
      </div>
      <span className="min-w-0 flex-1">
        {isEditing ? (
          <input
            autoFocus
            value={inlineTitle}
            onChange={(e) => setInlineTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (onInlineEdit && inlineTitle.trim() !== bookmark.title) {
                onInlineEdit(bookmark.id, inlineTitle.trim());
              }
              setIsEditing(false);
            }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="block w-full text-sm font-medium text-ink bg-transparent border-b border-ink/20 focus:border-ink focus:outline-none transition-colors px-0 py-0.5"
          />
        ) : (
          <span className="block truncate text-sm font-medium text-ink font-sans tracking-tight transition-colors">
            {bookmark.title}
          </span>
        )}
        <span className="block truncate text-xs text-ink-3 font-mono transition-colors">
          {bookmark.url}
        </span>
      </span>
    </>
  );

  return (
    <BookmarkContextMenu
      bookmark={bookmark}
      onEditInline={() => setIsEditing(true)}
      onDelete={handleDelete}
    >
      <article 
        className={`group flex min-w-0 items-center gap-3 rounded-xl border p-3 shadow-xs transition-all duration-200 hover:shadow-md relative ${
          isSelected 
            ? "border-ink/50 bg-ink/5 ring-1 ring-ink/20" 
            : "border-line-2 bg-paper-card hover:border-line-strong hover:bg-paper-3"
        }`}
        onMouseEnter={() => {
          // Optional: show checkbox on hover if not in selection mode
        }}
      >
        {/* Checkbox Overlay on hover (if not in selection mode and not selected) */}
        {!selectionMode && !isSelected && onToggleSelect && (
          <div 
            className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded bg-paper-card ring-1 ring-line opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSelect(bookmark.id, e);
            }}
          >
            <input 
              type="checkbox" 
              checked={false}
              readOnly
              className="h-3.5 w-3.5 cursor-pointer rounded-sm border-line"
            />
          </div>
        )}

        {bookmark.url && !isEditing ? (
          <a
            href={bookmark.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (selectionMode) {
                e.preventDefault();
                if (onToggleSelect) onToggleSelect(bookmark.id, e);
              }
            }}
            className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer"
          >
            {content}
          </a>
        ) : (
          <div 
            className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer"
            onClick={(e) => {
              if (selectionMode && onToggleSelect) {
                onToggleSelect(bookmark.id, e);
              }
            }}
          >
            {content}
          </div>
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
        {onPin && (
          <button
            type="button"
            aria-label={bookmark.isPinned ? `Unpin ${bookmark.title}` : `Pin ${bookmark.title}`}
            onClick={handlePin}
            className={`transition-colors p-1 cursor-pointer ${
              bookmark.isPinned 
                ? "text-yellow-500 hover:text-yellow-600" 
                : "text-ink-4 hover:text-ink"
            }`}
          >
            <Star className="h-4 w-4" fill={bookmark.isPinned ? "currentColor" : "none"} />
          </button>
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
    </BookmarkContextMenu>
  );
}

export default BookmarkCard;
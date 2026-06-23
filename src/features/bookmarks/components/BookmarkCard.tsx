"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Pencil,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";
import type { BookmarkItem } from "../hooks/use-bookmark-queries";

interface BookmarkCardProps {
  bookmark: BookmarkItem;
  categoryName: string;
  viewMode: "grid" | "list";
  onDelete: (id: number) => void;
  onEdit?: (id: number) => void;
}

export default function BookmarkCard({
  bookmark,
  categoryName,
  viewMode,
  onDelete,
  onEdit,
}: BookmarkCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const domain = bookmark.url ? new URL(bookmark.url).hostname : "No URL";
  const formattedDate = new Date(bookmark.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmark.url) {
      navigator.clipboard.writeText(bookmark.url);
    }
    setIsMenuOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(bookmark.id);
    setIsMenuOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(bookmark.id);
    setIsMenuOpen(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  if (viewMode === "list") {
    return (
      <motion.a
        href={bookmark.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.005 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsMenuOpen(false);
        }}
        className="group relative flex items-center gap-4 rounded-xl border border-white/5 bg-white/2 p-3 transition-colors hover:border-white/10 hover:bg-white/4"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-black/50">
          {bookmark.favicon ? (
            <img
              src={bookmark.favicon}
              alt=""
              className="h-5 w-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://avatar.vercel.sh/${domain}`;
              }}
            />
          ) : (
            <div className="text-xs font-bold text-zinc-400">
              {bookmark.title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate text-sm font-medium text-zinc-200">
            {bookmark.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="truncate">{domain}</span>
            <span>•</span>
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
              {categoryName}
            </span>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 text-xs text-zinc-500 sm:flex">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </div>

        <div className="relative ml-2 shrink-0">
          <button
            onClick={toggleMenu}
            className={`rounded-md p-1.5 transition-colors ${isMenuOpen || isHovered ? "text-zinc-400 hover:bg-white/10 hover:text-zinc-200" : "text-transparent"}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-50 mt-1 w-36 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl"
              >
                <div className="flex flex-col">
                  <a
                    href={bookmark.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    <LinkIcon className="h-3.5 w-3.5" /> Copy Link
                  </button>
                  <div className="my-1 h-px bg-white/5" />
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={bookmark.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsMenuOpen(false);
      }}
      className="group relative flex h-full min-h-[140px] flex-col overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-black/50">
          {bookmark.favicon ? (
            <img
              src={bookmark.favicon}
              alt=""
              className="h-5 w-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://avatar.vercel.sh/${domain}`;
              }}
            />
          ) : (
            <div className="text-xs font-bold text-zinc-400">
              {bookmark.title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={toggleMenu}
            className={`rounded-md p-1.5 transition-colors ${isMenuOpen || isHovered ? "text-zinc-400 hover:bg-white/10 hover:text-zinc-200" : "text-transparent"}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-50 mt-1 w-36 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl"
              >
                <div className="flex flex-col">
                  <a
                    href={bookmark.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    <LinkIcon className="h-3.5 w-3.5" /> Copy Link
                  </button>
                  <div className="my-1 h-px bg-white/5" />
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="mb-1 line-clamp-2 text-sm leading-snug font-medium text-zinc-200">
          {bookmark.title}
        </h3>
        <p className="mt-0.5 mb-auto truncate text-xs text-zinc-500">
          {domain}
        </p>

        <div className="mt-4 flex items-center justify-between text-[10px] font-medium text-zinc-500">
          <span className="rounded bg-white/5 px-1.5 py-0.5">
            {categoryName}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </motion.a>
  );
}

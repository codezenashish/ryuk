"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, PencilLine } from "lucide-react";
import {
  useBookmarksQuery,
  useBulkUpdateBookmarksMutation,
} from "../hooks/use-bookmark-queries";
import { useAuth } from "@clerk/nextjs";

interface EditAllDialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
}

interface EditableBookmark {
  id: number;
  title: string;
  url: string;
  categoryId: string;
}

export default function EditAllDialog({
  isDialogOpen,
  onDialogClose,
}: EditAllDialogProps) {
  const { userId } = useAuth();
  const { data: categories = [], isLoading } = useBookmarksQuery(userId);
  const bulkUpdateMutation = useBulkUpdateBookmarksMutation();

  const [editedBookmarks, setEditedBookmarks] = useState<EditableBookmark[]>(
    [],
  );

  const initialisedRef = useRef(false);

  useEffect(() => {
    if (isDialogOpen && !initialisedRef.current && categories.length > 0) {
      const flatBookmarks: EditableBookmark[] = [];
      for (const cat of categories) {
        for (const b of cat.bookmarks) {
          flatBookmarks.push({
            id: b.id,
            title: b.title,
            url: b.url ?? "",
            categoryId: cat.id,
          });
        }
      }
      setEditedBookmarks(flatBookmarks);
      initialisedRef.current = true;
    }
  }, [isDialogOpen, categories]);

  useEffect(() => {
    if (!isDialogOpen) {
      initialisedRef.current = false;
      setEditedBookmarks([]);
    }
  }, [isDialogOpen]);

  const handleFieldChange = useCallback(
    (id: number, field: keyof EditableBookmark, value: string) => {
      setEditedBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
      );
    },
    [],
  );

  const handleSaveAll = useCallback(async () => {
    if (editedBookmarks.length === 0 || !userId) return;

    const bookmarksToUpdate = editedBookmarks.map((bookmark) => ({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      categoryId: bookmark.categoryId,
    }));

    bulkUpdateMutation.mutate(
      { userId, bookmarks: bookmarksToUpdate },
      {
        onError: (error) => {
          console.error("Save failed:", error.message);
        },
      },
    );
    onDialogClose();
  }, [editedBookmarks, bulkUpdateMutation, userId, onDialogClose]);

  const isSaving = bulkUpdateMutation.isPending;

  return (
    <AnimatePresence>
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => !isSaving && onDialogClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#09090b]/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 shadow-inner">
                  <PencilLine className="size-4 text-zinc-300" />
                </div>
                <div>
                  <h2 className="font-semibold text-white tracking-tight">Bulk Edit</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Bookmarks Manager</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDialogClose}
                disabled={isSaving}
                className="flex size-7 items-center justify-center rounded-lg border border-transparent text-zinc-500 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <X className="size-4" />
              </motion.button>
            </div>

            <div className="max-h-[60vh] overflow-x-auto overflow-y-auto p-0 scrollbar-none">
              {isLoading && editedBookmarks.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                </div>
              ) : (
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-[#09090b]/90 backdrop-blur-md shadow-sm">
                    <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <th className="w-1/3 px-5 py-3">Title</th>
                      <th className="w-1/3 px-5 py-3">URL</th>
                      <th className="w-1/3 px-5 py-3">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {editedBookmarks.map((bookmark) => (
                      <tr
                        key={bookmark.id}
                        className="group transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="p-0">
                          <input
                            type="text"
                            value={bookmark.title}
                            onChange={(e) =>
                              handleFieldChange(
                                bookmark.id,
                                "title",
                                e.target.value,
                              )
                            }
                            disabled={isSaving}
                            className="h-full w-full bg-transparent px-5 py-3.5 text-xs text-zinc-200 transition-all outline-none placeholder:text-zinc-600 focus:bg-white/5 focus:ring-2 focus:ring-inset focus:ring-indigo-500/30 disabled:opacity-50"
                          />
                        </td>
                        <td className="p-0 border-l border-white/5">
                          <input
                            type="text"
                            value={bookmark.url}
                            onChange={(e) =>
                              handleFieldChange(
                                bookmark.id,
                                "url",
                                e.target.value,
                              )
                            }
                            disabled={isSaving}
                            className="h-full w-full bg-transparent px-5 py-3.5 text-xs text-zinc-400 font-mono transition-all outline-none placeholder:text-zinc-600 focus:bg-white/5 focus:ring-2 focus:ring-inset focus:ring-indigo-500/30 disabled:opacity-50"
                          />
                        </td>
                        <td className="p-0 px-3 border-l border-white/5">
                          <div className="relative group-focus-within:ring-2 group-focus-within:ring-indigo-500/30 rounded-md">
                            <select
                              value={bookmark.categoryId}
                              onChange={(e) =>
                                handleFieldChange(
                                  bookmark.id,
                                  "categoryId",
                                  e.target.value,
                                )
                              }
                              disabled={isSaving}
                              className="h-full w-full cursor-pointer appearance-none rounded-md bg-transparent px-3 py-2 text-xs font-medium text-zinc-300 transition-colors outline-none hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {categories.map((cat: any) => (
                                <option
                                  key={cat.id}
                                  value={cat.id}
                                  className="bg-zinc-900 text-zinc-200"
                                >
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-white/5 bg-black/20 p-4">
              <button
                type="button"
                onClick={onDialogClose}
                disabled={isSaving}
                className="rounded-xl border border-white/5 bg-transparent px-4 py-2 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving || isLoading || editedBookmarks.length === 0}
                className="relative flex items-center justify-center rounded-xl bg-white px-5 py-2 text-xs font-bold text-black transition-all hover:scale-105 hover:bg-zinc-200 active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

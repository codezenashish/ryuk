"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  useBookmarksQuery,
  useBulkUpdateBookmarksMutation,
} from "../hooks/use-bookmark-queries";

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
  const userId = "mock-user-id-123";
  const { data: categories = [], isLoading } = useBookmarksQuery(userId);
  const bulkUpdateMutation = useBulkUpdateBookmarksMutation();

  const [editedBookmarks, setEditedBookmarks] = useState<EditableBookmark[]>([]);

  // FIX: Track whether the dialog has been initialised for the current open
  // session. Without this guard, the useEffect re-fires whenever `categories`
  // changes (e.g. after query invalidation mid-save), which resets
  // `editedBookmarks` back to the server state while the user is still editing
  // — silently discarding all pending changes before they are sent.
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

  // FIX: Reset the initialisation guard when the dialog closes so the next
  // open always loads fresh data from the server.
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
    if (editedBookmarks.length === 0) return;

    // Snapshot the current edited state at call-time. Because mutate is async
    // and the state updater in useEffect could theoretically run between the
    // mutate call and the server response, we pass the snapshot directly so
    // the mutation always operates on what the user actually edited.
    const bookmarksToUpdate = editedBookmarks.map((bookmark) => ({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      categoryId: bookmark.categoryId,
    }));

    bulkUpdateMutation.mutate(
      { userId, bookmarks: bookmarksToUpdate },
      {
        onSuccess: () => {
          onDialogClose();
        },
        onError: (error) => {
          console.error("Save failed:", error.message);
          // Keep the dialog open so the user can retry or cancel manually.
        },
      },
    );
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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-950/90 shadow-2xl backdrop-blur-xl"
          >
            <div className="border-b border-white/[0.06] p-5">
              <h2 className="text-sm font-semibold text-zinc-100">
                Bulk Edit Bookmarks
              </h2>
            </div>

            <div className="max-h-[60vh] overflow-x-auto overflow-y-auto p-0">
              {isLoading && editedBookmarks.length === 0 ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                </div>
              ) : (
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm">
                    <tr className="border-b border-white/[0.06] text-xs font-medium text-zinc-500">
                      <th className="w-1/3 px-4 py-3 font-medium">Title</th>
                      <th className="w-1/3 px-4 py-3 font-medium">URL</th>
                      <th className="w-1/3 px-4 py-3 font-medium">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
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
                            className="h-full w-full bg-transparent px-4 py-3 text-zinc-200 transition-colors outline-none placeholder:text-zinc-600 hover:bg-white/[0.03] focus:bg-white/[0.05] focus:ring-1 focus:ring-white/20 focus:ring-inset disabled:opacity-50"
                          />
                        </td>
                        <td className="p-0">
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
                            className="h-full w-full bg-transparent px-4 py-3 text-zinc-200 transition-colors outline-none placeholder:text-zinc-600 hover:bg-white/[0.03] focus:bg-white/[0.05] focus:ring-1 focus:ring-white/20 focus:ring-inset disabled:opacity-50"
                          />
                        </td>
                        <td className="p-0 px-2">
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
                            className="h-full w-full cursor-pointer appearance-none rounded-md border border-transparent bg-transparent px-2 py-2 text-zinc-200 transition-colors outline-none hover:bg-white/[0.03] focus:border-white/20 focus:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {categories.map((cat) => (
                              <option
                                key={cat.id}
                                value={cat.id}
                                className="bg-zinc-900 text-zinc-200"
                              >
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] bg-zinc-950/50 p-4">
              <button
                type="button"
                onClick={onDialogClose}
                disabled={isSaving}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving || isLoading || editedBookmarks.length === 0}
                className="relative flex items-center justify-center rounded-lg bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-900 transition-all hover:bg-white disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save All Changes"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
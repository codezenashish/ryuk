"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { fetchBookmarksAction } from "../actions/bookmark-actions";

interface DialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
}

export default function ExportDialog({
  isDialogOpen,
  onDialogClose,
}: DialogProps) {
  const { userId } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!userId) return;
    try {
      setIsExporting(true);
      const categories = await fetchBookmarksAction(userId);

      const exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: categories.map((cat) => ({
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          position: cat.position,
          bookmarks: cat.bookmarks.map((b) => ({
            title: b.title,
            url: b.url,
            favicon: b.favicon,
          })),
        })),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `devnest_bookmarks_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onDialogClose();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export bookmarks.");
    } finally {
      setIsExporting(false);
    }
  };
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
            onClick={onDialogClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-white/5 bg-[#09090b]/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner">
                  <Download className="size-5 text-zinc-300" />
                </div>
                <div>
                  <h2 className="font-semibold tracking-tight text-white">
                    Export Data
                  </h2>
                  <p className="mt-0.5 text-[11px] tracking-widest text-zinc-500 uppercase">
                    Bookmarks & Tags
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDialogClose}
                className="flex size-7 items-center justify-center rounded-lg border border-transparent text-zinc-500 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                <X className="size-4" />
              </motion.button>
            </div>

            <div className="mb-6 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs leading-relaxed text-zinc-400">
                This will export all your bookmarks, categories, and metadata
                into a standard JSON file that you can safely store or import
                later.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onDialogClose}
                className="rounded-xl border border-white/5 bg-transparent px-4 py-2 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:scale-105 hover:bg-zinc-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              >
                {isExporting && <Loader2 className="size-3 animate-spin" />}
                {isExporting ? "Exporting..." : "Download JSON"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

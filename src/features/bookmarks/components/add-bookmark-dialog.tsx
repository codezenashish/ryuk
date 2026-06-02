"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddBookmarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBookmarkDialog({
  isOpen,
  onClose,
}: AddBookmarkDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ url, title });
    setUrl("");
    setTitle("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="relative w-full max-w-md bg-zinc-950 border border-white/[0.08] rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Add New Bookmark
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-1 rounded-lg border border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  URL / Link
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="h-9 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-white/[0.12] focus:bg-white/[0.04] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Repository or Website Name"
                  className="h-9 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-white/[0.12] focus:bg-white/[0.04] transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.04] mt-6">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white/[0.02] border border-white/[0.06] text-zinc-400 hover:text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#ffffff" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-zinc-100 text-black text-xs font-bold rounded-xl transition-colors shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                >
                  Save Bookmark
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";

interface DialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
}

export default function ImportDialog({
  isDialogOpen,
  onDialogClose,
}: DialogProps) {
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
                  <Upload className="size-5 text-zinc-300" />
                </div>
                <div>
                  <h2 className="font-semibold tracking-tight text-white">
                    Import Data
                  </h2>
                  <p className="mt-0.5 text-[11px] tracking-widest text-zinc-500 uppercase">
                    Restore Backup
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

            <div className="group mb-6 cursor-pointer rounded-xl border border-dashed border-white/5 bg-white/[0.02] p-4 text-center transition-all hover:border-white/20 hover:bg-white/[0.04]">
              <Upload className="mx-auto mb-2 size-6 text-zinc-500 transition-colors group-hover:text-white" />
              <p className="mb-1 text-xs font-medium text-zinc-300">
                Click to select a JSON file
              </p>
              <p className="text-[10px] text-zinc-500">
                or drag and drop it here
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
                onClick={onDialogClose}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:scale-105 hover:bg-zinc-200 active:scale-95"
              >
                Select File
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { importBookmarksAction } from "../actions/bookmark-actions";

interface DialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
}

const importSchema = z.object({
  version: z.number().refine((val) => val === 1, {
    message: "Unsupported backup version",
  }),
  data: z.array(
    z.object({
      name: z.string(),
      icon: z.string().optional(),
      color: z.string().optional(),
      position: z.number().optional(),
      bookmarks: z.array(
        z.object({
          title: z.string(),
          url: z.string().nullable().optional(),
          favicon: z.string().optional(),
        })
      ),
    })
  ),
});

export default function ImportDialog({
  isDialogOpen,
  onDialogClose,
}: DialogProps) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const processFile = async (file: File) => {
    if (!file) return;

    setErrorMsg("");
    setIsImporting(true);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const validated = importSchema.parse(parsed);

      if (!userId) throw new Error("Unauthorized");

      const result = await importBookmarksAction(userId, validated);
      if (!result.success) {
        throw new Error(result.error);
      }

      await queryClient.invalidateQueries({ queryKey: ["bookmarks", userId] });
      alert(`Successfully imported ${result.count} bookmarks!`);
      onDialogClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMsg("Invalid backup file format.");
      } else if (error instanceof Error) {
        setErrorMsg(error.message || "Failed to import.");
      } else {
        setErrorMsg("Failed to parse JSON file.");
      }
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isImporting) return;

    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/json" || file.name.endsWith(".json"))) {
      processFile(file);
    } else {
      setErrorMsg("Please upload a valid JSON file.");
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

            <div
              onClick={() => !isImporting && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`group mb-6 cursor-pointer rounded-xl border border-dashed ${
                errorMsg
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-white/5 bg-white/[0.02]"
              } p-4 text-center transition-all hover:border-white/20 hover:bg-white/[0.04]`}
            >
              <input
                type="file"
                accept=".json"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {isImporting ? (
                <Loader2 className="mx-auto mb-2 size-6 animate-spin text-zinc-500 transition-colors group-hover:text-white" />
              ) : (
                <Upload
                  className={`mx-auto mb-2 size-6 ${
                    errorMsg ? "text-red-400" : "text-zinc-500"
                  } transition-colors group-hover:text-white`}
                />
              )}
              <p
                className={`mb-1 text-xs font-medium ${
                  errorMsg ? "text-red-400" : "text-zinc-300"
                }`}
              >
                {errorMsg ||
                  (isImporting ? "Importing..." : "Click to select a JSON file")}
              </p>
              {!errorMsg && !isImporting && (
                <p className="text-[10px] text-zinc-500">
                  or drag and drop it here
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onDialogClose}
                className="rounded-xl border border-white/5 bg-transparent px-4 py-2 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:scale-105 hover:bg-zinc-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
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

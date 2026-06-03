"use client";

import { useState } from "react";
import { Plus, Download, Upload } from "lucide-react";
import { motion } from "framer-motion";
import AddBookmarkDialog from "./add-bookmark-dialog";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex w-full flex-col justify-between gap-4 border-b border-white/6 bg-black pb-6 sm:flex-row sm:items-center">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white select-none md:text-2xl">
          <span className="inline-block h-5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
          {title}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <motion.button
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#ffffff",
          }}
          whileTap={{ scale: 0.98 }}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/6 bg-white/2 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Import</span>
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#ffffff",
          }}
          whileTap={{ scale: 0.98 }}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/6 bg-white/2 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#ffffff" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsDialogOpen(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-black shadow-[0_4px_12px_rgba(255,255,255,0.05)] transition-colors"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Add Bookmark</span>
        </motion.button>
      </div>

      <AddBookmarkDialog
        isDialogOpen={isDialogOpen}
        onDialogClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}

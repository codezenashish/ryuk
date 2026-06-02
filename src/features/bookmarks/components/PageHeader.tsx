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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-white/[0.06] pb-6 bg-black">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2  select-none">
          <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
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
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] text-zinc-400 text-xs font-medium rounded-xl transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
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
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] text-zinc-400 text-xs font-medium rounded-xl transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#ffffff" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 text-black text-xs font-bold rounded-xl transition-colors shadow-[0_4px_12px_rgba(255,255,255,0.05)] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Bookmark</span>
        </motion.button>
      </div>

      <AddBookmarkDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}

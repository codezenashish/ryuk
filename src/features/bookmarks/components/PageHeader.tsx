"use client";

import { useState } from "react";
import { Plus, Download, Upload, Pencil, BookMarked } from "lucide-react";
import { motion } from "framer-motion";

import AddBookmarkDialog from "./AddBookmarkDialog";
import { OverflowMenu } from "./OverflowMenu";
import type { OverflowMenuItem } from "./OverflowMenu";

interface PageHeaderProps {
  title: string;
}

const secondaryActions: OverflowMenuItem[] = [
  {
    label: "Edit All",
    icon: <Pencil className="h-3.5 w-3.5" />,
    onClick: () => {},
  },
  {
    label: "Import",
    icon: <Upload className="h-3.5 w-3.5" />,
    onClick: () => {},
  },
  {
    label: "Export",
    icon: <Download className="h-3.5 w-3.5" />,
    onClick: () => {},
  },
];

export default function PageHeader({ title }: PageHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <header className="flex w-full flex-wrap items-center justify-between gap-4 border-b bg-amber-400 border-white/6 pb-5">
        {/* Left — identity */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-[0.625rem] border border-indigo-500/22 bg-linear-to-br from-indigo-500/18 to-violet-500/10 shadow-[0_0_14px_rgba(99,102,241,0.12)]"
          >
            <BookMarked className="h-4 w-4 text-indigo-400" />
          </div>

          <div className="flex min-w-0 flex-col gap-0.5">
            <h1 className="m-0 truncate text-[1.125rem] leading-[1.2] font-bold tracking-tight text-zinc-100 select-none">
              {title}
            </h1>
            <span className="text-[0.7rem] font-normal tracking-[0.01em] whitespace-nowrap text-zinc-500/70 select-none">
              Your saved links, organized
            </span>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex shrink-0 items-center gap-2">
          <OverflowMenu items={secondaryActions} />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsDialogOpen(true)}
            aria-label="Add bookmark"
            className="relative flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-[0.625rem] border border-white/[0.06] bg-white/[0.02] px-3.5 py-2 text-[0.8rem] font-semibold tracking-[-0.01em] whitespace-nowrap text-zinc-400 transition-colors duration-200 outline-none hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(255,255,255,0.18)_0%,transparent_60%)]"
            />
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Add Bookmark</span>
          </motion.button>
        </div>
      </header>

      <AddBookmarkDialog
        isDialogOpen={isDialogOpen}
        onDialogClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}

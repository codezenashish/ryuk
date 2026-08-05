"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import AddBookmarkDialog from "./add-bookmark-dialog";

interface BookmarkEmptyStateProps {
  title: string;
  description: string;
  ctaLabel?: string;
  showCta?: boolean;
}

export default function BookmarkEmptyState({
  title,
  description,
  ctaLabel,
  showCta = true,
}: BookmarkEmptyStateProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex h-full items-center justify-center p-4 md:p-8">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-dashed border-stone-300 dark:border-white/10 bg-stone-50/50 dark:bg-white/2 px-6 py-10 text-center transition-colors duration-300">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 dark:border-white/8 bg-stone-100 dark:bg-white/4 text-stone-400 dark:text-stone-500 transition-colors">
          <HugeiconsIcon icon={Bookmark01Icon} size={20} />
        </div>
        <h2 className="text-base font-medium text-stone-900 dark:text-stone-100 transition-colors">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400 transition-colors">{description}</p>
        {showCta ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="mt-5 border-stone-300 dark:border-white/8 bg-white dark:bg-white/4 text-stone-700 dark:text-stone-200 hover:border-stone-400 dark:hover:border-white/14 hover:bg-stone-100 dark:hover:bg-white/8 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            {ctaLabel ?? "Add bookmark"}
          </Button>
        ) : null}
      </div>

      <AddBookmarkDialog
        isDialogOpen={isDialogOpen}
        onDialogClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}

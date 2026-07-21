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
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-500">
          <HugeiconsIcon icon={Bookmark01Icon} size={20} />
        </div>
        <h2 className="text-base font-medium text-zinc-100">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
        {showCta ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="mt-5 border-zinc-800 bg-zinc-900/70 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white"
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

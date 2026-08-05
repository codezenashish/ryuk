"use client";

import { useNoteStore } from "@/store/useNoteStore";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, StickyNote01Icon } from "@hugeicons/core-free-icons";
import NoteSidebar from "./note-sidebar";
import NoteEditor from "./editor";

export default function NotesView() {
  const { activeNoteId, setActiveNoteId } = useNoteStore();

  return (
    <div className="flex h-full bg-stone-50 dark:bg-[#0c0c0b]">
      
      <div
        className={cn(
          "h-full w-full shrink-0 overflow-y-auto border-r border-stone-200 dark:border-white/6 md:w-70 lg:w-[320px]",
          activeNoteId && "hidden md:block",
        )}
      >
        <NoteSidebar />
      </div>

     
      <div
        className={cn(
          "h-full flex-1 overflow-y-auto bg-white/50 dark:bg-white/2",
          !activeNoteId && "hidden md:block",
        )}
      >
        {activeNoteId ? (
          <div className="mx-auto max-w-3xl p-4 md:p-8">
            <button
              onClick={() => setActiveNoteId(null)}
              className="mb-4 flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors md:hidden"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              Back to notes
            </button>
            <NoteEditor noteId={activeNoteId} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-stone-400 dark:text-stone-600">
            <HugeiconsIcon icon={StickyNote01Icon} size={32} />
            <p className="text-sm">Select a note to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

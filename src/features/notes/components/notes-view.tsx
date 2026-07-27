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
    <div className="flex h-full bg-black">
      
      <div
        className={cn(
          "h-full w-full shrink-0 overflow-y-auto border-r border-zinc-900 md:w-70 lg:w-[320px]",
          activeNoteId && "hidden md:block",
        )}
      >
        <NoteSidebar />
      </div>

      {/* Preview / editor pane */}
      <div
        className={cn(
          "h-full flex-1 overflow-y-auto bg-zinc-950/20",
          !activeNoteId && "hidden md:block",
        )}
      >
        {activeNoteId ? (
          <div className="mx-auto max-w-3xl p-4 md:p-8">
            <button
              onClick={() => setActiveNoteId(null)}
              className="mb-4 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 md:hidden"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              Back to notes
            </button>
            <NoteEditor noteId={activeNoteId} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-700">
            <HugeiconsIcon icon={StickyNote01Icon} size={32} />
            <p className="text-sm">Select a note to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useNoteStore } from "@/store/useNoteStore";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, StickyNote01Icon } from "@hugeicons/core-free-icons";

function stripHtml(html: string) {
  if (!html) return "";
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, "");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export default function NoteSidebar() {
  const { notes, activeNoteId, setActiveNoteId, searchQuery, deleteNote } =
    useNoteStore();

  const q = searchQuery.trim().toLowerCase();
  const filteredNotes = notes.filter((note) => {
    if (!q) return true;
    return (
      note.title.toLowerCase().includes(q) ||
      stripHtml(note.content).toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto bg-stone-50/50 dark:bg-white/1 p-2">
        {filteredNotes.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-stone-400 dark:text-stone-600">
            <HugeiconsIcon icon={StickyNote01Icon} size={24} />
            <p className="text-xs">
              {searchQuery ? "No notes match your search" : "No notes yet"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              const preview = stripHtml(note.content).trim();

              return (
                <button
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={cn(
                    "group relative flex w-full flex-col gap-1 rounded-xl border px-3 py-3 text-left transition-all duration-200",
                    isActive
                      ? "border-stone-300 dark:border-white/10 bg-white dark:bg-white/6"
                      : "border-stone-200 dark:border-white/5 bg-white/60 dark:bg-white/2 hover:border-stone-300 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/4",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        isActive ? "text-stone-900 dark:text-stone-100" : "text-stone-700 dark:text-stone-200",
                      )}
                    >
                      {note.title || "Untitled"}
                    </span>
                    <span
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="shrink-0 rounded p-1 text-stone-400 dark:text-stone-600 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:text-red-400"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={13} />
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-stone-500 dark:text-stone-500">
                    {preview || "No additional content"}
                  </p>
                  <span className="text-[10px] text-stone-400 dark:text-stone-600">
                    {note.updatedAt}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

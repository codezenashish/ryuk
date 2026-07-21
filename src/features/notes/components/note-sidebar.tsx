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
      <div className="shrink-0 border-b border-zinc-900 bg-zinc-950/40 px-4 py-3">
        <p className="text-xs font-medium text-zinc-500">
          {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-black/20 p-2">
        {filteredNotes.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-zinc-700">
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
                    "group relative flex w-full flex-col gap-1 rounded-xl border px-3 py-3 text-left transition-colors",
                    isActive
                      ? "border-zinc-800 bg-zinc-950/40"
                      : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-900/30",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        isActive ? "text-zinc-100" : "text-zinc-200",
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
                      className="shrink-0 rounded p-1 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={13} />
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-zinc-500">
                    {preview || "No additional content"}
                  </p>
                  <span className="text-[10px] text-zinc-700">
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

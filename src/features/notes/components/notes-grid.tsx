"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  LayoutGrid,
  List as ListIcon,
  Tag,
  Layers,
  StickyNote,
} from "lucide-react";
import { NotesCard, Note } from "./notes-card";
import { Skeleton } from "@/components/ui/skeleton";

interface NotesGridProps {
  notes: Note[];
  isLoading?: boolean;
  onSelectNote: (note: Note | "new") => void;
  onDeleteNote: (id: string) => Promise<void>;
  onTogglePin?: (id: string, isPinned: boolean) => Promise<Note>;
  onToggleBookmark?: (id: string, isBookmarked: boolean) => Promise<Note>;
}

export function NotesGrid({
  notes,
  isLoading = false,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
  onToggleBookmark,
}: NotesGridProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (Array.isArray(n.tags)) {
        n.tags.forEach((t) => set.add(t));
      }
    });
    return Array.from(set).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        if (selectedTag && (!note.tags || !note.tags.includes(selectedTag))) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
  }, [notes, selectedTag]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium bg-ink text-paper shadow-sm shrink-0 cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All Notes</span>
            <span className="ml-0.5 rounded-full px-1.5 py-0.2 font-mono text-[10px] bg-paper/20 text-paper">
              {notes.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center rounded-xl border border-line-2 bg-paper-3 p-1 gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink-3 hover:text-ink"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink-3 hover:text-ink"
              }`}
              title="List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSelectNote("new")}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-medium text-paper hover:bg-ink-2 transition shadow-sm cursor-pointer active:translate-y-px"
          >
            <Plus className="h-4 w-4" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-ink-3 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-ink-4" />
            Filter by Tag:
          </span>
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              selectedTag === null
                ? "bg-ink text-paper shadow-sm"
                : "bg-paper-2 text-ink-3 hover:bg-paper-3 hover:text-ink border border-line"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedTag === tag
                  ? "bg-ink text-paper shadow-sm"
                  : "bg-paper-2 text-ink-3 hover:bg-paper-3 hover:text-ink border border-line"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-44 w-full bg-paper-3 rounded-xl" />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-line-2 bg-paper-card text-center space-y-4">
          <div className="p-3.5 rounded-xl bg-paper-3 text-ink-3 border border-line">
            <StickyNote className="w-6 h-6" />
          </div>
          <div className="max-w-xs space-y-1">
            <h3 className="text-sm font-semibold text-ink font-sans">
              No notes yet
            </h3>
            <p className="text-xs text-ink-3 font-sans">
              {selectedTag
                ? "No notes matched this tag filter."
                : "Create Notion-style documents with auto-syntax code blocks."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectNote("new")}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-medium text-paper hover:bg-ink-2 transition shadow-sm cursor-pointer active:translate-y-px"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NotesCard
              key={note.id}
              note={note}
              onEdit={() => onSelectNote(note)}
              onDelete={onDeleteNote}
              onTagClick={(tag) => setSelectedTag(tag)}
              onTogglePin={onTogglePin}
              onToggleBookmark={onToggleBookmark}
              layoutMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotes.map((note) => (
            <NotesCard
              key={note.id}
              note={note}
              onEdit={() => onSelectNote(note)}
              onDelete={onDeleteNote}
              onTagClick={(tag) => setSelectedTag(tag)}
              onTogglePin={onTogglePin}
              onToggleBookmark={onToggleBookmark}
              layoutMode="list"
            />
          ))}
        </div>
      )}
    </div>
  );
}

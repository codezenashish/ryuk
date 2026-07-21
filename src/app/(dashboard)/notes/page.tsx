"use client";

import NotesToolbar from "@/features/notes/components/notes-toolbar";
import NotesView from "@/features/notes/components/notes-view";

import { useNoteStore } from "@/store/useNoteStore";

export default function NotesPage() {
  const { searchQuery, setSearchQuery, addNote, setActiveNoteId } =
    useNoteStore();

  const handleNewNote = () => {
    const id = Date.now().toString();
    addNote({
      id,
      title: "",
      content: "",
      updatedAt: "Just now",
    });
    setActiveNoteId(id);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
      <div className="shrink-0 p-4 pb-0 md:p-8 md:pb-0">
        <NotesToolbar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onNewNote={handleNewNote}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <NotesView />
      </div>
    </div>
  );
}

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
      <NotesToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onNewNote={handleNewNote}
      />
      <div className="flex-1 overflow-hidden">
        <NotesView />
      </div>
    </div>
  );
}

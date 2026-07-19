import { create } from "zustand";

interface NoteState {
  activeNoteId: string | null;
  searchQuery: string;
  setActiveNoteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  activeNoteId: null,
  searchQuery: "",
  setActiveNoteId: (id) => set({ activeNoteId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

import { create } from "zustand";

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface NoteState {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  setActiveNoteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

// Dummy initial data for demonstration purposes
const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "🚀 Notion Feature Blueprint",
    content: "Build slash integration using custom components...",
    updatedAt: "2 mins ago",
  },
  {
    id: "2",
    title: "💡 Open Source Ideas",
    content: "Markdown import export, command palette setup...",
    updatedAt: "1 hour ago",
  },
  {
    id: "3",
    title: "🔒 Better Auth Research",
    content: "Session management and table relations mapping...",
    updatedAt: "Yesterday",
  },
];

export const useNoteStore = create<NoteState>((set) => ({
  notes: INITIAL_NOTES,
  activeNoteId: null,
  searchQuery: "",
  setActiveNoteId: (id: string | null) => set({ activeNoteId: id }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  addNote: (note: Note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id: string, data: Partial<Note>) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...data } : note,
      ),
    })),
  deleteNote: (id: string) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    })),
}));

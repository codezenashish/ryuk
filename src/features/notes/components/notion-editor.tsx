"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Tag as TagIcon, Trash2, X, Pin, Star } from "lucide-react";
import { TipTapEditor } from "./tiptap-editor";
import { Note } from "./notes-card";
import { clsx } from "clsx";
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";

interface NotionEditorProps {
  note: Note | null;
  activeFolderId?: string | null;
  onBack: () => void;
  onSave: (noteData: {
    id?: string;
    title: string;
    content: string;
    tags?: string[];
    isPinned?: boolean;
    isBookmarked?: boolean;
    folderId?: string | null;
  }) => Promise<Note>;
  onDelete?: (id: string) => Promise<void>;
}

export function NotionEditor({
  note,
  activeFolderId,
  onBack,
  onSave,
  onDelete,
}: NotionEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [isBookmarked, setIsBookmarked] = useState(note?.isBookmarked || false);
  const [tagInput, setTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);

  const initialRender = useRef(true);

  useKeyboardShortcuts(
    {
      "cmd+b": () => setIsBookmarked((prev) => !prev),
      "ctrl+b": () => setIsBookmarked((prev) => !prev),
      "cmd+p": () => setIsPinned((prev) => !prev),
      "ctrl+p": () => setIsPinned((prev) => !prev),
    },
    true
  );

  const [localNoteId, setLocalNoteId] = useState<string | undefined>(note?.id);
  const isSavingRef = useRef(false);
  const pendingDataRef = useRef<Parameters<typeof onSave>[0] | null>(null);

  // Sync localNoteId if parent provides it
  useEffect(() => {
    if (note?.id && note.id !== localNoteId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalNoteId(note.id);
    }
  }, [note?.id, localNoteId]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (!content.trim() && !title.trim()) return;

      const dataToSave = {
        ...(localNoteId ? { id: localNoteId } : {}),
        title: title.trim() || "Untitled Note",
        content,
        tags,
        isPinned,
        isBookmarked,
        folderId: note?.folderId || activeFolderId || null,
      };

      if (isSavingRef.current) {
        pendingDataRef.current = dataToSave;
        return;
      }

      const performSave = async (data: Parameters<typeof onSave>[0]) => {
        isSavingRef.current = true;
        try {
          const savedNote = await onSave(data);
          if (savedNote?.id) {
            setLocalNoteId(savedNote.id);
            if (pendingDataRef.current && !pendingDataRef.current.id) {
              pendingDataRef.current.id = savedNote.id;
            }
          }
        } catch (err) {
          console.error("Autosave error:", err);
        } finally {
          isSavingRef.current = false;
          if (pendingDataRef.current) {
            const nextData = pendingDataRef.current;
            pendingDataRef.current = null;
            performSave(nextData);
          }
        }
      };

      performSave(dataToSave);
    }, 400);

    return () => clearTimeout(timer);
  }, [title, content, tags, isPinned, isBookmarked, activeFolderId, note?.folderId, localNoteId, onSave]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().toLowerCase();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput("");
        setIsAddingTag(false);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleDelete = async () => {
    if (!note?.id || !onDelete) return;
    if (confirm("Are you sure you want to delete this note?")) {
      await onDelete(note.id);
      onBack();
    }
  };

  return (
    <div className="min-h-[85vh] w-full max-w-4xl mx-auto py-4 px-2 sm:px-6 space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-4 py-2 border-b border-line">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-ink-3 hover:text-ink hover:bg-paper-3 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={clsx("p-2 rounded-xl transition cursor-pointer hover:bg-paper-3", isBookmarked ? "text-yellow-500" : "text-ink-4 hover:text-yellow-500")}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
          >
            <Star className={clsx("h-4 w-4", isBookmarked && "fill-current")} />
          </button>
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={clsx("p-2 rounded-xl transition cursor-pointer hover:bg-paper-3", isPinned ? "text-primary" : "text-ink-4 hover:text-primary")}
            title={isPinned ? "Unpin Note" : "Pin Note"}
          >
            <Pin className={clsx("h-4 w-4", isPinned && "fill-current")} />
          </button>
          
          {note?.id && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 rounded-xl text-ink-4 hover:text-rose-400 hover:bg-paper-3 transition cursor-pointer ml-2"
              title="Delete Note"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <div>
          <input
            type="text"
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-3xl sm:text-4xl font-bold font-sans text-ink placeholder-ink-4 focus:outline-none border-none tracking-tight"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TagIcon className="w-3.5 h-3.5 text-ink-4 shrink-0" />
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-paper-3 text-ink-2 text-xs border border-line font-mono"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-rose-400 cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {isAddingTag ? (
            <input
              type="text"
              autoFocus
              placeholder="Tag name + Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              onBlur={() => setIsAddingTag(false)}
              className="px-2 py-0.5 rounded-lg bg-paper-2 border border-line-2 text-ink text-xs font-mono focus:outline-none min-w-[120px]"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTag(true)}
              className="text-xs text-ink-4 hover:text-ink transition cursor-pointer font-mono"
            >
              + Add tag
            </button>
          )}
        </div>

        <div className="border-t border-line/60 pt-6">
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Type your note content... (Type ``` for code block)"
          />
        </div>
      </div>
    </div>
  );
}

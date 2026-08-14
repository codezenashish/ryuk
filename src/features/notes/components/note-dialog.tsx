"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X, Tag, Code2, Check, Loader2 } from "lucide-react";
import { TipTapEditor } from "./tiptap-editor";
import { Note } from "./notes-card";

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: {
    id?: string;
    title: string;
    content: string;
    isSnippet: boolean;
    language: string;
    tags: string[];
  }) => Promise<void>;
  initialNote?: Note | null;
}

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const PROGRAMMING_LANGUAGES = [
  "plaintext",
  "typescript",
  "javascript",
  "python",
  "html",
  "css",
  "json",
  "sql",
  "bash",
  "rust",
  "go",
];

export function NoteDialog({
  isOpen,
  onClose,
  onSave,
  initialNote = null,
}: NoteDialogProps) {
  const mounted = useIsMounted();

  if (!isOpen || !mounted) return null;

  return createPortal(
    <NoteDialogForm
      onClose={onClose}
      onSave={onSave}
      initialNote={initialNote}
    />,
    document.body
  );
}

function NoteDialogForm({
  onClose,
  onSave,
  initialNote,
}: {
  onClose: () => void;
  onSave: NoteDialogProps["onSave"];
  initialNote: Note | null;
}) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [isSnippet, setIsSnippet] = useState(Boolean(initialNote?.isSnippet));
  const [language, setLanguage] = useState(initialNote?.language || "plaintext");
  const [tags, setTags] = useState<string[]>(initialNote?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().toLowerCase();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content === "<p></p>") {
      setError("Note content cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave({
        ...(initialNote?.id ? { id: initialNote.id } : {}),
        title: title.trim() || "Untitled Note",
        content,
        isSnippet,
        language,
        tags,
      });
      onClose();
    } catch (err: unknown) {
      console.error("Save note error:", err);
      setError(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div
        className="my-auto w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-paper-2 border border-line-2 shadow-2xl overflow-hidden relative text-ink animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper-3">
          <div>
            <h2 className="text-lg font-sans font-semibold text-ink">
              {initialNote ? "Edit Note" : "Create Note"}
            </h2>
            <p className="text-xs text-ink-3">
              Write rich text documents or code snippets
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-3 hover:text-ink hover:bg-paper-2 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Title input */}
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code">
              Note Title
            </label>
            <input
              type="text"
              placeholder="e.g. System Architecture Notes..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-paper-card border border-line-2 text-ink text-sm focus:outline-none focus:border-ink transition"
            />
          </div>

          {/* Options: Snippet toggle & Language selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl border border-line bg-paper-card">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSnippet}
                onChange={(e) => setIsSnippet(e.target.checked)}
                className="w-4 h-4 rounded border-line-2 bg-paper-2 text-ink focus:ring-ink"
              />
              <span className="text-xs font-medium text-ink-2 flex items-center gap-1.5 font-sans">
                <Code2 className="w-3.5 h-3.5 text-emerald-mark" />
                Code Snippet Mode
              </span>
            </label>

            {isSnippet && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-3 font-mono">Language:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-1 rounded-lg bg-paper-2 border border-line-2 text-ink text-xs font-mono focus:outline-none focus:border-ink"
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Tags input */}
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-ink-3" />
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-paper-card border border-line-2 min-h-[42px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-paper-3 text-ink text-xs border border-line font-mono"
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
              <input
                type="text"
                placeholder={tags.length === 0 ? "Type tag and press Enter..." : "Add tag..."}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1 bg-transparent border-none text-ink text-xs placeholder-ink-4 focus:outline-none min-w-[120px]"
              />
            </div>
          </div>

          {/* TipTap Rich Text Editor */}
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code">
              Content
            </label>
            <TipTapEditor
              content={content}
              onChange={setContent}
              placeholder="Write your note or code snippet here..."
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-line bg-paper-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-medium text-ink-3 hover:text-ink transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-ink text-paper font-medium text-xs hover:bg-ink-2 transition shadow-sm active:translate-y-px cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            <span>{initialNote ? "Save Changes" : "Create Note"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

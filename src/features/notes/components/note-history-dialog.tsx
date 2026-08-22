"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, History, RotateCcw, AlertCircle, ArrowRightLeft, Loader2 } from "lucide-react";
import { diffWords } from "diff";
import { TipTapEditor } from "./tiptap-editor";

interface NoteVersion {
  id: string;
  noteId: string;
  title: string;
  content: string;
  language: string;
  isSnippet: boolean;
  createdAt: string;
}

interface NoteHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  onRestore: (restoredNote: unknown) => void;
}

// Function to strip HTML tags for simple text diffing
const stripHtml = (html: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export function NoteHistoryDialog({
  isOpen,
  onClose,
  noteId,
  onRestore,
}: NoteHistoryDialogProps) {
  if (!isOpen) return null;

  return createPortal(
    <NoteHistoryContent
      onClose={onClose}
      noteId={noteId}
      onRestore={onRestore}
    />,
    document.body
  );
}

function NoteHistoryContent({
  onClose,
  noteId,
  onRestore,
}: {
  onClose: () => void;
  noteId: string;
  onRestore: (note: unknown) => void;
}) {
  const [versions, setVersions] = useState<NoteVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [compareMode, setCompareMode] = useState<boolean>(false);

  useEffect(() => {
    async function fetchVersions() {
      try {
        setIsLoading(true);
        // We assume current note state is what's on the server before restore
        // Fetch versions
        const res = await fetch(`/api/note/${noteId}/versions`);
        if (!res.ok) throw new Error("Failed to fetch versions");
        const data = await res.json();
        
        
        // We can just get it from the dialog's parent or we assume the first version is the previous state.
        
        setVersions(data.versions);
        if (data.versions.length > 0) {
          setSelectedVersionId(data.versions[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setIsLoading(false);
      }
    }
    fetchVersions();
  }, [noteId]);

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);

  const handleRestore = async () => {
    if (!selectedVersion) return;
    
    try {
      setIsRestoring(true);
      const res = await fetch(`/api/note/${noteId}/versions/${selectedVersion.id}/restore`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to restore version");
      const data = await res.json();
      onRestore(data.note);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Restore failed");
      setIsRestoring(false);
    }
  };

  const renderDiff = (oldContent: string, newContent: string) => {
    // For rich text, diffing HTML is messy. We'll diff stripped text.
    const diff = diffWords(stripHtml(oldContent), stripHtml(newContent));
    
    return (
      <div className="bg-card border border-border rounded-xl p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[400px]">
        {diff.map((part, index) => {
          const colorClass = part.added
            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            : part.removed
            ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 line-through"
            : "text-muted-foreground";
          return (
            <span key={index} className={colorClass}>
              {part.value}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div
        className="my-auto w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden relative text-foreground animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <History className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-sans font-semibold text-foreground">
                Version History
              </h2>
              <p className="text-xs text-muted-foreground">
                View past edits and restore previous versions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-card transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Versions List */}
          <div className="w-64 border-r border-border bg-muted flex flex-col overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Loading history...</span>
              </div>
            ) : versions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center gap-2 opacity-60">
                <AlertCircle className="w-6 h-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">No previous versions found.</p>
              </div>
            ) : (
              <div className="flex flex-col p-2 gap-1">
                {versions.map((version, index) => {
                  const date = new Date(version.createdAt);
                  const isSelected = selectedVersionId === version.id;
                  
                  return (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersionId(version.id)}
                      className={`flex flex-col items-start px-4 py-3 rounded-xl text-left transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-card text-muted-foreground"
                      }`}
                    >
                      <span className={`text-sm font-semibold mb-1 ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                        {index === 0 ? "Latest Version" : `Version ${versions.length - index}`}
                      </span>
                      <span className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Content - Viewer */}
          <div className="flex-1 bg-background flex flex-col overflow-hidden relative">
            {error && (
              <div className="m-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            {selectedVersion ? (
              <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {selectedVersion.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded-md border border-border font-mono">
                        {selectedVersion.language}
                      </span>
                      {selectedVersion.isSnippet && (
                        <span className="px-2 py-1 bg-muted rounded-md border border-border">
                          Snippet
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer bg-card px-3 py-1.5 rounded-lg border border-border">
                    <input
                      type="checkbox"
                      checked={compareMode}
                      onChange={(e) => setCompareMode(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-foreground"
                    />
                    <span className="text-xs font-medium text-foreground flex items-center gap-1">
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      Text Diff (Experimental)
                    </span>
                  </label>
                </div>

                <div className="flex-1">
                  {compareMode && versions[0] ? (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 font-mono">
                        Diff with Latest
                      </h4>
                      {renderDiff(selectedVersion.content, versions[0].content)}
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 font-mono">
                        Content Preview
                      </h4>
                      <div className="opacity-80 pointer-events-none">
                         <TipTapEditor
                          content={selectedVersion.content}
                          onChange={() => {}}
                          placeholder=""
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                Select a version from the left panel
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRestore}
            disabled={!selectedVersionId || isRestoring}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/80 transition shadow-sm active:translate-y-px cursor-pointer disabled:opacity-50"
          >
            {isRestoring ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            <span>Restore Version</span>
          </button>
        </div>
      </div>
    </div>
  );
}

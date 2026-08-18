"use client";

import { useState, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X, UploadCloud, FileType2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ImportBookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // To refresh data if needed
}

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

interface ParsedBookmark {
  title: string;
  url: string;
  categoryName?: string;
}

export function ImportBookmarksModal({ isOpen, onClose, onSuccess }: ImportBookmarksModalProps) {
  const mounted = useIsMounted();

  if (!isOpen || !mounted) return null;

  return (
    <ImportBookmarksForm onClose={onClose} onSuccess={onSuccess} />
  );
}

function ImportBookmarksForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "success" | "error">("upload");
  const [isDragging, setIsDragging] = useState(false);
  
  const [parsedBookmarks, setParsedBookmarks] = useState<ParsedBookmark[]>([]);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  
  const [importStats, setImportStats] = useState({ importedCount: 0, skippedCount: 0 });
  const [errorMessage, setErrorMessage] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseHtml = (htmlContent: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const aTags = Array.from(doc.querySelectorAll("a"));
      
      const bookmarks: ParsedBookmark[] = [];
      
      aTags.forEach(a => {
        const url = a.getAttribute("href");
        if (!url || !url.startsWith("http")) return;
        
        let categoryName: string | undefined = undefined;
        const dl = a.closest("dl");
        if (dl) {
          const prev = dl.previousElementSibling;
          if (prev && prev.tagName === "H3") {
            categoryName = prev.textContent?.trim();
          } else if (prev && prev.tagName === "DT") {
            const h3 = prev.querySelector("h3");
            if (h3) categoryName = h3.textContent?.trim();
          }
        }
        
        // Exclude root "Bookmarks bar" or "Bookmarks menu" if we want, or keep them
        if (categoryName === "Bookmarks Bar" || categoryName === "Bookmarks Menu") {
          categoryName = undefined;
        }

        bookmarks.push({
          title: a.textContent?.trim() || url,
          url: url.trim(),
          categoryName: categoryName || undefined,
        });
      });
      
      if (bookmarks.length === 0) {
        setErrorMessage("No valid bookmarks found in the file.");
        setStep("error");
        return;
      }
      
      setParsedBookmarks(bookmarks);
      setStep("preview");
    } catch (error) {
      console.error("Failed to parse HTML", error);
      setErrorMessage("Failed to parse the uploaded file. Please ensure it is a valid browser bookmark HTML export.");
      setStep("error");
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      setErrorMessage("Please upload a valid HTML file.");
      setStep("error");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        parseHtml(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImport = async () => {
    setStep("importing");
    
    try {
      const res = await fetch("/api/bookmarks/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookmarks: parsedBookmarks,
          skipDuplicates,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to import");
      }
      
      const data = await res.json();
      setImportStats({
        importedCount: data.importedCount,
        skippedCount: data.skippedCount,
      });
      setStep("success");
      onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred during import.");
      setStep("error");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-md p-4 sm:p-6">
      <div className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-paper-2 border border-line-2 shadow-2xl relative text-ink animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-ink-3 hover:text-ink hover:bg-paper-3 transition cursor-pointer z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-display font-semibold text-ink mb-1">
            Import Bookmarks
          </h2>
          <p className="text-xs text-ink-3 mb-6">
            Import from Chrome, Firefox, Edge, or Safari
          </p>

          {/* UPLOAD STEP */}
          {step === "upload" && (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition ${isDragging ? "border-ink bg-paper-3/50" : "border-line-2 bg-paper-card"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-paper-3 flex items-center justify-center mb-4">
                <UploadCloud className="h-6 w-6 text-ink-2" />
              </div>
              <h3 className="text-sm font-medium text-ink mb-1">Click or drag file to this area</h3>
              <p className="text-xs text-ink-3 mb-6">Must be a standard browser bookmark HTML file</p>
              
              <input
                type="file"
                accept=".html,text/html"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-medium text-paper hover:bg-ink-2 transition shadow-sm cursor-pointer"
              >
                Browse File
              </button>
            </div>
          )}

          {/* PREVIEW STEP */}
          {step === "preview" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-line-2 bg-paper-card p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <FileType2 className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">Ready to Import</h3>
                  <p className="text-xs text-ink-3">
                    Found <strong>{parsedBookmarks.length}</strong> bookmarks 
                    in <strong>{new Set(parsedBookmarks.map(b => b.categoryName).filter(Boolean)).size}</strong> categories.
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-paper-card transition">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={skipDuplicates}
                    onChange={(e) => setSkipDuplicates(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500 bg-paper-3 border-line-2"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-ink">Skip Duplicates</span>
                  <span className="text-xs text-ink-3">Don't import bookmarks with URLs that already exist in your collection.</span>
                </div>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("upload")}
                  className="px-4 py-2 text-xs font-medium text-ink-3 hover:text-ink transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-ink text-paper font-medium text-xs hover:bg-ink-2 transition shadow-sm cursor-pointer"
                >
                  Start Import
                </button>
              </div>
            </div>
          )}

          {/* IMPORTING STEP */}
          {step === "importing" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <div className="text-center">
                <h3 className="text-sm font-medium text-ink">Importing Bookmarks...</h3>
                <p className="text-xs text-ink-3 mt-1">Please wait while we save your bookmarks.</p>
              </div>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-6 space-y-6 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-ink mb-1">Import Complete!</h3>
                <p className="text-sm text-ink-3">
                  Successfully added <strong>{importStats.importedCount}</strong> bookmarks.
                  {importStats.skippedCount > 0 && (
                    <><br />Skipped <strong>{importStats.skippedCount}</strong> duplicates.</>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink-2 transition shadow-sm cursor-pointer"
              >
                Close & View Bookmarks
              </button>
            </div>
          )}

          {/* ERROR STEP */}
          {step === "error" && (
            <div className="flex flex-col items-center justify-center py-6 space-y-6 text-center">
              <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-ink mb-1">Import Failed</h3>
                <p className="text-sm text-ink-3 max-w-xs mx-auto">
                  {errorMessage}
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-medium text-ink-3 hover:text-ink transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep("upload")}
                  className="flex-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink-2 transition shadow-sm cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  ChevronDown,
  FileText,
  Folder,
  Link,
  Loader2,
  Palette,
  Plus,
  Terminal,
  Users,
  X,
  Globe
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchBookmarkMetadata } from "../actions/scrape-metadata-action";
import { useCombobox } from "../hooks/use-category-combobox";
import { useCreateBookmarkMutation } from "../hooks/use-bookmark-queries";
import { cn } from "@/src/lib/classname-merge";
import { useAuth } from "@clerk/nextjs";

interface AddBookmarkDialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
}

const CATEGORY_CONFIGURATIONS = [
  { label: "Social Accounts", icon: Users },
  { label: "Dev Tools", icon: Terminal },
  { label: "Documentation", icon: FileText },
  { label: "Design Resources", icon: Palette },
];

function normalizeUrl(value: string) {
  const trimmedUrl = value.trim();
  if (!trimmedUrl) return "";

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

function getUrlParts(value: string) {
  const normalizedUrl = normalizeUrl(value);

  try {
    const parsedUrl = new URL(normalizedUrl);
    return {
      hostname: parsedUrl.hostname,
      normalizedUrl,
      isValid: parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:",
    };
  } catch {
    return {
      hostname: "",
      normalizedUrl,
      isValid: false,
    };
  }
}

export default function AddBookmarkDialog({
  isDialogOpen,
  onDialogClose,
}: AddBookmarkDialogProps) {
  const { userId } = useAuth();
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkFavicon, setBookmarkFavicon] = useState("");
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const createMutation = useCreateBookmarkMutation();
  const isSaving = createMutation.isPending;

  const latestMetadataRequestRef = useRef(0);
  const titleManuallyEdited = useRef(false);

  const {
    inputValue: selectedCategory,
    isDropdownOpen,
    activeHighlightedIndex,
    setActiveHighlightedIndex,
    comboboxId,
    listboxId,
    containerRef,
    inputRef,
    listRef,
    filteredItems: filteredCategories,
    isNewValueTyped: isNewCategoryTyped,
    openDropdown,
    closeDropdown,
    selectValue: selectCategory,
    handleInputChange,
    handleKeyDown,
    handleChevronClick,
    resetCombobox: resetCategoryCombobox,
  } = useCombobox(CATEGORY_CONFIGURATIONS);

  const urlState = useMemo(() => getUrlParts(bookmarkUrl), [bookmarkUrl]);
  const canSubmit = Boolean(bookmarkUrl.trim()) && urlState.isValid && !isSaving && !isSuccess;

  const resetForm = useCallback(() => {
    setBookmarkUrl("");
    setBookmarkTitle("");
    setBookmarkFavicon("");
    setIsFetchingMeta(false);
    setFormError("");
    setIsSuccess(false);
    titleManuallyEdited.current = false;
    latestMetadataRequestRef.current += 1;
    resetCategoryCombobox();
  }, [resetCategoryCombobox]);

  useEffect(() => {
    if (isDialogOpen) resetForm();
  }, [isDialogOpen, resetForm]);

  useEffect(() => {
    if (!isDialogOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        closeDropdown();
        onDialogClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [closeDropdown, isDialogOpen, isSaving, onDialogClose]);

  const totalVisibleDropdownOptions =
    filteredCategories.length + (isNewCategoryTyped ? 1 : 0);

  const handleUrlBlur = useCallback(async () => {
    const { normalizedUrl, isValid } = getUrlParts(bookmarkUrl);
    if (!normalizedUrl || !isValid) return;

    const requestId = latestMetadataRequestRef.current + 1;
    latestMetadataRequestRef.current = requestId;
    setIsFetchingMeta(true);
    setFormError("");

    try {
      const meta = await fetchBookmarkMetadata(normalizedUrl);
      if (latestMetadataRequestRef.current !== requestId) return;

      if (meta.success) {
        if (!titleManuallyEdited.current && meta.title) {
          setBookmarkTitle(meta.title);
        }
        if (meta.icon) {
          setBookmarkFavicon(meta.icon);
        }
      }
    } catch {
      if (latestMetadataRequestRef.current === requestId) {
        setFormError("Metadata fetch failed. You can still save manually.");
      }
    } finally {
      if (latestMetadataRequestRef.current === requestId) {
        setIsFetchingMeta(false);
      }
    }
  }, [bookmarkUrl]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookmarkTitle(event.target.value);
    titleManuallyEdited.current = true;
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookmarkUrl(event.target.value);
    setFormError("");
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { hostname, normalizedUrl, isValid } = getUrlParts(bookmarkUrl);
    if (!isValid) {
      setFormError("Please enter a valid http or https URL.");
      return;
    }

    const finalTitle = bookmarkTitle.trim() || hostname;
    const finalCategory = selectedCategory.trim() || "General";
    const finalFavicon =
      bookmarkFavicon ||
      `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;

    if (!userId) {
      setFormError("You must be logged in to save a bookmark.");
      return;
    }

    createMutation.mutate(
      {
        url: normalizedUrl,
        title: finalTitle,
        favicon: finalFavicon,
        categoryName: finalCategory,
        userId: userId,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            setIsSuccess(true);
            setTimeout(() => {
              resetForm();
              onDialogClose();
            }, 800);
            return;
          }
          setFormError(response.error || "Error saving bookmark.");
        },
        onError: () => {
          setFormError("Failed to save bookmark. Please try again.");
        },
      },
    );
  };

  const handleModalDismissal = () => {
    if (isSaving || isSuccess) return;
    closeDropdown();
    onDialogClose();
  };

  return (
    <AnimatePresence>
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleModalDismissal}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-bookmark-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/5 bg-[#09090b]/95 p-6 shadow-2xl backdrop-blur-xl"
            style={{
              boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 25px 50px -12px rgba(0,0,0,0.8)",
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner">
                  <Bookmark className="size-5 text-zinc-300" />
                </div>
                <div>
                  <h2
                    id="add-bookmark-title"
                    className="font-semibold tracking-tight text-white"
                  >
                    Add Bookmark
                  </h2>
                  <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-0.5">
                    Save and organize link
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                aria-label="Close dialog"
                disabled={isSaving || isSuccess}
                onClick={handleModalDismissal}
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-transparent text-zinc-500 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white disabled:opacity-40"
              >
                <X className="size-4" />
              </motion.button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              
              {/* Primary Focus: URL Input */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Globe className="size-4 text-zinc-500 transition-colors group-focus-within:text-indigo-400" />
                </div>
                <input
                  id="bookmark-url"
                  type="text"
                  inputMode="url"
                  required
                  autoFocus
                  value={bookmarkUrl}
                  onChange={handleUrlChange}
                  onBlur={handleUrlBlur}
                  disabled={isSaving || isSuccess}
                  placeholder="https://example.com"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#121215] pr-4 pl-11 text-sm text-zinc-200 shadow-inner outline-none transition-all placeholder:text-zinc-600 focus:border-indigo-500/40 focus:bg-[#15151a] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <AnimatePresence>
                {bookmarkUrl.trim() && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                    exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-5 overflow-hidden pt-1"
                  >
                    {/* Smart Preview Card */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                          Smart Preview
                        </span>
                        {isFetchingMeta && (
                          <Loader2 className="size-3.5 animate-spin text-indigo-400" />
                        )}
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#09090b] shadow-inner">
                          {isFetchingMeta ? (
                            <div className="size-full animate-pulse bg-white/5" />
                          ) : bookmarkFavicon ? (
                            <img src={bookmarkFavicon} alt="" className="size-5 object-contain" />
                          ) : (
                            <Bookmark className="size-4 text-zinc-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {isFetchingMeta ? (
                            <div className="space-y-2 py-0.5">
                              <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/10" />
                              <div className="h-2.5 w-1/2 animate-pulse rounded bg-white/5" />
                            </div>
                          ) : (
                            <>
                              <h3 className="truncate text-[13px] font-semibold text-zinc-200">
                                {bookmarkTitle || urlState.hostname || "Website Title"}
                              </h3>
                              <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                                {urlState.hostname || "domain.com"}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="shrink-0 pt-0.5">
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-zinc-400">
                            {selectedCategory || "General"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Meta Fields: Title & Category */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="bookmark-title"
                          className="block font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase pl-1"
                        >
                          Title Override
                        </label>
                        <input
                          id="bookmark-title"
                          type="text"
                          value={bookmarkTitle}
                          onChange={handleTitleChange}
                          disabled={isSaving || isSuccess}
                          placeholder={isFetchingMeta ? "Extracting..." : "Custom title"}
                          className="h-10 w-full rounded-xl border border-white/5 bg-zinc-900/40 px-3 text-xs text-zinc-200 outline-none transition-all placeholder:text-zinc-700 focus:border-indigo-400/30 focus:bg-zinc-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor={comboboxId}
                          className="block font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase pl-1"
                        >
                          Category
                        </label>
                        <div className="relative" ref={containerRef}>
                          <input
                            ref={inputRef}
                            id={comboboxId}
                            type="text"
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded={isDropdownOpen}
                            aria-controls={listboxId}
                            aria-activedescendant={
                              activeHighlightedIndex >= 0
                                ? `${comboboxId}-option-${activeHighlightedIndex}`
                                : undefined
                            }
                            autoComplete="off"
                            value={selectedCategory}
                            onChange={handleInputChange}
                            onFocus={openDropdown}
                            onKeyDown={handleKeyDown}
                            disabled={isSaving || isSuccess}
                            placeholder="Select category..."
                            className="h-10 w-full rounded-xl border border-white/5 bg-zinc-900/40 px-3 pr-8 text-xs text-zinc-200 outline-none transition-all placeholder:text-zinc-700 focus:border-indigo-400/30 focus:bg-zinc-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                            style={{
                              background: isDropdownOpen
                                ? "rgba(255,255,255,0.06)"
                                : undefined,
                            }}
                          />

                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label="Toggle category list"
                            disabled={isSaving || isSuccess}
                            onClick={handleChevronClick}
                            className="absolute right-2 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                              <ChevronDown className="size-3.5 text-zinc-500" />
                            </motion.div>
                          </button>

                          <AnimatePresence>
                            {isDropdownOpen && totalVisibleDropdownOptions > 0 && (
                              <motion.div
                                ref={listRef}
                                id={listboxId}
                                role="listbox"
                                aria-label="Categories"
                                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-52 overflow-hidden overflow-y-auto rounded-xl border border-white/10 bg-[#121215] shadow-2xl"
                                style={{ scrollbarWidth: "none" }}
                              >
                                {filteredCategories.map(({ label, icon: Icon }, itemIndex) => {
                                  const isOptionActive = itemIndex === activeHighlightedIndex;
                                  const isOptionSelected = label.toLowerCase() === selectedCategory.trim().toLowerCase();
                                  const RenderIcon = Icon || Folder;

                                  return (
                                    <div
                                      key={label}
                                      id={`${comboboxId}-option-${itemIndex}`}
                                      role="option"
                                      aria-selected={isOptionSelected}
                                      data-index={itemIndex}
                                      onMouseDown={(event) => {
                                        event.preventDefault();
                                        selectCategory(label);
                                      }}
                                      onMouseEnter={() => setActiveHighlightedIndex(itemIndex)}
                                      onMouseLeave={() => setActiveHighlightedIndex(-1)}
                                      className="flex w-full cursor-pointer select-none items-center gap-2.5 px-3 py-2 text-xs transition-colors"
                                      style={{
                                        color: isOptionActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                                        background: isOptionActive ? "rgba(255,255,255,0.06)" : "transparent",
                                      }}
                                    >
                                      <RenderIcon className="size-3.5 shrink-0 opacity-60" />
                                      <span className="flex-1 truncate">{label}</span>
                                      {isOptionSelected && (
                                        <span className="font-mono text-[9px] font-bold tracking-widest text-indigo-400/80 uppercase">
                                          Active
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}

                                {isNewCategoryTyped && (
                                  <>
                                    {filteredCategories.length > 0 && <div className="border-t border-white/5" />}
                                    <div
                                      id={`${comboboxId}-option-${filteredCategories.length}`}
                                      role="option"
                                      aria-selected={false}
                                      data-index={filteredCategories.length}
                                      onMouseDown={(event) => {
                                        event.preventDefault();
                                        selectCategory(selectedCategory.trim());
                                      }}
                                      onMouseEnter={() => setActiveHighlightedIndex(filteredCategories.length)}
                                      onMouseLeave={() => setActiveHighlightedIndex(-1)}
                                      className="flex w-full cursor-pointer select-none items-center gap-2.5 px-3 py-2 text-xs transition-colors"
                                      style={{
                                        color: activeHighlightedIndex === filteredCategories.length ? "#a5b4fc" : "#818cf8",
                                        background: activeHighlightedIndex === filteredCategories.length ? "rgba(129,140,248,0.08)" : "transparent",
                                      }}
                                    >
                                      <Plus className="size-3.5 shrink-0" />
                                      <span>Create <span className="font-semibold">&ldquo;{selectedCategory.trim()}&rdquo;</span></span>
                                    </div>
                                  </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {formError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl border border-red-400/10 bg-red-500/5 px-3 py-2.5 text-[11px] font-medium text-red-400"
                  >
                    {formError}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={isSaving || isSuccess}
                  onClick={handleModalDismissal}
                  className="cursor-pointer rounded-xl border border-white/5 bg-transparent px-4 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: canSubmit && !isSuccess ? 1.02 : 1 }}
                  whileTap={{ scale: canSubmit && !isSuccess ? 0.98 : 1 }}
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl px-5 py-2.5 text-xs font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all disabled:cursor-not-allowed disabled:opacity-50 min-w-[130px]",
                    isSuccess ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "bg-white text-black hover:bg-zinc-200"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                       <motion.span 
                         key="success"
                         initial={{ opacity: 0, y: 10 }} 
                         animate={{ opacity: 1, y: 0 }} 
                         exit={{ opacity: 0, y: -10 }}
                         className="flex items-center gap-2"
                       >
                         Saved!
                       </motion.span>
                    ) : isSaving ? (
                       <motion.span 
                         key="saving"
                         initial={{ opacity: 0, y: 10 }} 
                         animate={{ opacity: 1, y: 0 }} 
                         exit={{ opacity: 0, y: -10 }}
                         className="flex items-center gap-2"
                       >
                         <Loader2 className="size-3.5 animate-spin" />
                         Saving...
                       </motion.span>
                    ) : (
                       <motion.span 
                         key="idle"
                         initial={{ opacity: 0, y: 10 }} 
                         animate={{ opacity: 1, y: 0 }} 
                         exit={{ opacity: 0, y: -10 }}
                       >
                         Add Bookmark
                       </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

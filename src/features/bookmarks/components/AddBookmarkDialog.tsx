"use client";
import { fetchBookmarkMetadata } from "../actions/scrape-metadata-action";
import { useCreateBookmarkMutation } from "../hooks/use-bookmark-queries";

import {
  X,
  ChevronDown,
  Link,
  Bookmark,
  Folder,
  Users,
  Terminal,
  FileText,
  Palette,
  Plus,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCombobox } from "../hooks/use-category-combobox";

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

export default function AddBookmarkDialog({
  isDialogOpen,
  onDialogClose,
}: AddBookmarkDialogProps) {
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkFavicon, setBookmarkFavicon] = useState("");
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const createMutation = useCreateBookmarkMutation();
  const isSaving = createMutation.isPending;

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

  useEffect(() => {
    if (isDialogOpen) {
      setBookmarkUrl("");
      setBookmarkTitle("");
      setBookmarkFavicon("");
      setIsFetchingMeta(false);
      titleManuallyEdited.current = false;
      resetCategoryCombobox();
    }
  }, [isDialogOpen, resetCategoryCombobox]);

  const totalVisibleDropdownOptions =
    filteredCategories.length + (isNewCategoryTyped ? 1 : 0);

  const handleUrlBlur = useCallback(async () => {
    const url = bookmarkUrl.trim();
    if (!url) return;

    try {
      new URL(url);
    } catch {
      return;
    }

    setIsFetchingMeta(true);
    try {
      const meta = await fetchBookmarkMetadata(url);
      if (meta.success) {
        if (!titleManuallyEdited.current && meta.title) {
          setBookmarkTitle(meta.title);
        }
        if (meta.icon) {
          setBookmarkFavicon(meta.icon);
        }
      }
    } catch {
    } finally {
      setIsFetchingMeta(false);
    }
  }, [bookmarkUrl]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookmarkTitle(event.target.value);
    titleManuallyEdited.current = true;
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!bookmarkUrl) return;

    let hostname = bookmarkUrl;
    try {
      hostname = new URL(bookmarkUrl).hostname;
    } catch {}
    const finalTitle = bookmarkTitle.trim() || hostname;
    const finalCategory = selectedCategory.trim() || "General";

    const finalFavicon =
      bookmarkFavicon ||
      `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;

    createMutation.mutate(
      {
        url: bookmarkUrl,
        title: finalTitle,
        favicon: finalFavicon,
        categoryName: finalCategory,
        userId: "mock-user-id-123",
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            setBookmarkUrl("");
            setBookmarkTitle("");
            setBookmarkFavicon("");
            titleManuallyEdited.current = false;
            resetCategoryCombobox();
            onDialogClose();
          } else {
            alert(`Error saving bookmark: ${response.error}`);
          }
        },
        onError: () => {
          alert("Failed to save bookmark. Please try again.");
        },
      },
    );
  };

  const handleModalDismissal = () => {
    if (isSaving) return;
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
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/6 bg-zinc-950/40 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 24px 64px rgba(0,0,0,0.7)",
            }}
          >
            <div className="mb-5 flex items-center justify-between border-b border-white/4 pb-4">
              <h2 className="font-mono text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                Add New Bookmark
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSaving}
                onClick={handleModalDismissal}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-white/4 bg-white/2 text-zinc-500 transition-colors hover:border-white/1 hover:text-white disabled:opacity-40"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] font-medium tracking-widest text-zinc-500 uppercase">
                  URL / Link
                </label>
                <div className="relative">
                  <Link className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
                  <input
                    type="url"
                    required
                    value={bookmarkUrl}
                    onChange={(event) => setBookmarkUrl(event.target.value)}
                    onBlur={handleUrlBlur}
                    disabled={isSaving}
                    placeholder="https://github.com/..."
                    className="h-9 w-full rounded-xl border border-white/4 bg-zinc-900/20 pr-3 pl-9 text-xs text-zinc-200 transition-all outline-none placeholder:text-zinc-700 focus:border-white/1 focus:bg-zinc-900/40 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 font-mono text-[10px] font-medium tracking-widest text-zinc-500 uppercase">
                  Title
                  {isFetchingMeta && (
                    <Loader2 className="h-3 w-3 animate-spin text-indigo-400/70" />
                  )}
                </label>
                <div className="relative">
                  {bookmarkFavicon ? (
                    <img
                      src={bookmarkFavicon}
                      alt=""
                      className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 rounded-sm object-contain"
                    />
                  ) : (
                    <Bookmark className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
                  )}
                  <input
                    type="text"
                    value={bookmarkTitle}
                    onChange={handleTitleChange}
                    disabled={isSaving}
                    placeholder={
                      isFetchingMeta
                        ? "Extracting title…"
                        : "Website title (auto-filled from URL)"
                    }
                    className="h-9 w-full rounded-xl border border-white/4 bg-zinc-900/20 pr-3 pl-9 text-xs text-zinc-200 transition-all outline-none placeholder:text-zinc-700 focus:border-white/1 focus:bg-zinc-900/40 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={comboboxId}
                  className="block font-mono text-[10px] font-medium tracking-widest text-zinc-500 uppercase"
                >
                  Category
                </label>
                <div className="relative" ref={containerRef}>
                  <Folder className="pointer-events-none absolute top-1/2 left-3 z-10 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
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
                    disabled={isSaving}
                    placeholder="Select or type a category… (optional)"
                    className="h-9 w-full rounded-xl border border-white/4 pr-9 pl-9 text-xs text-zinc-200 transition-all outline-none placeholder:text-zinc-700 disabled:opacity-50"
                    style={{
                      background: isDropdownOpen
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(255,255,255,0.01)",
                    }}
                  />

                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label="Toggle category list"
                    disabled={isSaving}
                    onClick={handleChevronClick}
                    className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center disabled:opacity-50"
                  >
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
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
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="absolute top-[calc(100%+6px)] right-0 left-0 z-50 max-h-52 overflow-hidden overflow-y-auto rounded-xl border border-white/8 bg-[#121215] shadow-2xl"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {filteredCategories.map(
                          ({ label, icon: Icon }, itemIndex) => {
                            const isOptionActive =
                              itemIndex === activeHighlightedIndex;
                            const isOptionSelected =
                              label.toLowerCase() ===
                              selectedCategory.trim().toLowerCase();
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
                                onMouseEnter={() =>
                                  setActiveHighlightedIndex(itemIndex)
                                }
                                onMouseLeave={() =>
                                  setActiveHighlightedIndex(-1)
                                }
                                className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-xs transition-colors select-none"
                                style={{
                                  color: isOptionActive
                                    ? "rgba(255,255,255,0.9)"
                                    : "rgba(255,255,255,0.5)",
                                  background: isOptionActive
                                    ? "rgba(255,255,255,0.04)"
                                    : "transparent",
                                }}
                              >
                                <RenderIcon
                                  className="h-3.5 w-3.5 shrink-0"
                                  style={{
                                    color: isOptionActive
                                      ? "rgba(255,255,255,0.5)"
                                      : "rgba(255,255,255,0.2)",
                                  }}
                                />
                                <span className="flex-1 truncate">{label}</span>
                                {isOptionSelected && (
                                  <span className="font-mono text-[9px] font-bold tracking-wider text-indigo-400/80 uppercase">
                                    selected
                                  </span>
                                )}
                              </div>
                            );
                          },
                        )}

                        {isNewCategoryTyped && (
                          <>
                            {filteredCategories.length > 0 && (
                              <div className="border-t border-white/4" />
                            )}
                            <div
                              id={`${comboboxId}-option-${filteredCategories.length}`}
                              role="option"
                              aria-selected={false}
                              data-index={filteredCategories.length}
                              onMouseDown={(event) => {
                                event.preventDefault();
                                selectCategory(selectedCategory.trim());
                              }}
                              onMouseEnter={() =>
                                setActiveHighlightedIndex(
                                  filteredCategories.length,
                                )
                              }
                              onMouseLeave={() => setActiveHighlightedIndex(-1)}
                              className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-xs transition-colors select-none"
                              style={{
                                color:
                                  activeHighlightedIndex ===
                                  filteredCategories.length
                                    ? "#a5b4fc"
                                    : "#818cf8",
                                background:
                                  activeHighlightedIndex ===
                                  filteredCategories.length
                                    ? "rgba(129,140,248,0.06)"
                                    : "transparent",
                              }}
                            >
                              <Plus className="h-3.5 w-3.5 shrink-0" />
                              <span>
                                Create{" "}
                                <span className="font-semibold">
                                  &ldquo;{selectedCategory.trim()}&rdquo;
                                </span>
                              </span>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-end gap-2 border-t border-white/4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={isSaving}
                  onClick={handleModalDismissal}
                  className="cursor-pointer rounded-xl border border-white/4 bg-white/1 px-4 py-2 text-xs font-semibold text-zinc-500 transition-colors hover:bg-white/3 hover:text-zinc-300 disabled:opacity-40"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-black shadow-[0_4px_12px_rgba(255,255,255,0.05)] transition-all hover:bg-white disabled:opacity-50"
                >
                  <span>{isSaving ? "Saving..." : "Save Bookmark"}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

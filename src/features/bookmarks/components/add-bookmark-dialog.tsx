"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AllBookmarkIcon,
  Cancel01Icon,
  GlobeIcon,
  Folder01Icon,
  ArrowDown01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

import { fetchBookmarkMetadata } from "../actions/scrape-metadata-action";
import { useCombobox } from "../hook/use-category-combobox";
import {
  useBookmarksQuery,
  useCreateBookmarkMutation,
} from "../hook/use-bookmark-queries";
import { cn } from "@/lib/utils";
import { DEFAULT_CATEGORIES } from "../constants/categories";
import { getIconComponent } from "../utils/category-icon-registry";
import IconPicker from "./IconPicker";

interface AddBookmarkDialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
}

function normalizeUrl(value: string) {
  const trimmedUrl = value.trim();
  if (!trimmedUrl) return "";
  if (/^https?:\/\//i.test(trimmedUrl)) return trimmedUrl;
  return `https://${trimmedUrl}`;
}

function getUrlParts(value: string) {
  const normalizedUrl = normalizeUrl(value);
  try {
    const parsedUrl = new URL(normalizedUrl);
    return {
      hostname: parsedUrl.hostname,
      normalizedUrl,
      isValid:
        parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:",
    };
  } catch {
    return { hostname: "", normalizedUrl, isValid: false };
  }
}

export default function AddBookmarkDialog({
  isDialogOpen,
  onDialogClose,
}: AddBookmarkDialogProps) {
  const { data } = authClient.useSession();
  const userId = data?.user?.id || null;
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkFavicon, setBookmarkFavicon] = useState("");
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [categoryIcon, setCategoryIcon] = useState<string>("Folder01Icon");

  const { data: savedCategories = [] } = useBookmarksQuery(userId);
  const createMutation = useCreateBookmarkMutation();
  const isSaving = createMutation.isPending;

  const latestMetadataRequestRef = useRef(0);
  const titleManuallyEdited = useRef(false);
  const categoryOptions = useMemo(() => {
    const categories = [
      ...DEFAULT_CATEGORIES,
      ...savedCategories.map((category) => ({
        label: category.name,
        icon: category.icon,
      })),
    ];
    const uniqueCategories = new Map<string, (typeof categories)[number]>();

    for (const category of categories) {
      uniqueCategories.set(category.label.trim().toLowerCase(), category);
    }

    return [...uniqueCategories.values()].map((category) => ({
      label: category.label,
      icon: getIconComponent(category.icon),
    }));
  }, [savedCategories]);

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
  } = useCombobox(categoryOptions);

  const isNewCategorySelected = useMemo(() => {
    if (!selectedCategory) return false;
    return !categoryOptions.some(
      (category) =>
        category.label.toLowerCase() === selectedCategory.trim().toLowerCase(),
    );
  }, [categoryOptions, selectedCategory]);

  const urlState = useMemo(() => getUrlParts(bookmarkUrl), [bookmarkUrl]);
  const canSubmit =
    Boolean(bookmarkUrl.trim()) && urlState.isValid && !isSaving && !isSuccess;

  const resetForm = useCallback(() => {
    setBookmarkUrl("");
    setBookmarkTitle("");
    setBookmarkFavicon("");
    setIsFetchingMeta(false);
    setFormError("");
    setIsSuccess(false);
    setCategoryIcon("Folder01Icon");
    titleManuallyEdited.current = false;
    latestMetadataRequestRef.current += 1;
    resetCategoryCombobox();
  }, [resetCategoryCombobox]);

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

  // Jab user URL box se bahar click kare tab metadata scrape hoga
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
        setFormError("Failed to fetch metadata. You can save manually.");
      }
    } finally {
      if (latestMetadataRequestRef.current === requestId) {
        setIsFetchingMeta(false);
      }
    }
  }, [bookmarkUrl]);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { hostname, normalizedUrl, isValid } = getUrlParts(bookmarkUrl);
    if (!isValid) {
      setFormError("Please enter a valid URL.");
      return;
    }

    const finalTitle = bookmarkTitle.trim() || hostname;
    const finalCategory = selectedCategory.trim() || "General";
    const finalFavicon =
      bookmarkFavicon ||
      `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;

    if (!userId) {
      setFormError("Unauthorized user session.");
      return;
    }

    createMutation.mutate(
      {
        url: normalizedUrl,
        title: finalTitle,
        favicon: finalFavicon,
        categoryName: finalCategory,
        categoryIcon: isNewCategorySelected ? categoryIcon : undefined,
        userId: userId,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            resetForm();
            onDialogClose();
          }, 800); // 800ms success animation text state hold karne ke liye
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
          {/* Backdrop Blur Overlays */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleModalDismissal}
          />

          {/* Main Card Dialog Box */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 shadow-inner">
                  <HugeiconsIcon
                    icon={AllBookmarkIcon}
                    size={16}
                    className="text-zinc-300"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-white">
                    Add Bookmark
                  </h2>
                  <p className="text-[10px] tracking-wider text-zinc-500 uppercase">
                    Save and organize links
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isSaving || isSuccess}
                onClick={handleModalDismissal}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-transparent text-zinc-500 transition-colors hover:border-zinc-800 hover:bg-zinc-900 hover:text-white disabled:opacity-40"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* URL Input */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <HugeiconsIcon
                    icon={GlobeIcon}
                    size={14}
                    className="text-zinc-500 transition-colors group-focus-within:text-zinc-300"
                  />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={bookmarkUrl}
                  onChange={(e) => {
                    setBookmarkUrl(e.target.value);
                    setFormError("");
                  }}
                  onBlur={handleUrlBlur}
                  disabled={isSaving || isSuccess}
                  placeholder="https://example.com"
                  className="h-9 w-full rounded-xl border border-zinc-900 bg-zinc-950 pr-3 pl-9 text-xs text-zinc-200 transition-all outline-none placeholder:text-zinc-600 focus:border-zinc-800 focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-800 disabled:opacity-50"
                />
                {formError && (
                  <p className="mt-1 text-xs text-red-500">{formError}</p>
                )}
              </div>

              <AnimatePresence>
                {bookmarkUrl.trim() && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden pt-1"
                  >
                    {/* Live Preview Block */}
                    <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-3.5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold tracking-widest text-zinc-600 uppercase">
                          Preview
                        </span>
                        {isFetchingMeta && (
                          <Loader2 className="h-3 w-3 animate-spin text-zinc-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-900 bg-zinc-950">
                          {isFetchingMeta ? (
                            <div className="h-full w-full animate-pulse bg-zinc-900" />
                          ) : bookmarkFavicon ? (
                            <img
                              src={bookmarkFavicon}
                              alt=""
                              className="h-4 w-4 object-contain"
                            />
                          ) : (
                            <HugeiconsIcon
                              icon={AllBookmarkIcon}
                              size={14}
                              className="text-zinc-600"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          {isFetchingMeta ? (
                            <div className="space-y-1.5 py-0.5">
                              <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-900" />
                              <div className="h-2 w-1/2 animate-pulse rounded bg-zinc-900/60" />
                            </div>
                          ) : (
                            <>
                              <h3 className="truncate text-xs font-medium text-zinc-200">
                                {bookmarkTitle ||
                                  urlState.hostname ||
                                  "Untitled Site"}
                              </h3>
                              <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                                {urlState.hostname || "domain.com"}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="shrink-0">
                          <span className="rounded-md border border-zinc-900 bg-zinc-900/40 px-2 py-0.5 text-[10px] text-zinc-400">
                            {selectedCategory || "General"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Form Controls Grid */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Custom Title Input */}
                      <div className="space-y-1">
                        <label className="pl-0.5 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                          Title
                        </label>
                        <input
                          type="text"
                          value={bookmarkTitle}
                          onChange={(e) => {
                            setBookmarkTitle(e.target.value);
                            titleManuallyEdited.current = true;
                          }}
                          disabled={isSaving || isSuccess}
                          placeholder={
                            isFetchingMeta ? "Extracting..." : "Custom title"
                          }
                          className="h-8.5 w-full rounded-lg border border-zinc-900 bg-zinc-950 px-2.5 text-xs text-zinc-200 outline-none focus:border-zinc-800"
                        />
                      </div>

                      {/* Searchable Combobox Category Selector */}
                      <div className="space-y-1">
                        <label className="pl-0.5 font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
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
                            autoComplete="off"
                            value={selectedCategory}
                            onChange={handleInputChange}
                            onFocus={openDropdown}
                            onKeyDown={handleKeyDown}
                            disabled={isSaving || isSuccess}
                            placeholder="Select category..."
                            className="h-8.5 w-full rounded-lg border border-zinc-900 bg-zinc-950 px-2.5 pr-7 text-xs text-zinc-200 outline-none focus:border-zinc-800"
                          />
                          <button
                            type="button"
                            onClick={handleChevronClick}
                            disabled={isSaving || isSuccess}
                            className="absolute top-1/2 right-2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            <HugeiconsIcon
                              icon={ArrowDown01Icon}
                              size={12}
                              className={cn(
                                "transition-transform duration-200",
                                isDropdownOpen && "rotate-180",
                              )}
                            />
                          </button>

                          {/* Dropdown Options List */}
                          <AnimatePresence>
                            {isDropdownOpen &&
                              totalVisibleDropdownOptions > 0 && (
                                <motion.div
                                  ref={listRef}
                                  id={listboxId}
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="absolute right-0 left-0 z-50 max-h-40 overflow-y-auto rounded-lg border border-zinc-900 bg-zinc-950 p-1 shadow-xl"
                                  style={{ scrollbarWidth: "none" }}
                                >
                                  {filteredCategories.map(
                                    ({ label, icon: Icon }, idx) => {
                                      const isActive =
                                        idx === activeHighlightedIndex;
                                      const isSelected =
                                        label.toLowerCase() ===
                                        selectedCategory.trim().toLowerCase();
                                      const icon = Icon || Folder01Icon;

                                      return (
                                        <div
                                          key={label}
                                          role="option"
                                          aria-selected={isSelected}
                                          data-index={idx}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            selectCategory(label);
                                          }}
                                          onMouseEnter={() =>
                                            setActiveHighlightedIndex(idx)
                                          }
                                          onMouseLeave={() =>
                                            setActiveHighlightedIndex(-1)
                                          }
                                          className={cn(
                                            "flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors select-none",
                                            isActive
                                              ? "bg-zinc-900 text-zinc-200"
                                              : "text-zinc-400",
                                          )}
                                        >
                                          <HugeiconsIcon
                                            icon={icon}
                                            size={12}
                                            className="opacity-60"
                                          />
                                          <span className="flex-1 truncate">
                                            {label}
                                          </span>
                                          {isSelected && (
                                            <HugeiconsIcon
                                              icon={Tick02Icon}
                                              size={12}
                                              className="text-zinc-400"
                                            />
                                          )}
                                        </div>
                                      );
                                    },
                                  )}

                                  {/* Create New Custom Category Button */}
                                  {isNewCategoryTyped && (
                                    <div
                                      role="option"
                                      aria-selected={false}
                                      data-index={filteredCategories.length}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        selectCategory(selectedCategory.trim());
                                      }}
                                      className={cn(
                                        "mt-1 flex w-full cursor-pointer items-center gap-2 rounded-md border border-dashed border-zinc-900 px-2.5 py-1.5 text-xs text-zinc-400 select-none hover:bg-zinc-900/40 hover:text-zinc-200",
                                      )}
                                    >
                                      <span className="truncate">
                                        Create &ldquo;{selectedCategory.trim()}
                                        &rdquo;
                                      </span>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Custom Category Icon Picker Panel */}
                    <AnimatePresence>
                      {isNewCategorySelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pt-1"
                        >
                          <IconPicker
                            value={categoryIcon}
                            onChange={setCategoryIcon}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Actions Footer Panel */}
              <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-4">
                <button
                  type="button"
                  disabled={isSaving || isSuccess}
                  onClick={handleModalDismissal}
                  className="cursor-pointer rounded-lg border border-zinc-900 bg-transparent px-3.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    "flex min-w-25 cursor-pointer items-center justify-center rounded-lg px-4 py-1.5 text-xs font-medium transition-colors",
                    isSuccess
                      ? "bg-zinc-100 font-semibold text-zinc-950"
                      : "bg-zinc-100 text-zinc-950 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40",
                  )}
                >
                  {isSuccess
                    ? "Saved!"
                    : isSaving
                      ? "Saving..."
                      : "Add Bookmark"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

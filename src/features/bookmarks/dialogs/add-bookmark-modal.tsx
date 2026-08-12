"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BookmarkItem, BookmarkCategory } from "../components/bookmark-card";
import { bookmarkSchema } from "@/lib/validations/bookmark";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { IconsPicker } from "../components/icons-picker";
import { getIconComponent } from "../utils/category-icon-registry";
import { HugeiconsIcon } from "@hugeicons/react";
import { X, Check, Globe, Sparkles, Loader2 } from "lucide-react";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    url: string;
    description?: string;
    categoryId?: string;
    tags: string[];
    favicon?: string;
  }) => void;
  categories: BookmarkCategory[];
  initialData?: BookmarkItem | null;
}

export function AddBookmarkModal({
  isOpen,
  onClose,
  onSave,
  categories,
  initialData = null,
}: AddBookmarkModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [favicon, setFavicon] = useState("");
  const [favError, setFavError] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryIcon, setCategoryIcon] = useState<string>("Folder01Icon");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const addCategory = useBookmarkStore((state) => state.addCategory);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setUrl(initialData.url || "");
      setFavicon(initialData.favicon || "");
      setSelectedCategoryId(initialData.category?.id || "");
      setCategoryName(initialData.category?.name || "");
      setCategoryIcon(initialData.category?.icon || "Folder01Icon");
    } else {
      setTitle("");
      setUrl("");
      setFavicon("");
      setSelectedCategoryId("");
      setCategoryName("");
      setCategoryIcon("Folder01Icon");
    }
    setFavError(false);
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!url || url.trim().length < 4) {
      if (!initialData?.favicon) setFavicon("");
      return;
    }

    const abortController = new AbortController();

    const timer = setTimeout(() => {
      let formatted = url.trim();
      if (!/^https?:\/\//i.test(formatted)) {
        formatted = `https://${formatted}`;
      }

      try {
        const parsed = new URL(formatted);
        const domain = parsed.hostname.replace(/^www\./, "");
        if (domain && domain.includes(".")) {
          setFavicon(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
          setFavError(false);
          handleFetchMetadata(formatted, abortController.signal);
        }
      } catch {}
    }, 550);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [url]);

  if (!isOpen || !mounted) return null;

  const handleFetchMetadata = async (urlToFetch?: string, signal?: AbortSignal) => {
    const targetUrl = urlToFetch || url;
    if (!targetUrl || targetUrl.trim().length < 4) return;

    let formattedUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      setIsFetchingMeta(true);
      const res = await fetch(
        `/api/bookmark/metadata?url=${encodeURIComponent(formattedUrl)}`,
        { signal }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.title && (!title || title.trim() === "")) {
          setTitle(data.title);
        }
        if (data.favicon) {
          setFavicon(data.favicon);
          setFavError(false);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Error fetching metadata:", err);
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let formattedUrl = url.trim();
    if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const validationResult = bookmarkSchema.safeParse({
      title: title.trim(),
      url: formattedUrl,
      categoryId: selectedCategoryId,
      tags: [],
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    let finalCategoryId = selectedCategoryId;
    if (!finalCategoryId && categoryName.trim()) {
      const existing = categories.find(
        (c) => c.name.toLowerCase() === categoryName.trim().toLowerCase()
      );
      if (existing) {
        finalCategoryId = existing.id;
      } else {
        const newCatId = `cat-${Date.now()}`;
        await addCategory({
          id: newCatId,
          name: categoryName.trim(),
          icon: categoryIcon,
        });
        finalCategoryId = newCatId;
      }
    }

    onSave({
      title: title.trim(),
      url: formattedUrl,
      categoryId: finalCategoryId || undefined,
      tags: [],
      favicon: favicon || undefined,
    });

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-md p-4 sm:p-6">
      <div className="my-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-paper-2 border border-line-2 p-6 shadow-2xl relative text-ink animate-in fade-in zoom-in-95 duration-200 scrollbar-none">
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute top-4 right-4 rounded-full p-2 text-ink-3 hover:text-ink hover:bg-paper-3 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-display font-semibold text-ink mb-1">
          {initialData ? "Edit Bookmark" : "Add New Bookmark"}
        </h2>
        <p className="text-xs text-ink-3 mb-6">
          Save a web resource with custom title and category
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code">
              Website URL *
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex h-5 w-5 items-center justify-center">
                {favicon && !favError ? (
                  <img
                    src={favicon}
                    alt=""
                    className="h-4 w-4 object-contain rounded"
                    onError={() => setFavError(true)}
                  />
                ) : (
                  <Globe className="h-4 w-4 text-ink-3" />
                )}
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-paper-card border text-ink text-sm focus:outline-none transition ${
                  errors.url
                    ? "border-rose-500/80 focus:border-rose-500"
                    : "border-line-2 focus:border-ink"
                }`}
              />

              <div className="absolute right-3 flex items-center">
                {isFetchingMeta ? (
                  <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleFetchMetadata()}
                    disabled={!url.trim()}
                    title="Auto-fetch Title"
                    className="text-ink-4 hover:text-indigo-400 disabled:opacity-30 transition cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {errors.url && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.url}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5 uppercase tracking-wider font-code">
              Bookmark Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js Documentation"
              className={`w-full px-4 py-2.5 rounded-xl bg-paper-card border text-ink text-sm focus:outline-none transition ${
                errors.title
                  ? "border-rose-500/80 focus:border-rose-500"
                  : "border-line-2 focus:border-ink"
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-ink-2 uppercase tracking-wider font-code">
              Category
            </label>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId("");
                    setCategoryName("");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                    selectedCategoryId === "" && categoryName === ""
                      ? "bg-ink text-paper border-ink"
                      : "bg-paper-3 text-ink-3 border-line-2 hover:border-ink"
                  }`}
                >
                  None
                </button>
                {categories.map((cat) => {
                  const CatIcon = getIconComponent(cat.icon);
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setCategoryName(cat.name);
                        if (cat.icon) setCategoryIcon(cat.icon);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        isSelected
                          ? "bg-ink text-paper border-ink"
                          : "bg-paper-3 text-ink-3 border-line-2 hover:border-ink"
                      }`}
                    >
                      <HugeiconsIcon icon={CatIcon} size={14} className="shrink-0" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <input
              type="text"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setSelectedCategoryId("");
              }}
              placeholder="Category name (e.g. Design, Development, Tools)..."
              className="w-full px-4 py-2.5 rounded-xl bg-paper-card border border-line-2 text-ink text-sm focus:outline-none focus:border-ink transition"
            />

            <div className="pt-1">
              <label className="block text-[11px] font-medium text-ink-3 mb-1">
                Category Icon
              </label>
              <IconsPicker
                selectedIcon={categoryIcon}
                onSelectIcon={(icon) => setCategoryIcon(icon)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-ink-3 hover:text-ink transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-ink text-paper font-medium text-xs hover:bg-ink-2 transition shadow-sm active:translate-y-px cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{initialData ? "Save Changes" : "Add Bookmark"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default AddBookmarkModal;

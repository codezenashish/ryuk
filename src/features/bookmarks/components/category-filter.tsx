"use client";

import { BookmarkCategory, BookmarkItem } from "./bookmark-card";
import { Layers } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { getIconComponent } from "../utils/category-icon-registry";

interface CategoryFilterProps {
  categories: BookmarkCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  bookmarks?: BookmarkItem[];
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
  bookmarks = [],
  className = "",
}: CategoryFilterProps) {
  // Calculate count for each category
  const getCategoryCount = (catId: string) => {
    return bookmarks.filter((b) => b.category?.id === catId).length;
  };

  const totalCount = bookmarks.length;

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none ${className}`}>
      {/* "All" Filter Pill */}
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition cursor-pointer shrink-0 ${
          selectedCategoryId === null
            ? "bg-ink text-paper shadow-sm"
            : "bg-paper-2 text-ink-3 hover:bg-paper-3 hover:text-ink border border-line"
        }`}
      >
        <Layers className="h-3.5 w-3.5" />
        <span>All Bookmarks</span>
        <span
          className={`ml-0.5 rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
            selectedCategoryId === null
              ? "bg-paper/20 text-paper"
              : "bg-paper-card text-ink-3"
          }`}
        >
          {totalCount}
        </span>
      </button>

      {/* Category Pills with Icons */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        const count = getCategoryCount(cat.id);
        const CatIcon = getIconComponent(cat.icon);

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition cursor-pointer shrink-0 ${
              isSelected
                ? "bg-ink text-paper shadow-sm"
                : "bg-paper-2 text-ink-3 hover:bg-paper-3 hover:text-ink border border-line"
            }`}
          >
            <HugeiconsIcon icon={CatIcon} size={15} className="shrink-0" />
            <span>{cat.name}</span>
            {count > 0 && (
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                  isSelected
                    ? "bg-paper/20 text-paper"
                    : "bg-paper-card text-ink-3"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;

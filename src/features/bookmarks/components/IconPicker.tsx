"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { POPULAR_ICONS } from "../constants/categories";
import { getIconComponent } from "../utils/category-icon-registry";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-stone-200 dark:border-white/6 bg-stone-50 dark:bg-white/2 p-3">
      <span className="block font-mono text-[9px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">
        Select Custom Icon
      </span>

      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {POPULAR_ICONS.map((iconName) => {
          const icon = getIconComponent(iconName);
          const isSelected = value === iconName;

          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              className={cn(
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-stone-600 dark:text-stone-400 transition-all duration-150 hover:bg-stone-200/60 dark:hover:bg-white/8 hover:text-stone-900 dark:hover:text-white",
                isSelected
                  ? "border-stone-300 dark:border-white/14 bg-stone-200 dark:bg-white/10 text-stone-900 dark:text-stone-100"
                  : "border-transparent bg-transparent",
              )}
            >
              <HugeiconsIcon icon={icon} size={16} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

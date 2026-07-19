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
    <div className="space-y-2 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-3">
      <span className="block font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
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
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-zinc-400 transition-all duration-150 hover:bg-zinc-900 hover:text-white",
                isSelected
                  ? "border-zinc-700 bg-zinc-900 text-zinc-200"
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

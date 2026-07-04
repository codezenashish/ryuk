"use client";

import { motion } from "framer-motion";
import { getIconComponent } from "../utils/category-icon-registry";
import { POPULAR_ICONS } from "../constants/categories";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
      <p className="mb-2 px-1 text-xs font-medium text-zinc-400">
        Select an Icon
      </p>
      <div className="grid grid-cols-8 gap-2 sm:grid-cols-8">
        {POPULAR_ICONS.map((iconString) => {
          const IconComponent = getIconComponent(iconString);
          const isSelected = value === iconString;

          return (
            <motion.button
              key={iconString}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(iconString)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                isSelected
                  ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                  : "border-transparent text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
              }`}
            >
              <IconComponent size={18} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

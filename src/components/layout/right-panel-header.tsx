"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  BellDotIcon,
  Search01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";


interface RightPanelHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function RightPanelHeader({
  isOpen,
  onToggle,
}: RightPanelHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-2 border-b border-line px-3 bg-paper/80 backdrop-blur-xl shrink-0">
      <div className="relative flex-1">
        <HugeiconsIcon
          icon={Search01Icon}
          size={15}
          strokeWidth={2}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-4 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-8 rounded-lg border border-line bg-paper-3/50 pl-8 pr-14 text-xs text-ink placeholder:text-ink-4 outline-none transition focus:border-line-strong focus:bg-paper-3 font-body"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none select-none rounded border border-line-2 bg-paper-3 px-1.5 py-0.5 font-code text-[10px] leading-none text-ink-4">
          ⌘K
        </kbd>
      </div>

      <button
        className="relative rounded-lg p-1.5 text-ink-3 transition hover:bg-paper-3 hover:text-ink"
        aria-label="Notifications"
      >
        <HugeiconsIcon icon={BellDotIcon} size={17} strokeWidth={1.8} />
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-paper" />
      </button>

      <button
        className="rounded-full ring-2 ring-transparent transition hover:ring-line-2"
        aria-label="User menu"
      >
        
      </button>

      <button
        onClick={onToggle}
        title={isOpen ? "Collapse panel" : "Expand panel"}
        className={`flex items-center justify-center p-1.5 rounded-lg border transition-all ${
          isOpen
            ? "border-line-2 text-ink-3 hover:text-ink hover:bg-paper-3"
            : "border-emerald-mark/40 bg-emerald-mark/10 text-emerald-mark hover:bg-emerald-mark/20"
        }`}
        aria-label={isOpen ? "Collapse panel" : "Expand panel"}
      >
        <HugeiconsIcon
          icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
          size={17}
          strokeWidth={1.8}
        />
      </button>
    </header>
  );
}

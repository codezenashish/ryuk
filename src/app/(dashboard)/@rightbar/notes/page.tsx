import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Note01Icon,
  PencilEdit02Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";

export default function NotesRightbar() {
  return (
    <div className="flex flex-col gap-6 p-5 h-full  text-ink font-body  text-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <h2 className="font-display text-base font-semibold text-ink flex items-center gap-2">
          <HugeiconsIcon icon={Note01Icon} size={18} className="text-purple-400" />
          Notes & Tags
        </h2>
        <span className="font-mono text-[10px] tracking-wider uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          32 Notes
        </span>
      </div>

      {/* Quick Scratchpad */}
      <div className="flex flex-col gap-2">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3 flex items-center gap-1.5">
          <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
          Quick Scratchpad
        </div>
        <textarea
          placeholder="Jot down a quick thought..."
          rows={4}
          className="w-full rounded-xl border border-line bg-paper-3/40 p-3 text-xs text-ink placeholder:text-ink-4 focus:outline-none focus:border-purple-500/50 transition resize-none"
        />
      </div>

      {/* Popular Tags */}
      <div className="flex flex-col gap-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3 flex items-center gap-1.5">
          <HugeiconsIcon icon={Tag01Icon} size={14} />
          Popular Tags
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-1 rounded-md bg-paper-3 border border-line-2 text-[11px] text-ink-2 hover:border-purple-400/40 hover:text-purple-300 transition cursor-pointer">
            #ideas (12)
          </span>
          <span className="px-2 py-1 rounded-md bg-paper-3 border border-line-2 text-[11px] text-ink-2 hover:border-purple-400/40 hover:text-purple-300 transition cursor-pointer">
            #work (9)
          </span>
          <span className="px-2 py-1 rounded-md bg-paper-3 border border-line-2 text-[11px] text-ink-2 hover:border-purple-400/40 hover:text-purple-300 transition cursor-pointer">
            #snippets (6)
          </span>
          <span className="px-2 py-1 rounded-md bg-paper-3 border border-line-2 text-[11px] text-ink-2 hover:border-purple-400/40 hover:text-purple-300 transition cursor-pointer">
            #todo (5)
          </span>
        </div>
      </div>

      {/* Create Note */}
      <div className="mt-auto border-t border-line pt-4">
        <button className="w-full py-2 px-3 rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium transition flex items-center justify-center gap-2 cursor-pointer">
          <span>+ Create New Note</span>
        </button>
      </div>
    </div>
  );
}

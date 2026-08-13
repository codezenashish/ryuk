import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark01Icon,
  Folder01Icon,
  GlobalIcon,
} from "@hugeicons/core-free-icons";

export default function BookmarksRightbar() {
  return (
    <div className="flex flex-col gap-6 p-5 h-full  text-ink font-body text-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <h2 className="body-text">
          <HugeiconsIcon icon={Bookmark01Icon} size={18} className="text-amber-400" />
          Bookmarks Hub
        </h2>
        <span className="font-mono text-[10px] tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          48 Saved
        </span>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3 flex items-center gap-1.5">
          <HugeiconsIcon icon={Folder01Icon} size={14} />
          Folders
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-lg border border-line-2 bg-paper-3/20 hover:border-line transition cursor-pointer">
            <span className="text-xs text-ink font-medium">💻 Developer Tools</span>
            <span className="text-[10px] font-mono text-ink-3 bg-paper-card px-1.5 py-0.5 rounded">18</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-line-2 bg-paper-3/20 hover:border-line transition cursor-pointer">
            <span className="text-xs text-ink font-medium">🎨 Design Inspiration</span>
            <span className="text-[10px] font-mono text-ink-3 bg-paper-card px-1.5 py-0.5 rounded">15</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-line-2 bg-paper-3/20 hover:border-line transition cursor-pointer">
            <span className="text-xs text-ink font-medium">📚 Long Reads</span>
            <span className="text-[10px] font-mono text-ink-3 bg-paper-card px-1.5 py-0.5 rounded">15</span>
          </div>
        </div>
      </div>

      {/* Top Domains */}
      <div className="flex flex-col gap-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3 flex items-center gap-1.5">
          <HugeiconsIcon icon={GlobalIcon} size={14} />
          Top Domains
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-ink-2">
            <span>github.com</span>
            <span className="font-mono text-[11px] text-ink-3">22 links</span>
          </div>
          <div className="flex items-center justify-between text-ink-2">
            <span>dribbble.com</span>
            <span className="font-mono text-[11px] text-ink-3">12 links</span>
          </div>
          <div className="flex items-center justify-between text-ink-2">
            <span>nextjs.org</span>
            <span className="font-mono text-[11px] text-ink-3">8 links</span>
          </div>
        </div>
      </div>

      {/* Quick Add */}
      <div className="mt-auto border-t border-line pt-4">
        <button className="w-full py-2 px-3 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium transition flex items-center justify-center gap-2 cursor-pointer">
          <span>+ Add Bookmark URL</span>
        </button>
      </div>
    </div>
  );
}

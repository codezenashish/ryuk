import React from "react";

export default function RightbarDefault() {
  return (
    <div className="flex flex-col gap-4 p-5 h-full text-ink font-body text-sm">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <h2 className="font-display text-base font-semibold text-ink">
          Panel
        </h2>
        <span className="font-mono text-[10px] tracking-wider uppercase text-ink-3">
          Overview
        </span>
      </div>
      <p className="text-xs text-ink-3">Select a section to view details.</p>
    </div>
  );
}

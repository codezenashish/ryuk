import React from "react";

export default function RightbarDefault() {
  return (
    <div className="flex flex-col gap-4 p-5 h-full text-foreground font-sans text-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="font-sans text-base font-semibold text-foreground">
          Panel
        </h2>
        <span className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
          Overview
        </span>
      </div>
      <p className="text-xs text-muted-foreground">Select a section to view details.</p>
    </div>
  );
}

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  CheckListIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";

export default function DashboardRightbar() {
  return (
    <div className="flex flex-col gap-6 p-5 h-full text-foreground font-sans  text-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="font-sans text-base font-semibold text-foreground flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Dashboard Stats
        </h2>
        <span className="font-mono text-[10px] tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Live
        </span>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border border-border bg-muted/40">
          <div className="text-xs text-muted-foreground font-mono">Storage</div>
          <div className="text-lg font-sans font-medium text-foreground mt-1">4.2 GB</div>
          <div className="w-full bg-border h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[42%]" />
          </div>
        </div>
        <div className="p-3 rounded-xl border border-border bg-muted/40">
          <div className="text-xs text-muted-foreground font-mono">Tasks</div>
          <div className="text-lg font-sans font-medium text-foreground mt-1">12 Pending</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <HugeiconsIcon icon={CheckListIcon} size={12} /> 8 completed
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col gap-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <HugeiconsIcon icon={Activity01Icon} size={14} />
          Recent Activity
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border bg-muted/20">
            <span className="p-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <HugeiconsIcon icon={ZapIcon} size={14} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">Created &quot;Launch Plan&quot; note</p>
              <span className="text-[10px] text-muted-foreground font-mono">10 mins ago</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border bg-muted/20">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HugeiconsIcon icon={CheckListIcon} size={14} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">Saved Next.js documentation</p>
              <span className="text-[10px] text-muted-foreground font-mono">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="mt-auto border-t border-border pt-4">
        <button className="w-full py-2 px-3 rounded-lg border border-border bg-muted hover:bg-card text-foreground text-xs font-medium transition flex items-center justify-center gap-2 cursor-pointer">
          <span>+ Quick Action</span>
        </button>
      </div>
    </div>
  );
}

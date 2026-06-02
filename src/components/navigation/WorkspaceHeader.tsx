"use client";

import {
  RiGiftLine,
  RiNotification3Line,
  RiSearchLine,
  RiTimerLine,
} from "react-icons/ri";

const actions = [
  {
    icon: RiTimerLine,
    label: "Timer",
  },
  {
    icon: RiNotification3Line,
    label: "Notifications",
    notification: true,
  },
  {
    icon: RiGiftLine,
    label: "Rewards",
  },
];

export default function WorkspaceHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-lg px-6">
      <div className="flex items-center gap-4 flex-1">
        <span className="text-lg font-bold tracking-tight text-white font-mono select-none shrink-0">
          Dev<span className="text-indigo-500">Nest</span>
        </span>

        <div className="group relative w-full max-w-[200px]">
          <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-8 w-full rounded-xl border border-white/6 bg-white/2 pl-9 pr-12 text-xs text-zinc-200 outline-none transition-all placeholder:text-zinc-600 focus:border-white/[0.12] focus:bg-white/[0.04]"
          />
          <kbd className="absolute right-2.5 top-1/2 flex h-4.5 -translate-y-1/2 items-center rounded border border-white/[0.08] bg-white/[0.04] px-1 font-mono text-[9px] text-zinc-500">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="relative flex size-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-400 transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white active:scale-95"
              >
                <Icon size={15} />
                {action.notification && (
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-red-500 ring-1 ring-black" />
                )}
              </button>
            );
          })}
        </div>

        <div className="h-5 w-px bg-white/[0.08]" />

        <button className="group flex items-center gap-3 rounded-xl border border-transparent px-1 py-0.5 transition-all hover:bg-white/[0.03]">
          <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-semibold text-white transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            A
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">Ashish Kumar</p>
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">Free Plan</span>
          </div>
        </button>
      </div>
    </header>
  );
}
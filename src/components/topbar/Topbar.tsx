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

export default function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-900 bg-zinc-950 px-6">
      {/* Search */}
      <div className="group relative w-full max-w-xs">
        <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-zinc-400" />

        <input
          type="text"
          placeholder="Search everything..."
          className="h-9 w-full rounded-xl border border-zinc-900 bg-zinc-950 pl-10 pr-14 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-500 focus:border-zinc-700 focus:bg-zinc-900"
        />

        <kbd className="absolute right-3 top-1/2 flex h-5 -translate-y-1/2 items-center rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] text-zinc-500">
          ⌘K
        </kbd>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Actions */}
        <div className="flex items-center gap-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                className="relative flex size-9 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-400 transition-all hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100 active:scale-95"
              >
                <Icon size={17} />

                {action.notification && (
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-zinc-950" />
                )}
              </button>
            );
          })}
        </div>

        <div className="h-5 w-px bg-zinc-900" />

        {/* Profile */}
        <button className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-1 transition-all hover:border-zinc-900 hover:bg-zinc-900">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500 text-sm font-semibold text-white transition-transform group-hover:scale-105">
            A
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-zinc-100">
              Ashish Kumar
            </p>

            <span className="text-[11px] uppercase tracking-wide text-zinc-500">
              Free Plan
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
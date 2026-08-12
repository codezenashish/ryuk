import { HugeiconsIcon } from "@hugeicons/react";
import {
  Note01Icon,
  Target02Icon,
  TerminalIcon,
  Search01Icon,
  CloudSyncIcon,
  Download01Icon,
} from "@hugeicons/core-free-icons";

const cells = [
  {
    num: "01",
    title: (
      <>
        Everything, <span className="font-normal text-ink-3">one place</span>
      </>
    ),
    desc: "Notes, habits, bookmarks, CLI, sketches, and snippets — all inside Ryuk. No more switching between five different apps to get through your day.",
    icon: "notes",
  },
  {
    num: "02",
    title: (
      <>
        Built to <span className="font-normal text-ink-3">grow with you</span>
      </>
    ),
    desc: "New tools ship as modules that slot right into your existing workspace. Nothing you already built ever breaks or gets left behind.",
    icon: "grow",
  },
  {
    num: "03",
    title: (
      <>
        Powerful CLI <span className="font-normal text-ink-3">& fast capture</span>
      </>
    ),
    desc: "Access notes, save bookmarks, or manage snippets directly from your terminal or app in seconds. Ryuk never slows you down.",
    icon: "cli",
  },
  {
    num: "04",
    title: (
      <>
        Findable, <span className="font-normal text-ink-3">automatically</span>
      </>
    ),
    desc: "Search across notes, snippets, and bookmarks at once. Tag something once and Ryuk keeps it within reach forever.",
    icon: "search",
  },
  {
    num: "05",
    title: "Synced everywhere",
    desc: "Web, desktop, CLI, mobile — your workspace updates instantly across every device and terminal. Start in terminal, finish on laptop.",
    icon: "sync",
  },
  {
    num: "06",
    title: (
      <>
        Your data, <span className="font-normal text-ink-3">always yours</span>
      </>
    ),
    desc: "Export anything, anytime, in formats you can actually use. Nothing you save in Ryuk is ever locked in.",
    icon: "export",
  },
] as const;

type CellIconName = (typeof cells)[number]["icon"];

const iconMap: Record<CellIconName, typeof Note01Icon> = {
  notes: Note01Icon,
  grow: Target02Icon,
  cli: TerminalIcon,
  search: Search01Icon,
  sync: CloudSyncIcon,
  export: Download01Icon,
};

function CellIcon({ icon }: { icon: CellIconName }) {
  return (
    <HugeiconsIcon
      icon={iconMap[icon]}
      size={22}
      color="currentColor"
      strokeWidth={1.6}
    />
  );
}

export function WhyGrid() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-7xl px-8 py-24">
        <div className="mb-16 grid grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2.5 font-code text-[11px] tracking-[0.18em] uppercase text-ink-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-mark shadow-[0_0_0_3px_rgba(25,179,133,0.18)]" />
              Why Ryuk
            </div>
            <h2 className="mt-4.5 font-display text-[clamp(38px,4.6vw,64px)] leading-[1.02] font-[380] tracking-[-0.028em] [&_.soft]:text-ink-3">
              One place for
              <br />
              everything <span className="soft">you build.</span>
            </h2>
          </div>
          <p className="max-w-[56ch] font-body text-[18px] leading-[1.55] text-ink-2">
            Ryuk brings notes, habits, bookmarks, snippets, CLI, and sketches into a
            single, fast, always-in-sync workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell) => (
            <div
              key={cell.num}
              className="flex min-h-60 flex-col gap-3.5 border-r border-b border-line p-9"
            >
              <div className="flex items-start justify-between">
                <span className="font-code text-[11px] tracking-[0.12em] text-ink-4">
                  {cell.num}
                </span>
                <span className="text-ink-3">
                  <CellIcon icon={cell.icon} />
                </span>
              </div>
              <div className="font-display text-[26px] leading-[1.1] tracking-[-0.02em]">
                {cell.title}
              </div>
              <p className="text-[14.5px] leading-[1.55] text-ink-2">
                {cell.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

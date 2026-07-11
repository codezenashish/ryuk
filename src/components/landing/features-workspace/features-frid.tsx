import { FiLock } from "react-icons/fi";

export function BookmarkPreview() {
  const items = [
    { url: "linear.app", tag: "tools" },
    { url: "vercel.com/docs", tag: "infra" },
    { url: "ui.shadcn.com", tag: "ui" },
  ];
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-zinc-900/60 bg-zinc-950/40 p-1">
      {items.map((i) => (
        <div
          key={i.url}
          className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-zinc-900/30 px-3 py-2 transition-colors hover:border-zinc-700/60"
        >
          <span className="font-mono text-xs text-zinc-400">{i.url}</span>
          <span className="rounded-md border border-zinc-700/60 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
            {i.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

export function NotePreview() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold text-zinc-500">
          sprint-notes.md
        </span>
        <span className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[10px] text-zinc-400">
          <FiLock size={10} /> AES-256
        </span>
      </div>
      <div className="space-y-1.5 font-mono text-xs leading-relaxed text-zinc-400">
        <p className="text-zinc-500"># Next Steps</p>
        <p>• Implement database sync flow</p>
        <p>• Optimize layout layout.tsx constraints</p>
        <p className="animate-pulse text-zinc-600">|</p>
      </div>
    </div>
  );
}

export function SnippetPreview() {
  return (
    <div className="w-full rounded-xl border border-zinc-800/60 bg-black/60 p-4">
      <pre className="overflow-hidden font-mono text-xs leading-relaxed whitespace-pre text-zinc-300">
        <span className="text-zinc-500">const</span>{" "}
        <span className="text-zinc-200">debounce</span> = (fn, ms) =&gt; &#123;
        {"\n"} <span className="text-zinc-500">let</span> t;
        {"\n"} <span className="text-zinc-500">return</span> (...args) =&gt;
        &#123;
        {"\n"} clearTimeout(t);
        {"\n"} &#125;
        {"\n"}&#125;
      </pre>
    </div>
  );
}

export function HabitPreview() {
  const habits = [
    { name: "Deep work", streak: "12d", days: [1, 1, 1, 1, 1, 1, 0] },
    { name: "Read docs", streak: "5d", days: [1, 1, 1, 0, 1, 1, 0] },
  ];
  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-zinc-900/60 bg-zinc-950/40 p-3">
      {habits.map((h) => (
        <div key={h.name} className="flex items-center justify-between gap-4">
          <span className="w-20 shrink-0 text-xs font-medium text-zinc-400">
            {h.name}
          </span>
          <div className="flex flex-1 justify-center gap-1.5">
            {h.days.map((d, i) => (
              <div
                key={i}
                className={`h-4 w-4 shrink-0 rounded-md border transition-all ${
                  d
                    ? "border-zinc-700 bg-zinc-800"
                    : "border-zinc-900 bg-zinc-950/20"
                }`}
              />
            ))}
          </div>
          <span className="w-6 text-right font-mono text-[11px] text-zinc-500">
            {h.streak}
          </span>
        </div>
      ))}
    </div>
  );
}

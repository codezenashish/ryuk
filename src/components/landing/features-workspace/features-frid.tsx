import { FiLock } from "react-icons/fi";

export function BookmarkPreview() {
  const items = [
    { url: "linear.app", tag: "tools" },
    { url: "vercel.com/docs", tag: "infra" },
    { url: "ui.shadcn.com", tag: "ui" },
  ];
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-white/5 bg-[#0c0c0b]/60 p-1">
      {items.map((i) => (
        <div
          key={i.url}
          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/2 px-3 py-2 transition-all duration-300 hover:border-white/10 hover:bg-white/4"
        >
          <span className="font-mono text-xs text-stone-400">{i.url}</span>
          <span className="rounded-md border border-stone-700/50 bg-stone-800/80 px-2 py-0.5 font-mono text-[10px] text-stone-300">
            {i.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

export function NotePreview() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/5 bg-[#0c0c0b]/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold text-stone-500">
          sprint-notes.md
        </span>
        <span className="flex items-center gap-1 rounded-md border border-stone-800 bg-stone-900/60 px-2 py-0.5 text-[10px] text-stone-400">
          <FiLock size={10} /> AES-256
        </span>
      </div>
      <div className="space-y-1.5 font-mono text-xs leading-relaxed text-stone-400">
        <p className="text-stone-500"># Next Steps</p>
        <p>• Implement database sync flow</p>
        <p>• Optimize layout layout.tsx constraints</p>
        <p className="animate-pulse text-stone-600">|</p>
      </div>
    </div>
  );
}

export function SnippetPreview() {
  return (
    <div className="w-full rounded-xl border border-white/5 bg-[#0c0c0b]/60 p-4">
      <pre className="overflow-hidden font-mono text-xs leading-relaxed whitespace-pre text-stone-400">
        <span className="text-stone-500">const</span>{" "}
        <span className="text-stone-200">debounce</span> = (fn, ms) =&gt; &#123;
        {"\n"} <span className="text-stone-500">let</span> t;
        {"\n"} <span className="text-stone-500">return</span> (...args) =&gt;
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
    <div className="flex w-full flex-col gap-3 rounded-xl border border-white/5 bg-[#0c0c0b]/60 p-3">
      {habits.map((h) => (
        <div key={h.name} className="flex items-center justify-between gap-4">
          <span className="w-20 shrink-0 text-xs font-medium text-stone-400">
            {h.name}
          </span>
          <div className="flex flex-1 justify-center gap-1.5">
            {h.days.map((d, i) => (
              <div
                key={i}
                className={`h-4 w-4 shrink-0 rounded-md border transition-all duration-300 ${
                  d
                    ? "border-stone-600 bg-stone-700/80"
                    : "border-stone-800/60 bg-stone-900/30"
                }`}
              />
            ))}
          </div>
          <span className="w-6 text-right font-mono text-[11px] text-stone-500">
            {h.streak}
          </span>
        </div>
      ))}
    </div>
  );
}

import { FiBook, FiArrowUpRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import MockupWindow from "./mockup-window";

const methods = [
  {
    label: "Array",
    items: [".map()", ".filter()", ".reduce()", ".find()", ".some()"],
  },
  {
    label: "Object",
    items: ["Object.keys()", "Object.values()", "structuredClone()"],
  },
];

export default function QuickDocsMockup() {
  return (
    <MockupWindow
      id="quick-guide"
      title="quick docs"
      icon={<FiBook className="shrink-0 text-violet-300" size={13} />}
    >
      <div className="flex-1 space-y-5 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {["JavaScript", "TypeScript", "Python", "SQL"].map(
            (language, index) => (
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-md border px-2.5 py-1.5 text-[11px] transition-colors ${
                  index === 0
                    ? "border-violet-400/35 bg-violet-400/10 text-violet-200"
                    : "border-white/8 bg-white/2.5 text-zinc-400 hover:border-violet-400/30 hover:text-zinc-100"
                }`}
                key={language}
                type="button"
              >
                {language}
              </Button>
            ),
          )}
        </div>

        <div className="space-y-4">
          {methods.map(({ label, items }) => (
            <div className="space-y-2" key={label}>
              <p className="font-mono text-[9px] tracking-[0.16em] text-stone-500 uppercase">
                {label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <Button
                    variant="ghost"
                    size="xs"
                    className={`rounded-md border px-2 py-1 font-mono text-[10px] transition-colors ${
                      item === ".map()"
                        ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
                        : "border-white/8 bg-white/2.5 text-zinc-400 hover:border-cyan-300/25 hover:text-zinc-100"
                    }`}
                    key={item}
                    type="button"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-white/[0.07] bg-black px-4 py-3 sm:px-5">
        <code className="font-mono text-xs text-cyan-200">.map()</code>
        <span className="min-w-0 flex-1 truncate text-[10px] text-stone-500">
          transform every item in an array
        </span>
        <Button
          variant="ghost"
          size="xs"
          className="flex shrink-0 items-center gap-1 font-mono text-[9px] text-violet-300"
          type="button"
        >
          MDN <FiArrowUpRight size={11} />
        </Button>
      </div>
    </MockupWindow>
  );
}

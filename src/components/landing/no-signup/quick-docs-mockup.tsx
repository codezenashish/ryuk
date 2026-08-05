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
      icon={<FiBook className="shrink-0 text-stone-400" size={13} />}
    >
      <div className="flex-1 space-y-5 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {["JavaScript", "TypeScript", "Python", "SQL"].map(
            (language, index) => (
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-all duration-200 ${
                  index === 0
                    ? "border-stone-500/25 bg-stone-500/10 text-stone-200"
                    : "border-white/6 bg-white/2 text-stone-400 hover:border-stone-500/25 hover:text-stone-200"
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
                    className={`rounded-lg border px-2 py-1 font-mono text-[10px] transition-all duration-200 ${
                      item === ".map()"
                        ? "border-emerald-400/20 bg-emerald-400/8 text-emerald-300"
                        : "border-white/6 bg-white/2 text-stone-400 hover:border-emerald-400/20 hover:text-stone-200"
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

      <div className="flex items-center gap-2 border-t border-white/6 bg-[#0c0c0b] px-4 py-3 sm:px-5">
        <code className="font-mono text-xs text-emerald-300">.map()</code>
        <span className="min-w-0 flex-1 truncate text-[10px] text-stone-500">
          transform every item in an array
        </span>
        <Button
          variant="ghost"
          size="xs"
          className="flex shrink-0 items-center gap-1 font-mono text-[9px] text-stone-400 hover:text-stone-200"
          type="button"
        >
          MDN <FiArrowUpRight size={11} />
        </Button>
      </div>
    </MockupWindow>
  );
}

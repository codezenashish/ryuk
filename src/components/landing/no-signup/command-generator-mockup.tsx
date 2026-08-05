import { FaRegCopy, FaTerminal } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import MockupWindow from "./mockup-window";

const options = {
  Framework: ["Next.js", "Vite", "Remix", "Astro"],
  "Package manager": ["npm", "pnpm", "yarn", "bun"],
  "Add-ons": ["Tailwind", "Prisma", "ESLint", "shadcn/ui"],
};

export default function CommandGeneratorMockup() {
  return (
    <MockupWindow
      id="quick-craft"
      title="command generator"
      icon={<FaTerminal className="shrink-0 text-stone-400" size={12} />}
    >
      <div className="flex-1 space-y-5 p-4 sm:p-5">
        {Object.entries(options).map(([label, items]) => (
          <div className="space-y-2.5" key={label}>
            <p className="font-mono text-[9px] tracking-[0.16em] text-stone-500 uppercase">
              {label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => {
                const selected =
                  item === "Next.js" ||
                  item === "npm" ||
                  item === "Tailwind" ||
                  item === "Prisma";
                return (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-all duration-200 ${
                      selected
                        ? "border-stone-500/25 bg-stone-500/10 text-stone-200"
                        : "border-white/6 bg-white/2 text-stone-400 hover:border-stone-500/25 hover:text-stone-200"
                    }`}
                    key={item}
                    type="button"
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/6 bg-[#0c0c0b] p-3 sm:p-4">
        <div className="flex items-start gap-2 rounded-xl border border-white/6 bg-white/2 p-3">
          <span className="pt-0.5 font-mono text-xs text-stone-400">$</span>
          <code className="min-w-0 flex-1 font-mono text-[10px] leading-relaxed wrap-break-words text-stone-400">
            npx create-next-app@latest my-app --tailwind --ts && npx prisma init
          </code>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Copy command"
            className="flex shrink-0 items-center justify-center rounded-md border border-white/6 p-1.5 text-stone-500 transition-all duration-200 hover:border-stone-500/25 hover:text-stone-300"
            type="button"
          >
            <FaRegCopy size={11} />
          </Button>
        </div>
      </div>
    </MockupWindow>
  );
}

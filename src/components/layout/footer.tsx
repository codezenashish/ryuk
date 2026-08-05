import { LuHouse } from "react-icons/lu";

const links = [
  { label: "Features", href: "#features" },
  { label: "Open Source", href: "#open-source" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Docs", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden px-4 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 border-t border-stone-800/60 pt-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-800 bg-stone-900/30 text-stone-400">
            <LuHouse size={13} />
          </div>
          <span className=" text-sm font-semibold tracking-tight text-stone-300">
            DevNest
          </span>
          <span className="rounded-md border border-stone-800/60 bg-stone-900 px-2 py-0.5 font-mono text-[10px] text-stone-500">
            MIT License
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-xs font-medium text-stone-500 transition-colors hover:text-stone-200"
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={
                l.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="font-mono text-xs text-stone-600 sm:text-right">
          &copy; {new Date().getFullYear()} DevNest
        </p>
      </div>
    </footer>
  );
}

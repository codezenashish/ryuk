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
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 border-t border-zinc-800/80 pt-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-400">
            <LuHouse size={13} />
          </div>
          <span className="font-sans text-sm font-semibold tracking-tight text-zinc-200">
            devnest
          </span>
          <span className="rounded-md border border-zinc-800/80 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-600">
            MIT License
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200"
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={
                l.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="font-mono text-xs text-zinc-600 sm:text-right">
          &copy; {new Date().getFullYear()} DevNest
        </p>
      </div>
    </footer>
  );
}

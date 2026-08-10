import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github } from "@hugeicons/core-free-icons";
import { ExampleAvatar } from "./avatar";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/playground", label: "Examples" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/docs#themes", label: "Themes" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/70 backdrop-blur-md [-webkit-backdrop-filter:blur(10px)_saturate(140%)] [backdrop-filter:blur(10px)_saturate(140%)]">
      <div className="mx-auto flex h-15 max-w-7xl items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-3 text-ink">
         
          <span className="font-display text-[22px] font-medium tracking-tight">
            Ryuk
          </span>
          <span className="ml-1 rounded-full border border-line-2 px-1.75 py-0.5 font-code text-[10.5px] tracking-[0.08em] text-ink-3">
            v1.0
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-ink-2 hover:bg-paper-3 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/codezenashish/devnest"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-line-2 px-3 py-1.5 font-code text-xs text-ink-2 hover:border-line-strong hover:text-ink"
          >
            <HugeiconsIcon size={16} icon={Github} />
            <b className="font-semibold text-ink">GitHub</b>
          </a>
        </div>
      </div>
    </header>
  );
}

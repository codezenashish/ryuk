import Link from "next/link";
import { RyukLogo } from "@/components/common/ryuk-logo";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github } from "@hugeicons/core-free-icons";
import { ModeToggle } from "../ui/theme-toggle";


const navLinks: { href: string; label: string }[] = [
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md [-webkit-backdrop-filter:blur(10px)_saturate(140%)] [backdrop-filter:blur(10px)_saturate(140%)]">
      <div className="mx-auto flex h-15 max-w-7xl items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <RyukLogo size={45} className="text-foreground" />
          
          <span className="ml-1 rounded-full border border-border px-1.75 py-0.5 font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground">
            v1.0
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <a
            href="https://github.com/codezenashish/ryuk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-foreground/20 hover:text-foreground"
          >
            <HugeiconsIcon size={16} icon={Github} />
            <b className="font-semibold text-foreground">GitHub</b>
          </a>
        </div>
      </div>
    </header>
  );
}

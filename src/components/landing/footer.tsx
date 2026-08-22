import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Download", href: "/download" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Guides", href: "/guides" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-3 text-foreground hover:opacity-80 transition-opacity">
              {/*<Image
                src="/favicon.png"
                alt="Ryuk"
                width={32}
                height={32}
                className="rounded-md"
              />*/}
              <span className="font-sans text-[26px] font-medium tracking-tight">
                Ryuk
              </span>
            </Link>
            <p className="mt-2 max-w-[36ch] text-sm text-muted-foreground">
              One place for everything you build — notes, habits, bookmarks,
              CLI, sketches, and snippets.
            </p>
           
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-muted-foreground">
                {column.title}
              </h4>
              <ul className="ml-0 flex list-none flex-col gap-2.5 pl-0">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-6 font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
          <span>Ryuk · v1.0 · 2026</span>
          <span>
            <a href="https://ashishchoudhary.dev/" target="_blank" className="hover:text-foreground transition-colors">Developed by Ashish.dev</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

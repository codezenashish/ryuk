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

const socialButtonClass =
  "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line-2 bg-paper-3 px-2.5 py-1.5 text-ink transition hover:border-line-strong hover:bg-paper-card active:translate-y-px";

export function Footer() {
  return (
    <footer className="border-t border-line bg-[#080808] py-20">
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-3 text-ink">
              {/*<Image
                src="/favicon.png"
                alt="VYRN"
                width={32}
                height={32}
                className="rounded-md"
              />*/}
              <span className="font-display text-[26px] font-medium tracking-[-0.025em]">
                VYRN
              </span>
            </Link>
            <p className="mt-2 max-w-[36ch] text-sm text-ink-3">
              One place for everything you build — notes, habits, bookmarks,
              sketches, and snippets.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href="https://twitter.com/vyrnapp"
                target="_blank"
                rel="noreferrer"
                className={socialButtonClass}
                aria-label="X (Twitter)"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L.8 2h7.4l5.1 6.7L18.9 2Zm-1.3 18h2L6.5 4h-2l13.1 16Z" />
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </a>
              <a
                href="https://instagram.com/vyrnapp"
                target="_blank"
                rel="noreferrer"
                className={socialButtonClass}
                aria-label="Instagram"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.2"
                    cy="6.8"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 font-code text-[11px] font-medium tracking-[0.16em] uppercase text-ink-3">
                {column.title}
              </h4>
              <ul className="ml-0 flex list-none flex-col gap-2.5 pl-0">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-2 hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-6 font-code text-[11px] tracking-[0.06em] text-ink-4">
          <span>VYRN · v1.0 · 2026</span>
          <span>
            <a href="https://ashishchoudhary.dev/" target="_blank">Developed by Ashish.dev</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

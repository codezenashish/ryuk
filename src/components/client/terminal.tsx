'use client'

import { useState } from 'react'

interface CliTabEntry {
  id: string
  label: string
  tagline: string
  command: string
  pkg: string
  size: string
  deps: string
  since: string
  filePath: string
  terminalOutput: string[]
}

const entries: CliTabEntry[] = [
  {
    id: 'notes',
    label: 'ryuk notes',
    tagline: 'Create, edit & search notes directly from CLI',
    command: 'ryuk notes add "Meeting notes"',
    pkg: '@ryuk/cli',
    size: '1.2 MB',
    deps: '0 dependencies',
    since: 'v1.0.0',
    filePath: 'user@temp.email',
    terminalOutput: [
      '$ ryuk notes add "API Architecture & Design" --tag dev',
      '✔ Created note [id: nt_892a]',
      '✔ Synced with Ryuk Cloud',
      '',
      '$ ryuk notes list --limit 2',
      '┌─────────┬────────────────────────────────┬─────────────┐',
      '│ ID      │ TITLE                          │ UPDATED     │',
      '├─────────┼────────────────────────────────┼─────────────┤',
      '│ nt_892a │ API Architecture & Design      │ Just now    │',
      '│ nt_410b │ Next.js agent setup rules      │ 1 hour ago  │',
      '└─────────┴────────────────────────────────┴─────────────┘',
    ],
  },
  {
    id: 'bookmarks',
    label: 'ryuk bookmarks',
    tagline: 'Save links, auto-fetch favicons & organize tags',
    command: 'ryuk bookmarks add https://github.com/codezenashish/ryuk',
    pkg: '@ryuk/cli',
    size: '1.2 MB',
    deps: '0 dependencies',
    since: 'v1.0.0',
    filePath: 'user@temp.email',
    terminalOutput: [
      '$ ryuk bookmarks add https://github.com/codezenashish/ryuk --tag dev',
      '✔ Fetched title: "codezenashish/ryuk"',
      '✔ Detected favicon: https://github.com/favicon.ico',
      '✔ Bookmark saved [id: bm_104f]',
      '',
      '$ ryuk bookmarks list --tag dev',
      '★ https://github.com/codezenashish/ryuk [#dev]',
      '★ https://nextjs.org/docs [#dev]',
    ],
  },
  {
    id: 'sync',
    label: 'ryuk sync',
    tagline: 'Realtime synchronization across web & mobile',
    command: 'ryuk sync --status',
    pkg: '@ryuk/cli',
    size: '1.2 MB',
    deps: '0 dependencies',
    since: 'v1.0.0',
    filePath: 'user@temp.email',
    terminalOutput: [
      '$ ryuk sync --status',
      '● Connection: Connected (wss://api.ryuk.app)',
      '● Local cache: Up to date (342 objects)',
      '● Last sync: 12 seconds ago',
      '✔ All notes & bookmarks in sync.',
    ],
  },
  {
    id: 'export',
    label: 'ryuk export',
    tagline: 'Export your data anytime in open formats',
    command: 'ryuk export --format json',
    pkg: '@ryuk/cli',
    size: '1.2 MB',
    deps: '0 dependencies',
    since: 'v1.0.0',
    filePath: 'user@temp.email',
    terminalOutput: [
      '$ ryuk export --format markdown --out ./backups',
      '✔ Exporting notes (48 files)... done',
      '✔ Exporting bookmarks (120 links)... done',
      '✔ Saved backup to ./backups/ryuk-export-2026.zip',
    ],
  },
]

const tabBase =
  'flex shrink-0 cursor-pointer items-center gap-2.5 border-0 border-r border-border px-[22px] py-4 text-sm font-medium whitespace-nowrap transition'
const tabIdle = 'bg-transparent text-muted-foreground hover:bg-muted hover:text-muted-foreground'
const tabActive =
  'bg-[#131313] text-foreground shadow-[inset_0_-2px_0_var(--color-ink)]'
const buttonClass =
  'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm font-medium whitespace-nowrap text-foreground transition hover:border-foreground/20 hover:bg-card active:translate-y-px'

export function TerminalShowcase() {
  const [activeId, setActiveId] = useState('notes')
  const [copiedInstall, setCopiedInstall] = useState(false)

  const active = entries.find((entry) => entry.id === activeId) ?? entries[0]

  async function copyInstall() {
    const command = `npm i -g ${active.pkg}`
    try {
      await navigator.clipboard.writeText(command)
      setCopiedInstall(true)
      window.setTimeout(() => setCopiedInstall(false), 1500)
    } catch {
      return
    }
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-[#0d0d0d]">
      <div className="flex overflow-x-auto border-b border-border">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setActiveId(entry.id)}
            className={`${tabBase} ${activeId === entry.id ? tabActive : tabIdle}`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="grid min-h-80 grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col justify-center gap-4.5 border-b border-border p-8 lg:border-r lg:border-b-0">
          <div className="font-sans text-[32px] leading-tight tracking-[-0.02em]">
            {active.tagline}
          </div>

          <div className="flex flex-col gap-2.5 font-mono text-[11.5px] text-muted-foreground">
            <div className="flex items-baseline gap-3.5">
              <span className="w-15 shrink-0 text-muted-foreground">package</span>
              <span className="min-w-0 truncate text-muted-foreground">{active.pkg}</span>
            </div>
            <div className="flex items-baseline gap-3.5">
              <span className="w-15 shrink-0 text-muted-foreground">size</span>
              <span className="text-muted-foreground">
                {active.size}
                <span className="text-muted-foreground"> gzipped</span>
              </span>
            </div>
            <div className="flex items-baseline gap-3.5">
              <span className="w-15 shrink-0 text-muted-foreground">deps</span>
              <span className="text-muted-foreground">{active.deps}</span>
            </div>
            <div className="flex items-baseline gap-3.5">
              <span className="w-15 shrink-0 text-muted-foreground">since</span>
              <span className="text-muted-foreground">{active.since}</span>
            </div>
          </div>

          <div>
            <button type="button" className={buttonClass} onClick={copyInstall}>
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m4 17 6-6-6-6" />
                <path d="M12 19h8" />
              </svg>
              <code className="font-mono text-[12px]">
                {copiedInstall ? 'Copied command' : `npm i -g ${active.pkg}`}
              </code>
            </button>
          </div>
        </div>

        <div className="bg-background p-6">
          <div className="code-shell rounded-xl border border-border bg-[#0c0c0c]">
            <div className="flex items-center gap-3 border-b border-border px-3.5 py-2.5 text-muted-foreground">
              <svg
                aria-hidden="true"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                <path d="M14 3v5h5" />
              </svg>
              <span className="font-mono text-[11.5px] text-muted-foreground">
                {active.filePath}
              </span>
            </div>
            <div className="p-4 font-mono text-[12px] leading-relaxed overflow-x-auto">
              {active.terminalOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('$')
                      ? 'text-foreground font-semibold'
                      : line.startsWith('✔')
                        ? 'text-emerald-400'
                        : line.startsWith('●')
                          ? 'text-sky-400'
                          : 'text-muted-foreground'
                  }
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const FrameworksTabs = TerminalShowcase
'use client'

import { useState } from 'react'
import { Terminal, Copy, Check } from 'lucide-react'

const installCommand = 'npm i -g ryuk'

export function InstallCopy() {
  const [copied, setCopied] = useState(false)

  async function copyInstallCommand() {
    try {
      await navigator.clipboard.writeText(installCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      window.dispatchEvent(
        new CustomEvent('ryuk:toast', {
          detail: `Copied ${installCommand}`,
        }),
      )
    } catch {
      return
    }
  }

  return (
    <button
      type="button"
      onClick={copyInstallCommand}
      className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line-2 bg-paper-3 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-ink transition hover:border-line-strong hover:bg-paper-card active:translate-y-px"
    >
      <Terminal className="h-4 w-4 shrink-0 text-ink-3" />
      <code className="font-code text-[12px] leading-none">{installCommand}</code>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 transition-all" />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0 text-ink-3 transition-opacity hover:text-ink" />
      )}
    </button>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Terminal, Copy, Check } from 'lucide-react'

const installCommands = {
  mac: 'curl -fsSL https://raw.githubusercontent.com/codezenashish/ryuk/main/install.sh | bash',
  linux: 'curl -fsSL https://raw.githubusercontent.com/codezenashish/ryuk/main/install.sh | bash',
  windows: 'irm https://raw.githubusercontent.com/codezenashish/ryuk/main/install.ps1 | iex',
}

type OS = 'mac' | 'linux' | 'windows'

export function InstallCopy() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<OS>('mac')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.includes('win')) {
       
      setActiveTab('windows')
    } else if (userAgent.includes('linux')) {
       
      setActiveTab('linux')
    } else {
       
      setActiveTab('mac')
    }
  }, [])

  async function copyInstallCommand() {
    try {
      await navigator.clipboard.writeText(installCommands[activeTab])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      window.dispatchEvent(
        new CustomEvent('ryuk:toast', {
          detail: `Copied command`,
        }),
      )
    } catch {
      return
    }
  }

  // Prevent hydration mismatch
  const displayCommand = mounted ? installCommands[activeTab] : installCommands.mac

  return (
    <div className="flex flex-col gap-1.5 w-full sm:w-auto max-w-full">
      <div className="flex items-center gap-1 px-1">
        {(['mac', 'linux', 'windows'] as const).map((os) => (
          <button
            key={os}
            type="button"
            onClick={() => setActiveTab(os)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === os
                ? 'bg-ink text-paper'
                : 'text-ink-3 hover:text-ink hover:bg-paper-2'
            }`}
          >
            {os === 'mac' ? 'macOS' : os === 'linux' ? 'Linux' : 'Windows'}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={copyInstallCommand}
        className="inline-flex h-10 w-full cursor-pointer items-center justify-between sm:justify-start gap-3 rounded-lg border border-line-2 bg-paper-3 px-4 py-2.5 text-sm font-medium text-ink transition hover:border-line-strong hover:bg-paper-card active:translate-y-px overflow-hidden"
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <Terminal className="h-4 w-4 shrink-0 text-ink-3" />
          <code className="font-code text-[12px] leading-none truncate block">
            {displayCommand}
          </code>
        </div>
        {copied ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 transition-all" />
        ) : (
          <Copy className="h-3.5 w-3.5 shrink-0 text-ink-3 transition-opacity hover:text-ink" />
        )}
      </button>
    </div>
  )
}
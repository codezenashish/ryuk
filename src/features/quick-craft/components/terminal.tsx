"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface TerminalProps {
  command: string;
  selectedStack: string[];
}

export default function Terminal({ command, selectedStack }: TerminalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy command:", err);
    }
  };

  
  const renderHighlightedCommand = () => {
    const tokens = command.split(/(\s+|&&)/);
    return (
      <code className="text-zinc-100 font-mono text-sm tracking-wide break-all whitespace-pre-wrap">
        {tokens.map((token, idx) => {
          const trimmed = token.trim();
          if (token === "&&") {
            return (
              <span key={idx} className="text-zinc-500 font-medium">
                {token}
              </span>
            );
          }
          if (/^(npm|yarn|pnpm|bun|npx|bunx|cd)$/.test(trimmed)) {
            return (
              <span key={idx} className="text-emerald-400 font-semibold">
                {token}
              </span>
            );
          }
          if (
            /^(create|install|add|dlx|create-next-app|create-vite|create-vue|sv)$/.test(
              trimmed
            )
          ) {
            return (
              <span key={idx} className="text-violet-400 font-medium">
                {token}
              </span>
            );
          }
          if (/^(--[a-zA-Z0-9-]+|-[a-zA-Z])$/.test(trimmed)) {
            return (
              <span key={idx} className="text-sky-400">
                {token}
              </span>
            );
          }
          if (/^(my-app|react-ts|react)$/.test(trimmed)) {
            return (
              <span key={idx} className="text-amber-400">
                {token}
              </span>
            );
          }
       
          if (trimmed.length > 0 && !token.startsWith(" ") && trimmed !== "&&") {
            return (
              <span key={idx} className="text-zinc-200">
                {token}
              </span>
            );
          }
          return <span key={idx}>{token}</span>;
        })}
      </code>
    );
  };

  return (
    <div className="space-y-6">
     
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-violet-950/10 backdrop-blur-xl transition-all duration-300 hover:border-zinc-700/80">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-500/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="font-mono text-xs text-zinc-500 tracking-wider">setup.sh</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-violet-500/30 hover:bg-zinc-800 hover:text-zinc-200 active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400 animate-in fade-in zoom-in-50 duration-200" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono leading-relaxed min-h-[140px]">
          <div className="flex items-start gap-2.5 rounded-xl border border-zinc-900/50 bg-zinc-900/20 p-4 transition-all hover:border-zinc-800/50 hover:bg-zinc-900/30">
            <span className="select-none text-violet-400 font-bold">$</span>
            <div className="min-w-0 flex-1">
              {renderHighlightedCommand()}
              <span className="inline-block w-1.5 h-3.5 bg-violet-400 ml-1.5 animate-pulse align-middle" />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Stack Panel */}
      <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/40 p-5 backdrop-blur-md space-y-3">
        <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
          Selected Stack ({selectedStack.length})
        </h3>
        {selectedStack.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedStack.map((name, idx) => (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={name + idx}
                className="font-mono text-xs text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-md"
              >
                {name}
              </motion.span>
            ))}
          </div>
        ) : (
          <p className="text-zinc-600 text-xs">
            Using framework defaults only.
          </p>
        )}
      </div>

      <p className="text-zinc-600 text-xs leading-normal">
        Commands are generated live based on your choices. No packages will be installed on your system until you copy and execute the command.
      </p>
    </div>
  );
}

import { LuShield } from "react-icons/lu";

export default function OpenSourceMockup() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-700/40 to-transparent" />

      <div className="flex items-center gap-2 border-b border-zinc-800/60 px-5 py-4 text-xs font-medium text-zinc-400">
        <LuShield size={14} className="text-zinc-500" />
        <span>Encryption Flow</span>
        <span className="ml-auto rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] tracking-wide text-zinc-400">
          client-side only
        </span>
      </div>

      <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed whitespace-pre text-zinc-400">
        <span className="text-zinc-500">const</span> key ={" "}
        <span className="text-zinc-500">await</span> deriveKey(passphrase)
        {"\n\n"}
        <span className="text-zinc-500">const</span> &#123; cipher, iv &#125; ={" "}
        <span className="text-zinc-500">await</span> encrypt(note, key){"\n\n"}
        <span className="text-zinc-500">await</span> supabase.from(
        <span className="text-zinc-300">{String.raw`'notes'`}</span>
        ).insert(&#123; cipher, iv &#125;){"\n\n"}
        <span className="text-emerald-500/90">
          {String.raw`✓ Server sees: "U2FsdGVkX1..."`}
        </span>
        {"\n"}
        <span className="text-zinc-600">✗ Server never sees raw text</span>
      </pre>

      <div className="flex flex-wrap gap-4 border-t border-zinc-800/60 bg-black/20 px-5 py-3 font-mono text-[11px] text-zinc-500">
        <span className="flex items-center gap-1 text-emerald-500/80">
          <span className="h-1 w-1 rounded-full bg-emerald-500" /> AES-GCM
          256-bit
        </span>
        <span>PBKDF2 derivation</span>
        <span>unique IV vector</span>
      </div>
    </div>
  );
}

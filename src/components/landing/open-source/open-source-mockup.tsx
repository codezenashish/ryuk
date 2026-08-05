import { LuShield } from "react-icons/lu";

export default function OpenSourceMockup() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/6 bg-[#111110]/80 backdrop-blur-xl transition-all duration-500 hover:border-white/12 hover:shadow-xl hover:shadow-black/20">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-stone-700/30 to-transparent" />

      <div className="flex items-center gap-2 border-b border-white/6 px-5 py-4 text-xs font-medium text-stone-400">
        <LuShield size={14} className="text-stone-500" />
        <span>Encryption Flow</span>
        <span className="ml-auto rounded-full border border-stone-800 bg-stone-900/60 px-2 py-0.5 text-[10px] tracking-wide text-stone-400">
          client-side only
        </span>
      </div>

      <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed whitespace-pre text-stone-400">
        <span className="text-stone-500">const</span> key ={" "}
        <span className="text-stone-500">await</span> deriveKey(passphrase)
        {"\n\n"}
        <span className="text-stone-500">const</span> &#123; cipher, iv &#125; ={" "}
        <span className="text-stone-500">await</span> encrypt(note, key){"\n\n"}
        <span className="text-stone-500">await</span> supabase.from(
        <span className="text-stone-300">{String.raw`'notes'`}</span>
        ).insert(&#123; cipher, iv &#125;){"\n\n"}
        <span className="text-emerald-400/80">
          {String.raw`✓ Server sees: "U2FsdGVkX1..."`}
        </span>
        {"\n"}
        <span className="text-stone-600">✗ Server never sees raw text</span>
      </pre>

      <div className="flex flex-wrap gap-4 border-t border-white/6 bg-[#0c0c0b]/40 px-5 py-3 font-mono text-[11px] text-stone-500">
        <span className="flex items-center gap-1 text-emerald-400/70">
          <span className="h-1 w-1 rounded-full bg-emerald-400" /> AES-GCM
          256-bit
        </span>
        <span>PBKDF2 derivation</span>
        <span>unique IV vector</span>
      </div>
    </div>
  );
}

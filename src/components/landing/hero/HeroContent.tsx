import Link from "next/link";
import { HERO_DATA } from "./heroData";

const HeroContent = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto w-full">

      {/* Massive heading — the entire design */}
      <h1
        className="
          font-black uppercase leading-[0.88] tracking-[-3px] mb-10
          text-[clamp(52px,10vw,120px)]
        "
      >
        {/* Line 1 — white */}
        <span className="block text-white">
          {HERO_DATA.title.line1}
        </span>

        {/* Line 2 — white + ghost */}
        <span className="block">
          <span className="text-white">{HERO_DATA.title.line2White} </span>
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1.5px #2a2a2a" }}
          >
            {HERO_DATA.title.line2Gray}
          </span>
        </span>

        {/* Line 3 — ghost + white */}
        <span className="block">
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1.5px #1e1e1e" }}
          >
            {HERO_DATA.title.line3Ghost}{" "}
          </span>
          <span className="text-white">{HERO_DATA.title.line3White}</span>
        </span>
      </h1>

      {/* Bottom row — description + buttons side by side */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-t border-white/[0.06] pt-8">

        {/* Description */}
        <p className="text-sm leading-relaxed text-zinc-500 max-w-sm">
          {HERO_DATA.description}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-5 shrink-0">
          <Link
            href={HERO_DATA.buttons.primary.href}
            className="
              border border-white/20 text-white rounded px-7 py-3
              text-sm font-semibold tracking-wide uppercase
              transition duration-200
              hover:bg-white hover:text-black hover:border-white
            "
          >
            {HERO_DATA.buttons.primary.label} ↗
          </Link>

          <Link
            href={HERO_DATA.buttons.secondary.href}
            className="text-sm text-zinc-600 hover:text-zinc-300 transition duration-200 tracking-wide"
            target="_blank"
            rel="noopener noreferrer"
          >
            {HERO_DATA.buttons.secondary.label} →
          </Link>
        </div>
      </div>

      {/* Stats row — bottom */}
      <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
        {HERO_DATA.stats.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {i > 0 && (
              <div className="h-4 w-px bg-white/[0.08]" />
            )}
            <div>
              <span className="text-xs font-semibold text-zinc-400">
                {item.value}
              </span>
              <span className="text-xs text-zinc-700 ml-2">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroContent;
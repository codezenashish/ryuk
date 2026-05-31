import Link from "next/link";
import { HERO_DATA } from "./heroData";

const HeroContent = () => {
  return (
    <div className="relative z-10 mx-auto w-full max-w-7xl">
      {HERO_DATA.badge && (
        <span className="mb-6 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-400 backdrop-blur-xs">
          {HERO_DATA.badge}
        </span>
      )}

      <h1 className="mb-12 select-none text-[clamp(48px,9vw,110px)] font-bold uppercase leading-[0.9] tracking-tight">
        <span className="block text-white drop-shadow-xs">
          {HERO_DATA.title.line1}
        </span>

        <span className="block">
          <span className="text-white">{HERO_DATA.title.line2White} </span>
          <span className="text-transparent [-webkit-text-stroke:1.5px_var(--color-zinc-800)]">
            {HERO_DATA.title.line2Gray}
          </span>
        </span>

        <span className="block">
          <span className="text-transparent [-webkit-text-stroke:1.5px_var(--color-zinc-900)]">
            {HERO_DATA.title.line3Ghost}{" "}
          </span>
          <span className="text-white">{HERO_DATA.title.line3White}</span>
        </span>
      </h1>

      <div className="flex flex-col gap-8 border-t border-zinc-900 pt-8 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-md text-sm leading-relaxed text-zinc-400">
          {HERO_DATA.description}
        </p>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href={HERO_DATA.buttons.primary.href}
            className="rounded-md border border-zinc-800 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black transition-all duration-200 hover:bg-zinc-200"
          >
            {HERO_DATA.buttons.primary.label} ↗
          </Link>

          <Link
            href={HERO_DATA.buttons.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-zinc-900 bg-zinc-950 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-all duration-200 hover:border-zinc-800 hover:text-white"
          >
            {HERO_DATA.buttons.secondary.label}
          </Link>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap gap-x-12 gap-y-4 border-t border-zinc-900/50 pt-6">
        {HERO_DATA.stats.map((item) => (
          <div key={item.label} className="flex items-baseline gap-2">
            <span className="text-xs font-semibold tabular-nums tracking-wide text-zinc-300">
              {item.value}
            </span>

            <span className="text-[11px] uppercase tracking-wider text-zinc-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroContent;

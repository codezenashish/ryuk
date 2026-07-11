import { FaGithub } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import HeroMockup from "./hero-mockup";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden max-sm:py-25 md:py-25"
      id="home"
    >
      <div className="pointer-events-none absolute -top-50 -left-50 h-175 w-175 bg-[radial-gradient(circle,rgba(124,58,237,0.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -right-50 -bottom-50 h-150 w-150 bg-[radial-gradient(circle,rgba(34,211,238,0.07)_0%,transparent_70%)]" />

      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-16 md:gap-12 lg:grid-cols-2">
          <div className="max-w-130 max-lg:max-w-full max-lg:text-center">
            <div className="mb-6 flex items-center gap-3 max-lg:justify-center">
              <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2.5 py-0.5 text-[11px] font-medium tracking-widest text-violet-200 uppercase">
                Open Source
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2.5 py-0.5 text-[11px] font-medium tracking-widest text-violet-200 uppercase">
                Privacy-first
              </span>
            </div>

            <h1 className="mb-6 text-4xl text-white sm:text-5xl md:text-6xl">
              One place for
              <br />
              <span className="bg-linear-to-r from-white via-violet-200 to-violet-400 bg-clip-text font-serif text-transparent">
                everything
              </span>{" "}
              you build
            </h1>

            <p className="mx-auto mb-8 max-w-110 text-sm text-zinc-400 normal-case max-lg:max-w-full md:text-lg lg:mx-0">
              Stop switching between 12 tabs. DevNest brings your bookmarks,
              notes, code snippets, and habits into a single calm workspace —
              open source and fully private.
            </p>

            <div className="mb-6 flex flex-wrap gap-4 max-lg:justify-center">
              <Button className="h-12 gap-2 rounded-xl bg-linear-to-r from-violet-300 to-violet-500 px-6 text-sm font-semibold text-zinc-950 transition-colors duration-300 hover:from-violet-200 hover:to-violet-400">
                Start building your nest
                <FiArrowRight
                  className="transition-transform duration-200 group-hover/button:translate-x-1"
                  size={16}
                />
              </Button>
              <Button
                variant="ghost"
                className="h-12 gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-medium text-stone-300 transition-colors duration-300 hover:bg-white/10 hover:text-white dark:hover:bg-white/10"
              >
                <FaGithub size={16} />
                View source on GitHub
              </Button>
            </div>

            <p className="text-center text-xs text-zinc-500 max-lg:text-center">
              <span className="font-mono text-xs text-cyan-300">
                v1.0.0-beta
              </span>
              {" — "}
              No account required for core tools
            </p>
          </div>

          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

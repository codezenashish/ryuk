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
      {/* Warm ambient gradients */}
      <div className="pointer-events-none absolute -top-50 -left-50 h-175 w-175 bg-[radial-gradient(circle,rgba(139,115,85,0.08)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -right-50 -bottom-50 h-150 w-150 bg-[radial-gradient(circle,rgba(107,143,113,0.06)_0%,transparent_70%)]" />

      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-16 md:gap-12 lg:grid-cols-2">
          <div className="max-w-130 max-lg:max-w-full max-lg:text-center">
            <div className="mb-6 flex items-center gap-3 max-lg:justify-center">
              <span className="rounded-full border border-stone-500/20 bg-stone-500/8 px-3 py-1 text-[11px] font-medium tracking-widest text-stone-300 uppercase">
                Open Source
              </span>
              <span className="h-1 w-1 rounded-full bg-stone-700" />
              <span className="rounded-full border border-stone-500/20 bg-stone-500/8 px-3 py-1 text-[11px] font-medium tracking-widest text-stone-300 uppercase">
                Privacy-first
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-inter text-white sm:text-5xl md:text-6xl">
              One place for
              <br />
              <span className="bg-linear-to-r from-white via-stone-300 to-stone-500 bg-clip-text font-serif text-transparent">
                everything
              </span>{" "}
              you build
            </h1>

            <p className="mx-auto mb-8 max-w-110 text-sm leading-relaxed text-stone-400 normal-case max-lg:max-w-full md:text-lg lg:mx-0">
              Stop switching between 12 tabs. DevNest brings your bookmarks,
              notes, code snippets, and habits into a single calm workspace —
              open source and fully private.
            </p>

            <div className="mb-6 flex flex-wrap gap-4 max-lg:justify-center">
              <Button className="h-12 gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-stone-900 transition-all duration-300 hover:bg-stone-100 hover:shadow-lg hover:shadow-white/5">
                Start building your nest
                <FiArrowRight
                  className="transition-transform duration-200 group-hover/button:translate-x-1"
                  size={16}
                />
              </Button>
              <Button
                variant="ghost"
                className="h-12 gap-2 rounded-xl border border-white/8 bg-white/4 px-6 text-sm font-medium text-stone-400 transition-all duration-300 hover:border-white/14 hover:bg-white/8 hover:text-white"
              >
                <a
                  href="https://github.com/codezenashish/devnest.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FaGithub size={16} />
                  View source on GitHub
                </a>
              </Button>
            </div>

            <p className="text-center text-xs text-stone-500 max-lg:text-center lg:text-left">
              <span className="font-mono text-xs text-stone-400">
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

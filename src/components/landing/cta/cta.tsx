import { LuHouse, LuStar } from "react-icons/lu";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden px-4 pb-32">
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-96 w-96 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,194,61,0.02)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-96 w-96 -translate-y-1/2 bg-[radial-gradient(circle,rgba(61,202,191,0.02)_0%,transparent_70%)]" />

      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/10 px-6 py-16 text-center backdrop-blur-xl sm:py-20">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent" />

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase backdrop-blur-md">
            <LuHouse size={12} className="text-zinc-600" />
            <span>DevNest Hub</span>
          </div>

          <h2 className="mx-auto mb-5 max-w-2xl font-sans text-3xl leading-tight font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Start gathering it all <br />
            <span className="text-zinc-500">in one unified space.</span>
          </h2>

          <p className="mx-auto mb-10 max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-base">
            Open source, privacy-first infrastructure, and completely free to
            self-host. Your control, your data layer rules.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              render={<a href="#features" />}
              nativeButton={false}
              className="h-11 rounded-xl border-zinc-700 bg-zinc-800 px-6 text-sm text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
            >
              Create your nest
            </Button>

            <Button
              render={
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              variant="outline"
              className="h-11 rounded-xl border-zinc-800 bg-zinc-950/40 px-6 text-sm text-zinc-400 hover:border-zinc-700 hover:bg-zinc-950/40 hover:text-zinc-200"
            >
              <LuStar size={14} className="text-zinc-500" />
              Star on GitHub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

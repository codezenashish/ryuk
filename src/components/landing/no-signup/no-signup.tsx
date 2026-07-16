import CommandGeneratorMockup from "./command-generator-mockup";
import QuickDocsMockup from "./quick-docs-mockup";
export default function NoSignup() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-800/60 to-transparent" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10">
        <div className="flex max-w-2xl flex-col items-center gap-y-3 text-center">
          <div className="mb-3 max-w-fit rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-1 backdrop-blur-sm">
            <span className="text-sm  tracking-wide text-violet-200">
              No sign-up needed
            </span>
          </div>
          <h2 className="text-4xl font-inter text-white sm:text-5xl md:text-6xl">
            Try it{" "}
            <span className="bg-linear-to-r from-white via-violet-200 to-violet-400 bg-clip-text font-serif text-transparent">
              right here
            </span>
          </h2>
          <p className="text-sm text-zinc-400 md:text-base">
            These tools run fully in your browser — no account, no data sent
            anywhere.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 items-stretch gap-5 md:auto-rows-fr md:grid-cols-2 md:gap-6">
          <CommandGeneratorMockup />
          <QuickDocsMockup />
        </div>
      </div>
    </section>
  );
}

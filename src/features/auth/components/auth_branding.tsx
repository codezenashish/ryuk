export default function AuthBranding() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden  p-10  md:flex">
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="from-violet-650 relative flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr to-indigo-500 text-sm font-black text-white shadow-lg shadow-violet-500/20">
          ⚡
        </div>
        <span className="font-sans text-base font-bold tracking-wider text-white">
          DevSpace
        </span>
        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-medium text-violet-400">
          v1.0
        </span>
      </div>

      <div className="relative z-10 my-auto py-12">
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-4xl text-white sm:text-5xl md:text-6xl">
              Accelerate your{" "}
              <span className="bg-linear-to-r from-white via-violet-200 to-violet-400 bg-clip-text font-serif text-transparent">
                daily workflow
              </span>
            </h2>
            <p className="mx-auto mb-8  text-sm text-zinc-400 normal-case max-lg:max-w-full md:text-lg lg:mx-0">
              Save bookmarks, organize notes, manage snippets, track habits, set
              goals, stay focused with built-in productivity tools and keep
              everthing you need in one place -built for devlopers,
              studetns,creators and lifelong learners
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-zinc-600">
        <span>© 2026 DevSpace Technologies Inc.</span>
        <span>Secure HTTPS Connection</span>
      </div>
    </div>
  );
}

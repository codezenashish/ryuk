type AuthBrandingProps = {
  title?: string;
  description?: string;
};

export default function AuthBranding({
  title = "Accelerate your daily workflow",
  description = "Save bookmarks, organize notes, manage snippets, track habits, and stay focused with productivity tools built for developers, students, and creators.",
}: AuthBrandingProps) {
  return (
    <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-white/10 bg-zinc-950 p-10 md:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.22),transparent_45%)]" />
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr from-violet-600 to-indigo-500 text-sm font-black text-white shadow-lg shadow-violet-500/20">
          ⚡
        </div>
        <span className=" text-base tracking-wider text-white">
          DevSpace
        </span>
        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-medium text-violet-400">
          v1.0
        </span>
      </div>

      <div className="relative z-10 my-auto max-w-xl py-12">
        <h1 className="text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 text-sm leading-7 text-zinc-400 md:text-base">
          {description}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-zinc-600">
        <span>© 2026 DevSpace Technologies Inc.</span>
        <span>Secure HTTPS Connection</span>
      </div>
    </aside>
  );
}

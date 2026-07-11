import type { ReactNode } from "react";

export default function MockupWindow({
  id,
  title,
  icon,
  children,
}: {
  id?: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/9 bg-[#09090b] ring-1 ring-white/2.5"
    >
      <header className="flex h-12 items-center gap-3 border-b border-white/[0.07] px-4 sm:px-5">
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        </div>
        <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-stone-500 uppercase">
          {icon}
          <h3 className="font-inherit truncate">{title}</h3>
        </div>
      </header>
      {children}
    </div>
  );
}

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
      className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/7 bg-[#111110] transition-all duration-500 hover:border-white/12 hover:shadow-xl hover:shadow-black/20"
    >
      <header className="flex h-12 items-center gap-3 border-b border-white/6 px-4 sm:px-5">
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-stone-800" />
          <span className="h-2.5 w-2.5 rounded-full bg-stone-800" />
          <span className="h-2.5 w-2.5 rounded-full bg-stone-800" />
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

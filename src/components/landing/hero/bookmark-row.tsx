interface BookmarkRowProps {
  label: string;
  tag: string;
}

export default function BookmarkRow({ label, tag }: BookmarkRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-1.5">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="rounded-full bg-violet-400/10 px-1.5 py-0.5 font-mono text-[10px] text-violet-200">
        {tag}
      </span>
    </div>
  );
}

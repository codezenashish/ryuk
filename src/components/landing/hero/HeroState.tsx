type StatsProps = {
  value: string;
  label: string;
};

const HeroStats = ({ value, label }: StatsProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-28 w-28 rounded-full bg-indigo-400/10 blur-2xl opacity-0 transition group-hover:opacity-100" />

      <p className="text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-400">{label}</p>
    </div>
  );
};

export default HeroStats;

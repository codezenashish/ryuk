export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Dashboard</h1>
        <p className="text-sm text-zinc-400">Welcome back to DevNest. Here is your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-400 font-mono">BOOKMARKS</h3>
          <p className="text-3xl font-bold text-white">24</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-400 font-mono">HABITS</h3>
          <p className="text-3xl font-bold text-white">82%</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-400 font-mono">COMPLETED TODAY</h3>
          <p className="text-3xl font-bold text-white">5/8</p>
        </div>
      </div>
    </div>
  );
}

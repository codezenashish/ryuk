import { Hammer } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-ink px-4 text-center">
      <div className="p-5 bg-paper-2 border border-line shadow-sm rounded-3xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Hammer className="w-10 h-10 text-ink-2" />
      </div>
      <h1 className="text-4xl font-display font-bold tracking-tight text-ink mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        Work in Progress
      </h1>
      <p className="text-lg text-ink-3 max-w-md mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        We&apos;re currently building the leaderboard feature! Check back later for updates.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:bg-ink-2 transition shadow-sm animate-in fade-in zoom-in-95 duration-700 delay-200"
      >
        Go back home
      </Link>
    </div>
  );
}
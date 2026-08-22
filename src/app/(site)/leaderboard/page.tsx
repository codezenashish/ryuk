import { Hammer } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-foreground px-4 text-center">
      <div className="p-5 bg-card border border-border shadow-sm rounded-3xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Hammer className="w-10 h-10 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-sans font-bold tracking-tight text-foreground mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        Work in Progress
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        We&apos;re currently building the leaderboard feature! Check back later for updates.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition shadow-sm animate-in fade-in zoom-in-95 duration-700 delay-200"
      >
        Go back home
      </Link>
    </div>
  );
}
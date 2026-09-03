import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-zinc-100 px-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Ryuk</h1>
        <p className="text-sm text-zinc-400">
          Minimal developer-first personal knowledge operating system.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

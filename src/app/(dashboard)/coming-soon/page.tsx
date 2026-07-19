"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ComingSoonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature")?.trim() || "This feature";

  return (
    <section className="flex min-h-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 text-center shadow-2xl shadow-violet-950/20 sm:p-12">
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-500/10">
          <svg
            viewBox="0 0 120 120"
            aria-hidden="true"
            className="h-20 w-20 text-violet-300"
            fill="none"
          >
            <path
              d="M29 79.5 47.5 61l12 12L91 41.5"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M77 41.5H91v14"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="30" cy="80" r="7" fill="currentColor" />
            <circle cx="48" cy="61" r="7" fill="currentColor" />
            <circle cx="60" cy="73" r="7" fill="currentColor" />
            <circle cx="91" cy="42" r="7" fill="currentColor" />
          </svg>
        </div>

        <div className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-violet-300">
          <Sparkles className="h-4 w-4" />
          Coming soon
        </div>
        <h1 className="font-instrument text-4xl leading-tight text-white sm:text-5xl">
          {feature} is a work in progress.
        </h1>
        <p className="mt-5 text-sm leading-6 text-zinc-400 sm:text-base">
          Awesome things take time. This feature is coming soon!
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:border-violet-400/50 hover:bg-violet-500/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    </section>
  );
}

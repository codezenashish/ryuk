"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * VyrnHeroPlayground
 * -------------------
 * Adapted from an avatar-customizer playground into a live "product preview"
 * for VYRN's hero section. Instead of picking avatar traits, the user picks
 * a feature tab (Notes / Habits / Bookmarks / Snippets / Draw) and a sample
 * item, and the left panel renders a mock live preview of that feature —
 * exactly like a tiny dashboard demo.
 *
 * No external avatar library or theme registry is required — everything is
 * self-contained mock data so you can drop this straight into your project.
 */

type FeatureId = "notes" | "habits" | "bookmarks" | "snippets" | "draw";

type SampleItem = {
  id: string;
  label: string;
};

const FEATURES: { id: FeatureId; label: string; items: SampleItem[] }[] = [
  {
    id: "notes",
    label: "Notes",
    items: [
      { id: "launch-plan", label: "Launch plan" },
      { id: "reading-list", label: "Reading list" },
      { id: "meeting-notes", label: "Meeting notes" },
      { id: "ideas", label: "Random ideas" },
    ],
  },
  {
    id: "habits",
    label: "Habits",
    items: [
      { id: "read", label: "Read 20 min" },
      { id: "workout", label: "Workout" },
      { id: "water", label: "Drink water" },
      { id: "sleep", label: "Sleep by 11" },
    ],
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    items: [
      { id: "design", label: "Design inspo" },
      { id: "articles", label: "Long reads" },
      { id: "tools", label: "Dev tools" },
      { id: "shopping", label: "Wishlist" },
    ],
  },
  {
    id: "snippets",
    label: "Snippets",
    items: [
      { id: "js", label: "JavaScript" },
      { id: "py", label: "Python" },
      { id: "css", label: "CSS" },
      { id: "bash", label: "Bash" },
    ],
  },
  {
    id: "draw",
    label: "Draw",
    items: [
      { id: "sketch-1", label: "Wireframe" },
      { id: "sketch-2", label: "Doodle" },
      { id: "sketch-3", label: "Diagram" },
      { id: "sketch-4", label: "Mind map" },
    ],
  },
];

const SNIPPET_CODE: Record<string, string> = {
  js: `function greet(name) {\n  return \`Hello, \${name}!\`\n}`,
  py: `def greet(name):\n    return f"Hello, {name}!"`,
  css: `.card {\n  border-radius: 12px;\n  padding: 16px;\n}`,
  bash: `#!/bin/bash\necho "Hello, $1!"`,
};

const tabBase =
  "cursor-pointer rounded-md border-none bg-transparent px-3 py-1.5 font-mono text-[11.5px] tracking-[0.06em] whitespace-nowrap hover:bg-muted";
const optionBase =
  "relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border border-border bg-[#0c0c0c] p-2 text-center transition hover:-translate-y-px hover:border-foreground/20";
const optionActive = "border-foreground bg-[#181818]";
const buttonClass =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-foreground transition hover:border-foreground/20 hover:bg-card active:translate-y-px";
const primaryButtonClass =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-foreground bg-primary px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-primary-foreground transition hover:border-white hover:bg-white active:translate-y-px";

export function VyrnHeroPlayground() {
  const [activeTab, setActiveTab] = useState<FeatureId>("notes");
  const [selectedId, setSelectedId] = useState<string>(FEATURES[0].items[0].id);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const activeFeature = FEATURES.find((f) => f.id === activeTab) ?? FEATURES[0];
  const selectedItem =
    activeFeature.items.find((item) => item.id === selectedId) ??
    activeFeature.items[0];

  const updateTabScroll = useCallback(() => {
    const element = tabsRef.current;
    if (!element) return;
    setCanScrollLeft(element.scrollLeft > 1);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const element = tabsRef.current;
    if (!element) return;
    updateTabScroll();
    element.addEventListener("scroll", updateTabScroll);
    window.addEventListener("resize", updateTabScroll);
    return () => {
      element.removeEventListener("scroll", updateTabScroll);
      window.removeEventListener("resize", updateTabScroll);
    };
  }, [updateTabScroll]);

  function scrollTabs(direction: -1 | 1) {
    const element = tabsRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * Math.max(160, element.clientWidth * 0.6),
      behavior: "smooth",
    });
  }

  function pickTab(id: FeatureId) {
    setActiveTab(id);
    const first = FEATURES.find((f) => f.id === id)?.items[0];
    if (first) setSelectedId(first.id);
  }

  function shuffle() {
    const items = activeFeature.items;
    const random = items[Math.floor(Math.random() * items.length)];
    setSelectedId(random.id);
  }

  async function copyConfig() {
    const payload = JSON.stringify(
      { feature: activeTab, item: selectedItem.id },
      null,
      2,
    );
    try {
      await navigator.clipboard.writeText(payload);
      window.dispatchEvent(
        new CustomEvent("vyrn:toast", { detail: "Copied preview config" }),
      );
    } catch {
      return;
    }
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-border [background:linear-gradient(180deg,#131313_0%,#0d0d0d_100%)]">
      <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-2.5 font-mono text-[11.5px] tracking-[0.06em] text-muted-foreground">
        <span className="h-2 w-2 rounded-[2px] bg-border" />
        <span className="h-2 w-2 rounded-[2px] bg-border" />
        <span className="h-2 w-2 rounded-[2px] bg-border" />
        <span className="ml-1.5">vyrn · live preview</span>
        <span className="flex-1" />
        <span className="text-muted-foreground">viewing:</span>
        <span className="text-foreground">{selectedItem.label}</span>
      </div>

      <div className="grid min-h-[480px] grid-cols-1 md:grid-cols-2">
        {/* Left: live preview of the selected feature */}
        <div className="flex flex-col items-center justify-center gap-[18px] border-b border-border p-6 [background:radial-gradient(60%_60%_at_50%_40%,rgba(25,179,133,0.06),transparent_70%),#0e0e0e] md:border-r md:border-b-0">
          <FeaturePreview feature={activeTab} item={selectedItem} />
          <div className="flex flex-col items-center gap-1.5 font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
            <span>{activeFeature.label} · sample preview</span>
          </div>
        </div>

        {/* Right: tabs + sample picker */}
        <div className="flex min-w-0 flex-col gap-4 bg-[#101010] p-5">
          <div className="relative border-b border-border">
            <div
              ref={tabsRef}
              className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {FEATURES.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${tabBase} ${
                    activeTab === tab.id
                      ? "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--color-border)]"
                      : "text-muted-foreground hover:text-muted-foreground"
                  }`}
                  onClick={() => pickTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {canScrollLeft && (
              <button
                type="button"
                aria-label="Scroll tabs left"
                onClick={() => scrollTabs(-1)}
                className="absolute top-0 bottom-2 left-0 flex w-8 cursor-pointer items-center justify-start border-0 pl-0.5 text-muted-foreground [background:linear-gradient(to_right,#101010_55%,transparent)] hover:text-foreground"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {canScrollRight && (
              <button
                type="button"
                aria-label="Scroll tabs right"
                onClick={() => scrollTabs(1)}
                className="absolute top-0 right-0 bottom-2 flex w-8 cursor-pointer items-center justify-end border-0 pr-0.5 text-muted-foreground [background:linear-gradient(to_left,#101010_55%,transparent)] hover:text-foreground"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid max-h-[280px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
            {activeFeature.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${optionBase} ${
                  selectedId === item.id ? optionActive : ""
                }`}
                title={item.label}
                onClick={() => setSelectedId(item.id)}
              >
                <FeatureIcon feature={activeTab} />
                <span className="line-clamp-2 text-[10px] leading-tight text-muted-foreground">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className={buttonClass} onClick={shuffle}>
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
                <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
                <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" />
              </svg>
              Shuffle
            </button>
            <span className="flex-1" />
            <button
              type="button"
              className={primaryButtonClass}
              onClick={copyConfig}
            >
              <svg
                aria-hidden="true"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureIcon({ feature }: { feature: FeatureId }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "text-muted-foreground",
  };
  switch (feature) {
    case "notes":
      return (
        <svg {...common}>
          <path d="M4 4h16v16H4z" opacity="0" />
          <path d="M6 4h9l5 5v11H6z" />
          <path d="M9 12h6M9 16h6M9 8h3" />
        </svg>
      );
    case "habits":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 3v3M16 3v3" />
          <path d="M8 14l2 2 4-4" />
        </svg>
      );
    case "bookmarks":
      return (
        <svg {...common}>
          <path d="M6 3h12v18l-6-4-6 4z" />
        </svg>
      );
    case "snippets":
      return (
        <svg {...common}>
          <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" />
        </svg>
      );
    case "draw":
      return (
        <svg {...common}>
          <path d="M4 20l4-1 10-10-3-3L5 16l-1 4z" />
          <path d="M14 6l3 3" />
        </svg>
      );
  }
}

function FeaturePreview({
  feature,
  item,
}: {
  feature: FeatureId;
  item: SampleItem;
}) {
  const frame =
    "relative flex h-60 w-60 flex-col overflow-hidden rounded-2xl border border-border bg-[#131313] p-4 text-left shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]";

  if (feature === "notes") {
    return (
      <div className={frame}>
        <div className="mb-2 text-[13px] font-semibold text-foreground">
          {item.label}
        </div>
        <div className="space-y-1.5 text-[11px] leading-relaxed text-muted-foreground">
          <div className="h-2 w-[92%] rounded bg-border" />
          <div className="h-2 w-[78%] rounded bg-border" />
          <div className="h-2 w-[85%] rounded bg-border" />
          <div className="h-2 w-[60%] rounded bg-border" />
        </div>
        <span className="mt-auto pt-3 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
          EDITED 2H AGO
        </span>
      </div>
    );
  }

  if (feature === "habits") {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    return (
      <div className={frame}>
        <div className="mb-3 text-[13px] font-semibold text-foreground">
          {item.label}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, i) => {
            const done = (i % 3) !== 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="font-mono text-[9px] text-muted-foreground">{d}</span>
                <div
                  className={`h-6 w-6 rounded-md border ${
                    done
                      ? "border-emerald-500/40 bg-emerald-500/25"
                      : "border-border bg-transparent"
                  }`}
                />
              </div>
            );
          })}
        </div>
        <span className="mt-auto pt-4 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
          5 DAY STREAK
        </span>
      </div>
    );
  }

  if (feature === "bookmarks") {
    return (
      <div className={frame}>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-emerald-400/70 to-emerald-700/70" />
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-semibold text-foreground">
              {item.label}
            </div>
            <div className="truncate font-mono text-[10px] text-muted-foreground">
              vyrn.app/saved
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-2 w-[90%] rounded bg-border" />
          <div className="h-2 w-[70%] rounded bg-border" />
        </div>
        <span className="mt-auto pt-3 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
          SAVED TO BOOKMARKS
        </span>
      </div>
    );
  }

  if (feature === "snippets") {
    const code = SNIPPET_CODE[item.id] ?? SNIPPET_CODE.js;
    return (
      <div className={`${frame} font-mono`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-foreground">
            {item.label}
          </span>
          <span className="rounded bg-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
            {item.id}
          </span>
        </div>
        <pre className="flex-1 overflow-hidden whitespace-pre-wrap text-[10.5px] leading-relaxed text-emerald-300/90">
          {code}
        </pre>
      </div>
    );
  }

  // draw
  return (
    <div className={frame}>
      <div className="mb-2 text-[13px] font-semibold text-foreground">
        {item.label}
      </div>
      <svg viewBox="0 0 200 140" className="flex-1">
        <rect x="0" y="0" width="200" height="140" rx="10" fill="#0c0c0c" />
        <path
          d="M20 100 C 40 40, 80 40, 100 70 S 160 100, 180 40"
          fill="none"
          stroke="#34d399"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="60" cy="55" r="4" fill="#34d399" />
        <circle cx="140" cy="85" r="4" fill="#34d399" />
      </svg>
      <span className="mt-auto pt-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
        SKETCH · AUTOSAVED
      </span>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import {
  ChevronDown,
  Bookmark,
  FileText,
  LayoutDashboard,
  Settings,
  Plus,
  LayoutGrid,
  List,
  Upload,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";

const SECTIONS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Settings", href: "/setting", icon: Settings },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

export function SecondaryNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Bookmark store hooks
  const {
    layoutMode,
    setLayoutMode,
    openAddModal,
    openImportModal,
    bookmarks,
  } = useBookmarkStore();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine current active section
  const currentSection =
    SECTIONS.find((s) => pathname.startsWith(s.href)) ||
    (pathname === "/" ? SECTIONS[0] : { name: "Workspace", href: pathname, icon: Sparkles });

  const SectionIcon = currentSection.icon;

  const isBookmarksRoute = pathname.startsWith("/bookmarks");
  const isNotesRoute = pathname.startsWith("/notes");
  const isDashboardRoute = pathname === "/dashboard" || pathname === "/";
  const isSettingsRoute = pathname.startsWith("/setting");

  return (
    <nav className="h-11 w-full flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card/60 backdrop-blur-md shrink-0 text-xs select-none">
      {/* Left Side: Route Selector Dropdown & Divider */}
      <div className="flex items-center gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-background border border-border text-foreground font-medium hover:bg-muted transition cursor-pointer shadow-2xs"
          >
            <span className="flex items-center justify-center h-4 w-4 rounded bg-primary/10 text-primary">
              <SectionIcon className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold text-xs tracking-tight">{currentSection.name}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Section Dropdown Popover */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-48 rounded-xl border border-border bg-card p-1 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border mb-1">
                Switch Section
              </div>
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = pathname.startsWith(sec.href);
                return (
                  <button
                    key={sec.href}
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push(sec.href);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{sec.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-px bg-border mx-1 sm:mx-2" />

        {/* Route Context Badge */}
        <div className="hidden sm:flex items-center gap-2">
          {isBookmarksRoute && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{bookmarks.length} Bookmarks</span>
            </span>
          )}
          {isNotesRoute && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <span>Notes & Workspace</span>
            </span>
          )}
          {isDashboardRoute && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Overview</span>
            </span>
          )}
          {isSettingsRoute && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span>Preferences</span>
            </span>
          )}
        </div>
      </div>

      {/* Right Side: Route-Specific Tools */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Bookmarks Tools */}
        {isBookmarksRoute && (
          <>
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border bg-background p-0.5 gap-0.5">
              <button
                type="button"
                onClick={() => setLayoutMode("grid")}
                className={`p-1 rounded transition cursor-pointer ${
                  layoutMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("list")}
                className={`p-1 rounded transition cursor-pointer ${
                  layoutMode === "list"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Import Button */}
            <button
              type="button"
              onClick={openImportModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition cursor-pointer active:translate-y-px shadow-2xs"
            >
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Import</span>
            </button>

            {/* Add Bookmark CTA */}
            <button
              type="button"
              onClick={() => openAddModal(null)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/80 transition cursor-pointer active:translate-y-px shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Bookmark</span>
            </button>
          </>
        )}

        {/* Notes Tools */}
        {isNotesRoute && (
          <>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-new-note"));
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/80 transition cursor-pointer active:translate-y-px shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Note</span>
            </button>
          </>
        )}

        {/* Dashboard Tools */}
        {isDashboardRoute && (
          <>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition cursor-pointer active:translate-y-px shadow-2xs"
              title="Refresh Dashboard"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sync</span>
            </button>
            <button
              type="button"
              onClick={() => openAddModal(null)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/80 transition cursor-pointer active:translate-y-px shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Quick Action</span>
            </button>
          </>
        )}

        {/* Settings Tools */}
        {isSettingsRoute && (
          <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <span className="rounded-md bg-background px-2 py-0.5 border border-border">Account v1.0</span>
          </div>
        )}
      </div>
    </nav>
  );
}

export default SecondaryNavbar;

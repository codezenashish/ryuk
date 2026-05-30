"use client";

import Link from "next/link";
import { RiBookmarkLine } from "react-icons/ri";

import { bottomItems, sections } from "./data";
import { NavItem } from "./NavItem";
import { NavSection } from "./NavSection";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-900 bg-black">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-zinc-900 px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10">
            <RiBookmarkLine className="text-indigo-400" size={16} />
          </div>

          <span className="text-sm font-semibold tracking-wide text-zinc-100">
            DevNest
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
        <nav className="space-y-6">
          {sections.map((section) => (
            <NavSection key={section.title} section={section} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="mt-auto border-t border-zinc-900 pt-5">
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </div>

          <button className="mt-4 flex h-10 w-full items-center justify-center rounded-xl bg-indigo-500 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
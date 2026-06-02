"use client";

import { bottomItems, sections } from "./data";
import { NavItem } from "./NavItem";
import { NavSection } from "./NavSection";

export default function Sidebar() {
  return (
    <aside className="flex h-full w-72 flex-col bg-black">
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5 scrollbar-none">
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

          <button className="mt-4 flex h-9 w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:text-white">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
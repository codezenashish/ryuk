"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar } from "@avatune/react";
import theme from "@avatune/yanliu-theme/react";
import { sidebar } from "./side-config";
import SidebarTag from "./sidebar-tag";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full font-body flex flex-col">
      {/* App Branding */}
      <Link
        href="/"
        className="flex h-16 items-center gap-3 border-b border-line px-4 shrink-0"
      >
        <Avatar theme={theme} seed="user@example.com" size={28} />
        <span className="font-display text-lg font-medium tracking-tight text-ink">
          Vyrn
        </span>
        <span className="ml-auto rounded-full border border-line-2 px-1.5 py-0.5 font-code text-[10px] tracking-[0.08em] text-ink-4">
          v1.0
        </span>
      </Link>

      <nav className="flex flex-col gap-1 p-3">

        {sidebar.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-paper-3 text-ink font-medium"
                  : "text-ink-3 hover:bg-paper-3/60 hover:text-ink"
              }`}
            >
              <div className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  strokeWidth={1.8}
                />
                <span>{item.label}</span>
              </div>

              {item.tag && (
                <SidebarTag tag={item.tag} variant={item.tagVariant} />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
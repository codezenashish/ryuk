"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/classname-merge";
import { NavItem as NavItemType } from "./sidebar-nav-types";

interface Props {
  item: NavItemType;
}

export function NavItem({ item }: Props) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150",
        isActive
          ? "border-zinc-800 bg-zinc-900 text-white"
          : "border-transparent text-zinc-500 hover:border-zinc-900 hover:bg-zinc-950 hover:text-zinc-200",
      )}
    >
      <span
        className={cn(
          "shrink-0 transition-colors duration-150",
          isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-300",
        )}
      >
        {item.icon}
      </span>

      <span className="flex-1 truncate">{item.label}</span>

      {item.badge && (
        <span
          className={cn(
            "rounded border px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
            isActive
              ? "border-zinc-700 bg-zinc-800 text-zinc-300"
              : "border-zinc-800 bg-zinc-900 text-zinc-500",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

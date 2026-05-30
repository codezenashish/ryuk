import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { NavItem as NavItemType } from "./types";

interface Props {
  item: NavItemType;
}

export function NavItem({ item }: Props) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200",
        item.active
          ? "border-zinc-800 bg-zinc-900 text-zinc-100"
          : "border-transparent text-zinc-400 hover:border-zinc-900 hover:bg-zinc-950 hover:text-zinc-100",
      )}
    >
      <span
        className={cn(
          "shrink-0",
          item.active ? "text-indigo-400" : "text-zinc-600",
        )}
      >
        {item.icon}
      </span>

      <span className="flex-1">{item.label}</span>

      {item.badge && (
        <span
          className={cn(
            "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
            item.badgeColor === "success"
              ? "border-emerald-950 bg-emerald-950/40 text-emerald-400"
              : "border-indigo-950 bg-indigo-950/40 text-indigo-400",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

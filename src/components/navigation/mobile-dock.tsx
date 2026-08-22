"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { sidebar } from "./side-config";

export default function MobileDock() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden">
      <nav className="flex items-center justify-around px-4 py-2.5 rounded-t-[28px] border-t border-border bg-card/95 backdrop-blur-2xl shadow-lg">
        {sidebar.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={`flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? "h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-lg scale-105"
                  : "h-11 w-11 rounded-full text-muted-foreground hover:text-foreground"
              }`}
            >
              <HugeiconsIcon
                icon={item.icon}
                size={22}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

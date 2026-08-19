"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { sidebar } from "./side-config";

export default function MobileDock() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 inset-x-4 z-50 lg:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <nav className="pointer-events-auto flex items-center justify-around p-2 rounded-full border border-line-2/40 bg-[#121214]/80 backdrop-blur-3xl shadow-2xl shadow-black/80 max-w-[360px] mx-auto ring-1 ring-white/5">
        {sidebar.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={`flex items-center justify-center transition-all duration-500 ease-out ${
                isActive
                  ? "h-12 w-12 rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-100"
                  : "h-12 w-12 rounded-full text-ink-3 hover:text-white hover:bg-white/5 hover:scale-105 active:scale-95"
              }`}
            >
              <HugeiconsIcon
                icon={item.icon}
                size={isActive ? 24 : 24}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={`transition-all duration-500 ${isActive ? 'scale-110' : ''}`}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

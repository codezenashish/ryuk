"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/classname-merge";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "Documenation", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
  { label: "Community", href: "/community" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-col items-center gap-4 lg:flex-row lg:gap-10">
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "text-sm transition-colors duration-200",
                  isActive ? "text-white" : "text-zinc-400 hover:text-white",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

interface NavItem {
  label: string;
  href: string;
}
const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "Architecture", href: "/architecture" },
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/chnagelog" },
];

const Navlinks = () => {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex items-center gap-6">
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive =
            pathname === href || pathname?.startsWith(`${href}/`);

          return (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "relative px-3 py-1.5 text-xs font-semibold tracking-wider transition-all duration-200 ease-in-out rounded-md",

                  isActive
                    ? "text-zinc-400 hover:text-zinc-100 bg-zinc-800/40 after:w-full"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40",
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
};

export default Navlinks;

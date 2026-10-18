"use client";

import { usePathname } from "next/navigation";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const DashboardHeader = () => {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (!path || path === "/" || path === "/dashboard") return "Dashboard";
    const segment = path.split("/").filter(Boolean).pop();
    if (!segment) return "Dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const title = getPageTitle(pathname);

  return (
    <header className="h-14 border-b border-sidebar-border flex items-center justify-between px-4 bg-background select-none shrink-0">
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-3">
          <SidebarToggle />
          <div className="h-4 w-px bg-sidebar-border" />
        </div>
        <h1 className="text-sm font-semibold text-foreground tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default DashboardHeader;

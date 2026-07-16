import type { IconSvgElement } from "@hugeicons/react";
import { Bookmark01Icon } from "@hugeicons/core-free-icons/Bookmark01Icon";
import { CalendarCheckIcon } from "@hugeicons/core-free-icons/CalendarCheckIcon";
import { CircleArrowDown01Icon } from "@hugeicons/core-free-icons/CircleArrowDown01Icon";
import { CircleArrowUp01Icon } from "@hugeicons/core-free-icons/CircleArrowUp01Icon";
import { CodeIcon } from "@hugeicons/core-free-icons/CodeIcon";
import { ComputerTerminal01Icon } from "@hugeicons/core-free-icons/ComputerTerminal01Icon";
import { DashboardSquare01Icon } from "@hugeicons/core-free-icons/DashboardSquare01Icon";
import { File01Icon } from "@hugeicons/core-free-icons/File01Icon";
import { PenTool01Icon } from "@hugeicons/core-free-icons/PenTool01Icon";
import { Search01Icon } from "@hugeicons/core-free-icons/Search01Icon";
import { UserIcon } from "@hugeicons/core-free-icons/UserIcon";

export interface NavItem {
  label: string;
  href: string;
  icon: IconSvgElement;
  active?: boolean;
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardSquare01Icon,
    active: true,
  },
  {
    label: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark01Icon,
  },
  {
    label: "Notes",
    href: "/notes",
    icon: File01Icon,
  },
  {
    label: "Habits",
    href: "/habits",
    icon: CalendarCheckIcon,
  },
  {
    label: "Dev Search",
    href: "/search",
    icon: Search01Icon,
  },
  {
    label: "Friends",
    href: "/friends",
    icon: UserIcon,
  },
  {
    label: "Received",
    href: "/received",
    icon: CircleArrowDown01Icon,
  },
  {
    label: "Sent",
    href: "/sent",
    icon: CircleArrowUp01Icon,
  },
  {
    label: "Excalidraw",
    href: "/excalidraw",
    icon: PenTool01Icon,
  },
  {
    label: "Snippets",
    href: "/snippets",
    icon: CodeIcon,
  },
  {
    label: "API Tester",
    href: "/api-tester",
    icon: ComputerTerminal01Icon,
  },
];

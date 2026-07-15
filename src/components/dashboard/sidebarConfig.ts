import type { IconSvgElement } from "@hugeicons/react";
import {
  Bookmark01Icon,
  CalendarCheckIcon,
  CircleArrowDown01Icon,
  CircleArrowUp01Icon,
  CodeIcon,
  ComputerTerminal01Icon,
  DashboardSquare01Icon,
  File01Icon,
  PenTool01Icon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

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

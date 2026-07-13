import { IconType } from "react-icons";
import {
  RiArrowDownCircleLine,
  RiArrowUpCircleLine,
  RiBookmarkLine,
  RiCalendarCheckLine,
  RiCodeLine,
  RiFileTextLine,
  RiLayoutGridLine,
  RiPenNibLine,
  RiSearchLine,
  RiTerminalLine,
  RiUserLine,
} from "react-icons/ri";

export interface NavItem {
  label: string;
  href: string;
  icon: IconType;
  active?: boolean;
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: RiLayoutGridLine,
    active: true,
  },
  {
    label: "Bookmarks",
    href: "/bookmarks",
    icon: RiBookmarkLine,
  },
  {
    label: "Notes",
    href: "/notes",
    icon: RiFileTextLine,
  },
  {
    label: "Habits",
    href: "/habits",
    icon: RiCalendarCheckLine,
  },
  {
    label: "Dev Search",
    href: "/search",
    icon: RiSearchLine,
  },
  {
    label: "Friends",
    href: "/friends",
    icon: RiUserLine,
  },
  {
    label: "Received",
    href: "/received",
    icon: RiArrowDownCircleLine,
  },
  {
    label: "Sent",
    href: "/sent",
    icon: RiArrowUpCircleLine,
  },
  {
    label: "Excalidraw",
    href: "/excalidraw",
    icon: RiPenNibLine,
  },
  {
    label: "Snippets",
    href: "/snippets",
    icon: RiCodeLine,
  },
  {
    label: "API Tester",
    href: "/api-tester",
    icon: RiTerminalLine,
  },
];

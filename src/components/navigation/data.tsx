import {
  RiAccountCircleLine,
  RiArrowDownCircleLine,
  RiArrowUpCircleLine,
  RiBookmarkLine,
  RiCalendarCheckLine,
  RiCodeLine,
  RiFileTextLine,
  RiLayoutGridLine,
  RiPenNibLine,
  RiQuestionLine,
  RiSearchLine,
  RiSettings3Line,
  RiTerminalLine,
  RiUserLine,
} from "react-icons/ri";

import { NavItem, NavSection } from "./types";

export const sections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <RiLayoutGridLine size={18} />,
        active: true,
      },
      {
        label: "Bookmarks",
        href: "/bookmarks",
        icon: <RiBookmarkLine size={18} />,
        badge: "24",
      },
      {
        label: "Notes",
        href: "/notes",
        icon: <RiFileTextLine size={18} />,
      },
      {
        label: "Habits",
        href: "/habits",
        icon: <RiCalendarCheckLine size={18} />,
      },
      {
        label: "Dev Search",
        href: "/search",
        icon: <RiSearchLine size={18} />,
      },
    ],
  },
  {
    title: "Shared",
    items: [
      {
        label: "Friends",
        href: "/friends",
        icon: <RiUserLine size={18} />,
        badge: "3",
      },
      {
        label: "Received",
        href: "/received",
        icon: <RiArrowDownCircleLine size={18} />,
        badge: "6",
        badgeColor: "success",
      },
      {
        label: "Sent",
        href: "/sent",
        icon: <RiArrowUpCircleLine size={18} />,
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        label: "Excalidraw",
        href: "/excalidraw",
        icon: <RiPenNibLine size={18} />,
      },
      {
        label: "Snippets",
        href: "/snippets",
        icon: <RiCodeLine size={18} />,
      },
      {
        label: "API Tester",
        href: "/api-tester",
        icon: <RiTerminalLine size={18} />,
      },
    ],
  },
];

export const bottomItems: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: <RiAccountCircleLine size={18} />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <RiSettings3Line size={18} />,
  },
  {
    label: "Help",
    href: "/help",
    icon: <RiQuestionLine size={18} />,
  },
];
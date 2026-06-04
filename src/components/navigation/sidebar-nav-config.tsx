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

import { NavItem, NavSection } from "./sidebar-nav-types";

export const sections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <RiLayoutGridLine size={17} />,
      },
      {
        label: "Bookmarks",
        href: "/bookmarks",
        icon: <RiBookmarkLine size={17} />,
        badge: "24",
      },
      {
        label: "Notes",
        href: "/notes",
        icon: <RiFileTextLine size={17} />,
      },
      {
        label: "Habits",
        href: "/habits",
        icon: <RiCalendarCheckLine size={17} />,
      },
      {
        label: "Dev Search",
        href: "/search",
        icon: <RiSearchLine size={17} />,
      },
    ],
  },
  {
    title: "Shared",
    items: [
      {
        label: "Friends",
        href: "/friends",
        icon: <RiUserLine size={17} />,
        badge: "3",
      },
      {
        label: "Received",
        href: "/received",
        icon: <RiArrowDownCircleLine size={17} />,
        badge: "6",
      },
      {
        label: "Sent",
        href: "/sent",
        icon: <RiArrowUpCircleLine size={17} />,
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        label: "Excalidraw",
        href: "/excalidraw",
        icon: <RiPenNibLine size={17} />,
      },
      {
        label: "Snippets",
        href: "/snippets",
        icon: <RiCodeLine size={17} />,
      },
      {
        label: "API Tester",
        href: "/api-tester",
        icon: <RiTerminalLine size={17} />,
      },
    ],
  },
];

export const bottomItems: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: <RiAccountCircleLine size={17} />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <RiSettings3Line size={17} />,
  },
  {
    label: "Help",
    href: "/help",
    icon: <RiQuestionLine size={17} />,
  },
];

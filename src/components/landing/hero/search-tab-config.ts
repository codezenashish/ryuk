import {
  Bookmark,
  FileText,
  Layers,
  CheckSquare,
  BarChart2,
  Settings,
} from "lucide-react";

export const tabs = [
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: Bookmark,
    placeholder:
      "https://github.com/trending — saving awesome dev resources...",
  },
  {
    id: "notes",
    label: "Notes",
    icon: FileText,
    placeholder:
      "How to configure Next.js middleware with custom proxy paths...",
  },
  {
    id: "diagrams",
    label: "Diagrams",
    icon: Layers,
    placeholder:
      "Designing core microservices layout architecture...",
  },
  {
    id: "habits",
    label: "Habits",
    icon: CheckSquare,
    placeholder:
      "Solved 2 LeetCode problems today, 4 days streak...",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart2,
    placeholder:
      "Analyzing workspace efficiency index this week...",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    placeholder:
      "Configuring global dark-theme preferences...",
  },
];
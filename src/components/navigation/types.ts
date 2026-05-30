import { ReactNode } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
  badge?: string;
  badgeColor?: "default" | "success";
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
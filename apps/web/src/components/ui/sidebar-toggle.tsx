"use client";

import { MorphIcon } from "morphicons/react";
import { PanelLeftClose, PanelLeftOpen } from "lucide";
import { useSidebarStore } from "@/store/sidebarStore";

interface SidebarToggleProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function SidebarToggle({
  className = "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center select-none",
  size = 18,
  strokeWidth = 1.8,
}: SidebarToggleProps) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      aria-expanded={isOpen}
      title={isOpen ? "Collapse sidebar (⌘B)" : "Expand sidebar (⌘B)"}
      className={className}
    >
      <MorphIcon
        icon={isOpen ? PanelLeftClose : PanelLeftOpen}
        size={size}
        strokeWidth={strokeWidth}
      />
    </button>
  );
}

export default SidebarToggle;

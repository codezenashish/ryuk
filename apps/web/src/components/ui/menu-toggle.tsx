"use client";

import { useState } from "react";
import { MorphIcon } from "morphicons/react";
import { Menu, X } from "lucide"; // data, not components

interface MenuToggleProps {
  open?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function MenuToggle({
  open: controlledOpen,
  onToggle,
  className = "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center select-none",
  size = 18,
  strokeWidth = 1.8,
}: MenuToggleProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleClick = () => {
    const next = !open;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      aria-label="Toggle menu"
      className={className}
    >
      <MorphIcon icon={open ? X : Menu} size={size} strokeWidth={strokeWidth} />
    </button>
  );
}

export default MenuToggle;

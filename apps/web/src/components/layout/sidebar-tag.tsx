import React from "react";

export type TagVariant = "default" | "secondary" | "accent" | "outline" | "primary";

interface SidebarTagProps {
  tag: string;
  variant?: TagVariant;
  className?: string;
}

export default function SidebarTag({
  tag,
  variant = "default",
  className = "",
}: SidebarTagProps) {
  const variantStyles: Record<TagVariant, string> = {
    default:
      "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    outline: "border border-sidebar-border text-muted-foreground",
    primary:
      "bg-sidebar-primary/10 text-sidebar-primary font-semibold border border-sidebar-primary/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {tag}
    </span>
  );
}

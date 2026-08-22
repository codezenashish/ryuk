import React from "react";

export type TagVariant = "emerald" | "amber" | "purple" | "blue" | "neutral";

export interface SidebarTagProps {
  tag: string;
  variant?: TagVariant;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  emerald:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
  amber:
    "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  purple:
    "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  neutral: "bg-muted text-muted-foreground border-border hover:bg-card",
};

export function SidebarTag({
  tag,
  variant = "emerald",
  className = "",
}: SidebarTagProps) {
  const style = variantStyles[variant] || variantStyles.emerald;

  return (
    <div className="flex items-center justify-center">
      <span
        className={`inline-flex items-center font-mono text-[9px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full border transition ${style} ${className}`}
      >
        {tag}
      </span>
    </div>
  );
}

export default SidebarTag;

"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CodeIcon,
  PaintBoardIcon,
  ShoppingCart01Icon,
  BookOpen01Icon,
  Film01Icon,
  Briefcase01Icon,
  UserStar01Icon,
  Building01Icon,
  TerminalIcon,
  Layout01Icon,
  Rocket01Icon,
  Database01Icon,
  GlobeIcon,
  Folder01Icon,
  DocumentCodeIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";

export const AVAILABLE_ICONS = [
  { name: "CodeIcon", icon: CodeIcon, label: "Code" },
  { name: "PaintBoardIcon", icon: PaintBoardIcon, label: "Design" },
  { name: "ShoppingCart01Icon", icon: ShoppingCart01Icon, label: "Shopping" },
  { name: "BookOpen01Icon", icon: BookOpen01Icon, label: "Reading" },
  { name: "Film01Icon", icon: Film01Icon, label: "Media" },
  { name: "Briefcase01Icon", icon: Briefcase01Icon, label: "Work" },
  { name: "UserStar01Icon", icon: UserStar01Icon, label: "Personal" },
  { name: "Building01Icon", icon: Building01Icon, label: "Company" },
  { name: "TerminalIcon", icon: TerminalIcon, label: "Terminal" },
  { name: "Layout01Icon", icon: Layout01Icon, label: "Layout" },
  { name: "Rocket01Icon", icon: Rocket01Icon, label: "Product" },
  { name: "Database01Icon", icon: Database01Icon, label: "Database" },
  { name: "GlobeIcon", icon: GlobeIcon, label: "Web" },
  { name: "Folder01Icon", icon: Folder01Icon, label: "Folder" },
  { name: "DocumentCodeIcon", icon: DocumentCodeIcon, label: "Docs" },
  { name: "StarIcon", icon: StarIcon, label: "Favorite" },
];

interface IconsPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconsPicker({ selectedIcon, onSelectIcon }: IconsPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-1.5 p-2 rounded-xl bg-card border border-border max-h-36 overflow-y-auto scrollbar-none">
      {AVAILABLE_ICONS.map((item) => {
        const isSelected = selectedIcon === item.name;
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onSelectIcon(item.name)}
            title={item.label}
            className={`flex items-center justify-center p-2 rounded-lg transition cursor-pointer ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-ring"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <HugeiconsIcon icon={item.icon} size={18} />
          </button>
        );
      })}
    </div>
  );
}

export default IconsPicker;

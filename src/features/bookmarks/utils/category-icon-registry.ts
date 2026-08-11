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
  WrenchIcon,
  GlobalIcon,
  SecurityIcon,
} from "@hugeicons/core-free-icons";

export const iconRegistry: Record<string, any> = {
  Folder01Icon,
  CodeIcon,
  Code: CodeIcon,
  PaintBoardIcon,
  Palette: PaintBoardIcon,
  ShoppingCart01Icon,
  BookOpen01Icon,
  BookOpen: BookOpen01Icon,
  Film01Icon,
  Briefcase01Icon,
  UserStar01Icon,
  Building01Icon,
  TerminalIcon,
  Layout01Icon,
  Rocket01Icon,
  Database01Icon,
  GlobeIcon,
  GlobalIcon,
  DocumentCodeIcon,
  StarIcon,
  WrenchIcon,
  SecurityIcon,
};

export function getIconComponent(iconName?: string) {
  if (!iconName) return Folder01Icon;
  return iconRegistry[iconName] || Folder01Icon;
}

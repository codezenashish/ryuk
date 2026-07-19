import type { IconSvgElement } from "@hugeicons/react";
import {
  GithubIcon,
  TwitterIcon,
  Linkedin01Icon,
  YoutubeIcon,
  InstagramIcon,
  DiscordIcon,
  TerminalIcon,
  BookOpen01Icon,
  PaintBoardIcon,
  Folder01Icon,
  GlobeIcon,
  CodeIcon,
  ShoppingCart01Icon,
  Film01Icon,
  Briefcase01Icon,
  UserStar01Icon,
  Building01Icon,
  Layout01Icon,
  Rocket01Icon,
  Database01Icon,
  DocumentCodeIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";

export const iconRegistry: Record<string, IconSvgElement> = {
  GithubIcon,
  TwitterIcon,
  Linkedin01Icon,
  YoutubeIcon,
  InstagramIcon,
  DiscordIcon,
  TerminalIcon,
  BookOpen01Icon,
  PaintBoardIcon,
  Folder01Icon,
  GlobeIcon,

  // Popular Icons for IconPicker
  CodeIcon,
  ShoppingCart01Icon,
  Film01Icon,
  Briefcase01Icon,
  UserStar01Icon,
  Building01Icon,
  Layout01Icon,
  Rocket01Icon,
  Database01Icon,
  DocumentCodeIcon,
  StarIcon,
};

export function getIconComponent(iconName: string) {
  return iconRegistry[iconName] || Folder01Icon;
}

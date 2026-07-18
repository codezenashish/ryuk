import React from "react";
import {
  GithubIcon,
  TwitterIcon,
  Linkedin01Icon,
  YoutubeIcon,
  InstagramIcon,
  DiscordIcon,
  TerminalIcon,
  BookOpen01Icon,
  PaletteIcon,
  Folder01Icon,
  Globe01Icon,
  CodeIcon,
  ShoppingCart01Icon,
  Film01Icon,
  Briefcase01Icon,
  UserStar01Icon,
  Building01Icon,
  Layout01Icon,
  Rocket01Icon,
  Database01Icon,
  DocumentTextIcon,
  StarIcon,
} from "hugeicons-react";

export const iconRegistry: Record<string, React.ComponentType<any>> = {
  GithubIcon,
  TwitterIcon,
  Linkedin01Icon,
  YoutubeIcon,
  InstagramIcon,
  DiscordIcon,
  TerminalIcon,
  BookOpen01Icon,
  PaletteIcon,
  Folder01Icon,
  Globe01Icon,
  
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
  DocumentTextIcon,
  StarIcon,
};

export function getIconComponent(iconName: string) {
  return iconRegistry[iconName] || Folder01Icon;
}
import React from "react";
import {
  RiGithubFill,
  RiTwitterXFill,
  RiLinkedinBoxFill,
  RiYoutubeFill,
  RiInstagramLine,
  RiDiscordFill,
  RiTerminalBoxLine,
  RiBookOpenLine,
  RiPaletteLine,
  RiFolder5Line,
  RiGlobalLine,
} from "react-icons/ri";

export const iconRegistry: Record<string, React.ComponentType<any>> = {
  RiGithubFill,
  RiTwitterXFill,
  RiLinkedinBoxFill,
  RiYoutubeFill,
  RiInstagramLine,
  RiDiscordFill,
  RiTerminalBoxLine,
  RiBookOpenLine,
  RiPaletteLine,
  RiFolder5Line,
  RiGlobalLine,
};

export function getIconComponent(iconName: string) {
  return iconRegistry[iconName] || RiFolder5Line;
}

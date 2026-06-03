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

// Map string tokens saved in DB to raw React Icons Components
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

// Simple safe fallback fetch helper
export function getIconComponent(iconName: string) {
  return iconRegistry[iconName] || RiFolder5Line;
}

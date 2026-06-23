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
  // Popular Icons for IconPicker
  RiCodeSLine,
  RiShoppingCartLine,
  RiFilmLine,
  RiBriefcaseLine,
  RiUserStarLine,
  RiBuildingLine,
  RiLayoutMasonryLine,
  RiRocketLine,
  RiDatabase2Line,
  RiArticleLine,
  RiStarLine,
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
  
  // Popular Icons for IconPicker
  RiCodeSLine,
  RiShoppingCartLine,
  RiFilmLine,
  RiBriefcaseLine,
  RiUserStarLine,
  RiBuildingLine,
  RiLayoutMasonryLine,
  RiRocketLine,
  RiDatabase2Line,
  RiArticleLine,
  RiStarLine,
};

export function getIconComponent(iconName: string) {
  return iconRegistry[iconName] || RiFolder5Line;
}

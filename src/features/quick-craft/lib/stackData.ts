import { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiReact,
  SiVuedotjs,
  SiSvelte,
  SiNpm,
  SiYarn,
  SiPnpm,
  SiBun,
  SiTailwindcss,
  SiStyledcomponents,
  SiBootstrap,
  SiSass,
  SiFramer,
  SiGreensock,
  SiRedux,
  SiFirebase,
  SiSupabase,
  SiAuth0,
} from "react-icons/si";
import { TbActivity, TbFeather, TbCircleDot, TbPackage } from "react-icons/tb";

export interface Framework {
  id: string;
  name: string;
  tag: string;
  icon: IconType;
}

export interface PackageManager {
  id: string;
  name: string;
  icon: IconType;
}

export interface FeatureItem {
  id: string;
  name: string;
  pkg: string[];
  dev?: boolean;
  group?: string;
  icon: IconType;
}

export interface FeatureCategory {
  id: string;
  label: string;
  items: FeatureItem[];
}

export const FRAMEWORKS: Framework[] = [
  {
    id: "nextjs",
    name: "Next.js",
    tag: "Full-stack React framework",
    icon: SiNextdotjs,
  },
  {
    id: "react-vite",
    name: "React (Vite)",
    tag: "Fast dev server, minimal config",
    icon: SiReact,
  },
  {
    id: "vue",
    name: "Vue",
    tag: "Progressive & approachable",
    icon: SiVuedotjs,
  },
  {
    id: "svelte",
    name: "Svelte",
    tag: "Compiles away, no virtual DOM",
    icon: SiSvelte,
  },
  {
    id: "none",
    name: "No Framework",
    tag: "Just install libraries in the current folder",
    icon: TbPackage,
  },
];

export const PACKAGE_MANAGERS: PackageManager[] = [
  { id: "npm", name: "NPM", icon: SiNpm },
  { id: "yarn", name: "Yarn", icon: SiYarn },
  { id: "pnpm", name: "PNPM", icon: SiPnpm },
  { id: "bun", name: "Bun", icon: SiBun },
];

export const CATEGORIES: FeatureCategory[] = [
  {
    id: "styling",
    label: "Styling",
    items: [
      {
        id: "tailwind",
        name: "Tailwind CSS",
        pkg: ["tailwindcss"],
        dev: true,
        group: "css-framework",
        icon: SiTailwindcss,
      },
      {
        id: "styled",
        name: "Styled Components",
        pkg: ["styled-components"],
        icon: SiStyledcomponents,
      },
      {
        id: "bootstrap",
        name: "Bootstrap",
        pkg: ["bootstrap"],
        group: "css-framework",
        icon: SiBootstrap,
      },
      { id: "sass", name: "Sass", pkg: ["sass"], dev: true, icon: SiSass },
    ],
  },
  {
    id: "animation",
    label: "Animation",
    items: [
      {
        id: "framer",
        name: "Framer Motion",
        pkg: ["framer-motion"],
        group: "animation",
        icon: SiFramer,
      },
      {
        id: "gsap",
        name: "GSAP",
        pkg: ["gsap"],
        group: "animation",
        icon: SiGreensock,
      },
      {
        id: "anime",
        name: "Anime.js",
        pkg: ["animejs"],
        group: "animation",
        icon: TbActivity,
      },
    ],
  },
  {
    id: "state",
    label: "State Management",
    items: [
      {
        id: "redux",
        name: "Redux Toolkit",
        pkg: ["@reduxjs/toolkit", "react-redux"],
        group: "state",
        icon: SiRedux,
      },
      {
        id: "zustand",
        name: "Zustand",
        pkg: ["zustand"],
        group: "state",
        icon: TbCircleDot,
      },
      {
        id: "jotai",
        name: "Jotai",
        pkg: ["jotai"],
        group: "state",
        icon: TbCircleDot,
      },
    ],
  },
  {
    id: "icons",
    label: "Icons",
    items: [
      {
        id: "lucide",
        name: "Lucide React",
        pkg: ["lucide-react"],
        icon: TbFeather,
      },
      {
        id: "reacticons",
        name: "React Icons",
        pkg: ["react-icons"],
        icon: SiReact,
      },
    ],
  },
  {
    id: "backend",
    label: "Backend / Auth",
    items: [
      {
        id: "firebase",
        name: "Firebase",
        pkg: ["firebase"],
        group: "backend",
        icon: SiFirebase,
      },
      {
        id: "supabase",
        name: "Supabase",
        pkg: ["@supabase/supabase-js"],
        group: "backend",
        icon: SiSupabase,
      },
      {
        id: "auth0",
        name: "Auth0",
        pkg: ["@auth0/auth0-react"],
        icon: SiAuth0,
      },
    ],
  },
];

export const GROUP_WARNINGS: Record<string, string> = {
  "css-framework":
    "Two CSS frameworks fight for the same job — pick Tailwind or Bootstrap, not both.",
  state: "You've picked more than one state manager. Most apps only need one.",
  backend:
    "Firebase and Supabase both want to be your backend. Running both means paying for two.",
  animation:
    "Multiple animation libraries add weight for little gain — one is usually enough.",
};

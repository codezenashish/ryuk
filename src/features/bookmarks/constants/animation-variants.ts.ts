import type { Variants } from "framer-motion";

export const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: -4, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.12 } },
};

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.96,
    transition: { duration: 0.15 },
  },
};

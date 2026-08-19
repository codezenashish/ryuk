import { useState, useCallback, useEffect, useRef } from 'react';
import { BookmarkCategory } from '../components/bookmark-card';

export function useCategoryContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState<BookmarkCategory | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback((e: React.MouseEvent, category: BookmarkCategory) => {
    e.preventDefault();
    e.stopPropagation();

    // Adjust position to prevent menu from going off-screen
    const menuWidth = 200;
    const menuHeight = 250;
    let x = e.clientX;
    let y = e.clientY;

    if (typeof window !== 'undefined') {
      if (window.innerWidth - x < menuWidth) {
        x = window.innerWidth - menuWidth - 10;
      }
      if (window.innerHeight - y < menuHeight) {
        y = window.innerHeight - menuHeight - 10;
      }
    }

    setPosition({ x, y });
    setActiveCategory(category);
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setActiveCategory(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("scroll", closeMenu, true);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("scroll", closeMenu, true);
    };
  }, [isOpen, closeMenu]);

  return {
    isOpen,
    position,
    activeCategory,
    menuRef,
    openMenu,
    closeMenu
  };
}

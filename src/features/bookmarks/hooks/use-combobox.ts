"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";

interface CategoryItem {
  label: string;
  icon: React.ComponentType<any>;
}

export function useCombobox(
  initialCategories: CategoryItem[],
  initialValue = "",
) {
  const [category, setCategory] = useState(initialValue);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const comboboxId = useId();
  const listboxId = `${comboboxId}-listbox`;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredCategories = initialCategories.filter((c) =>
    c.label.toLowerCase().includes(category.toLowerCase()),
  );

  const isNewCategory =
    category.trim().length > 0 &&
    !initialCategories.some(
      (c) => c.label.toLowerCase() === category.trim().toLowerCase(),
    );

  const optionCount = filteredCategories.length + (isNewCategory ? 1 : 0);

  const openDropdown = useCallback(() => setDropdownOpen(true), []);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
    setActiveIndex(-1);
  }, []);

  const selectCategory = useCallback((value: string) => {
    setCategory(value);
    setDropdownOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    },
    [closeDropdown],
  );

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, handleClickOutside]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [category]);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
    openDropdown();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        openDropdown();
        return;
      }
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % optionCount);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + optionCount) % optionCount);
        break;
      case "Enter":
        e.preventDefault();
        if (!dropdownOpen) break;
        if (activeIndex >= 0 && activeIndex < filteredCategories.length) {
          selectCategory(filteredCategories[activeIndex].label);
        } else if (activeIndex === filteredCategories.length && isNewCategory) {
          selectCategory(category.trim());
        } else if (filteredCategories.length === 1) {
          selectCategory(filteredCategories[0].label);
        } else if (category.trim()) {
          selectCategory(category.trim());
        } else {
          closeDropdown();
        }
        break;
      case "Escape":
        closeDropdown();
        break;
    }
  };

  const handleChevronClick = () => {
    if (dropdownOpen) {
      closeDropdown();
    } else {
      openDropdown();
      inputRef.current?.focus();
    }
  };

  const reset = useCallback(() => {
    setCategory("");
    setDropdownOpen(false);
    setActiveIndex(-1);
  }, []);

  return {
    category,
    setCategory,
    dropdownOpen,
    activeIndex,
    setActiveIndex,
    comboboxId,
    listboxId,
    containerRef,
    inputRef,
    listRef,
    filteredCategories,
    isNewCategory,
    openDropdown,
    closeDropdown,
    selectCategory,
    handleInputChange,
    handleKeyDown,
    handleChevronClick,
    reset,
  };
}

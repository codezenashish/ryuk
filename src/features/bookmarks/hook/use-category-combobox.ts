"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  useMemo,
} from "react";
import type { IconSvgElement } from "@hugeicons/react";

interface ComboboxSelectableItem {
  label: string;
  icon: IconSvgElement;
}

export function useCombobox(
  availableComboboxItems: ComboboxSelectableItem[],
  initialSelectionValue = "",
) {
  const [inputValue, setInputValue] = useState(initialSelectionValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeHighlightedIndex, setActiveHighlightedIndex] = useState(-1);

  const comboboxId = useId();
  const listboxId = `${comboboxId}-listbox`;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);


  const lowercasedItems = useMemo(
    () =>
      availableComboboxItems.map((item) => ({
        ...item,
        _lowerLabel: item.label.toLowerCase(),
      })),
    [availableComboboxItems],
  );


  const { filteredItems, isNewValueTyped } = useMemo(() => {
    const lowerInput = inputValue.toLowerCase();
    const trimmedInput = inputValue.trim().toLowerCase();

    const filtered = lowercasedItems.filter((item) =>
      item._lowerLabel.includes(lowerInput),
    );

 
    const isNew =
      trimmedInput.length > 0 &&
      !lowercasedItems.some((item) => item._lowerLabel === trimmedInput);

    return { filteredItems: filtered, isNewValueTyped: isNew };
  }, [inputValue, lowercasedItems]);

  const totalVisibleOptionsCount =
    filteredItems.length + (isNewValueTyped ? 1 : 0);

  const openDropdown = useCallback(() => setIsDropdownOpen(true), []);
  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
    setActiveHighlightedIndex(-1);
  }, []);

  const selectValue = useCallback((value: string) => {
    setInputValue(value);
    setIsDropdownOpen(false);
    setActiveHighlightedIndex(-1);
    inputRef.current?.focus();
  }, []);

  
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    },
    [closeDropdown],
  );

  useEffect(() => {
    if (isDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, handleClickOutside]);

  
  useEffect(() => {
    if (activeHighlightedIndex < 0 || !listRef.current) return;
    listRef.current
      .querySelector<HTMLElement>(`[data-index="${activeHighlightedIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeHighlightedIndex]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setActiveHighlightedIndex(-1);
    openDropdown();
  };

 
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        openDropdown();
        return;
      }
    }
    switch (event.key) {
      case "ArrowDown":
        if (!totalVisibleOptionsCount) return;
        event.preventDefault();
        setActiveHighlightedIndex(
          (prev) => (prev + 1) % totalVisibleOptionsCount,
        );
        break;
      case "ArrowUp":
        if (!totalVisibleOptionsCount) return;
        event.preventDefault();
        setActiveHighlightedIndex(
          (prev) =>
            (prev - 1 + totalVisibleOptionsCount) % totalVisibleOptionsCount,
        );
        break;
      case "Enter":
        event.preventDefault();
        if (!isDropdownOpen) break;
        if (
          activeHighlightedIndex >= 0 &&
          activeHighlightedIndex < filteredItems.length
        ) {
          selectValue(filteredItems[activeHighlightedIndex].label);
        } else if (
          activeHighlightedIndex === filteredItems.length &&
          isNewValueTyped
        ) {
          selectValue(inputValue.trim());
        } else if (filteredItems.length === 1) {
          selectValue(filteredItems[0].label);
        } else if (inputValue.trim()) {
          selectValue(inputValue.trim());
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
    if (isDropdownOpen) {
      closeDropdown();
    } else {
      openDropdown();
      inputRef.current?.focus();
    }
  };

  const resetCombobox = useCallback(() => {
    setInputValue("");
    setIsDropdownOpen(false);
    setActiveHighlightedIndex(-1);
  }, []);

  return {
    inputValue,
    setInputValue,
    isDropdownOpen,
    activeHighlightedIndex,
    setActiveHighlightedIndex,
    comboboxId,
    listboxId,
    containerRef,
    inputRef,
    listRef,
    filteredItems,
    isNewValueTyped,
    openDropdown,
    closeDropdown,
    selectValue,
    handleInputChange,
    handleKeyDown,
    handleChevronClick,
    resetCombobox,
  };
}

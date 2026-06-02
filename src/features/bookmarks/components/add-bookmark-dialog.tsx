"use client";

import {
  X,
  ChevronDown,
  Link,
  Bookmark,
  Folder,
  Users,
  Terminal,
  FileText,
  Palette,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCombobox } from "../hooks/use-combobox";

interface AddBookmarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { label: "Social Accounts", icon: Users },
  { label: "Dev Tools", icon: Terminal },
  { label: "Documentation", icon: FileText },
  { label: "Design Resources", icon: Palette },
];

export default function AddBookmarkDialog({
  isOpen,
  onClose,
}: AddBookmarkDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const combo = useCombobox(CATEGORIES);

  useEffect(() => {
    if (isOpen) {
      setUrl("");
      setTitle("");
      combo.reset();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ url, title, category: combo.category.trim() });
    setUrl("");
    setTitle("");
    combo.reset();
    onClose();
  };

  const handleClose = () => {
    combo.closeDropdown();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="relative w-full max-w-md z-10 rounded-2xl p-6"
            style={{
              background: "rgba(14, 14, 17, 0.98)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 0 0 0.5px rgba(255,255,255,0.04) inset, 0 24px 64px rgba(0,0,0,0.7)",
            }}
          >
            <div
              className="flex items-center justify-between pb-4 mb-5"
              style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}
            >
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/80 font-mono">
                Add New Bookmark
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer border border-white/[0.07] bg-white/3 text-white/35 hover:text-white/85 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium uppercase tracking-widest text-white/3 font-mono">
                  URL / Link
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="h-9 w-full rounded-xl pl-9 pr-3 text-xs outline-none bg-white/[0.03] border border-white/[0.07] text-white/85 focus:border-white/14 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium uppercase tracking-widest text-white/3 font-mono">
                  Title
                </label>
                <div className="relative">
                  <Bookmark className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Repository or Website Name"
                    className="h-9 w-full rounded-xl pl-9 pr-3 text-xs outline-none bg-white/[0.03] border border-white/[0.07] text-white/85 focus:border-white/14 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={combo.comboboxId}
                  className="block text-[10px] font-medium uppercase tracking-widest text-white/3 font-mono"
                >
                  Category
                </label>
                <div className="relative" ref={combo.containerRef}>
                  <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none z-10" />
                  <input
                    ref={combo.inputRef}
                    id={combo.comboboxId}
                    type="text"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={combo.dropdownOpen}
                    aria-controls={combo.listboxId}
                    aria-activedescendant={
                      combo.activeIndex >= 0
                        ? `${combo.comboboxId}-option-${combo.activeIndex}`
                        : undefined
                    }
                    autoComplete="off"
                    value={combo.category}
                    onChange={combo.handleInputChange}
                    onFocus={combo.openDropdown}
                    onKeyDown={combo.handleKeyDown}
                    placeholder="Select or type a category…"
                    className="h-9 w-full rounded-xl pl-9 pr-9 text-xs outline-none transition-all text-white/85"
                    style={{
                      background: combo.dropdownOpen
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.03)",
                      border: `0.5px solid ${combo.dropdownOpen ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  />

                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={combo.handleChevronClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
                  >
                    <motion.div
                      animate={{ rotate: combo.dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {combo.dropdownOpen &&
                      (combo.filteredCategories.length > 0 ||
                        combo.isNewCategory) && (
                        <motion.div
                          ref={combo.listRef}
                          id={combo.listboxId}
                          role="listbox"
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="absolute left-0 right-0 top-[calc(100%+6px)] rounded-xl overflow-hidden z-50 max-h-52 overflow-y-auto bg-[#16161a] border border-white/10 shadow-2xl"
                          style={{ scrollbarWidth: "none" }}
                        >
                          {combo.filteredCategories.map(
                            ({ label, icon: Icon }, idx) => {
                              const isActive = idx === combo.activeIndex;
                              return (
                                <div
                                  key={label}
                                  id={`${combo.comboboxId}-option-${idx}`}
                                  role="option"
                                  aria-selected={combo.category === label}
                                  data-index={idx}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    combo.selectCategory(label);
                                  }}
                                  onMouseEnter={() => combo.setActiveIndex(idx)}
                                  onMouseLeave={() => combo.setActiveIndex(-1)}
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs cursor-pointer select-none transition-colors"
                                  style={{
                                    color: isActive
                                      ? "rgba(255,255,255,0.92)"
                                      : "rgba(255,255,255,0.6)",
                                    background: isActive
                                      ? "rgba(255,255,255,0.06)"
                                      : "transparent",
                                  }}
                                >
                                  <Icon
                                    className="w-3.5 h-3.5 shrink-0"
                                    style={{
                                      color: isActive
                                        ? "rgba(255,255,255,0.5)"
                                        : "rgba(255,255,255,0.25)",
                                    }}
                                  />
                                  <span className="flex-1 truncate">
                                    {label}
                                  </span>
                                  {combo.category === label && (
                                    <span className="text-[9px] font-medium uppercase tracking-wider text-indigo-400/70">
                                      selected
                                    </span>
                                  )}
                                </div>
                              );
                            },
                          )}

                          {combo.isNewCategory && (
                            <>
                              {combo.filteredCategories.length > 0 && (
                                <div className="border-t border-white/[0.06]" />
                              )}
                              <div
                                id={`${combo.comboboxId}-option-${combo.filteredCategories.length}`}
                                role="option"
                                data-index={combo.filteredCategories.length}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  combo.closeDropdown();
                                  combo.inputRef.current?.focus();
                                }}
                                onMouseEnter={() =>
                                  combo.setActiveIndex(
                                    combo.filteredCategories.length,
                                  )
                                }
                                onMouseLeave={() => combo.setActiveIndex(-1)}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs cursor-pointer select-none transition-colors"
                                style={{
                                  color:
                                    combo.activeIndex ===
                                    combo.filteredCategories.length
                                      ? "#a5b4fc"
                                      : "#818cf8",
                                  background:
                                    combo.activeIndex ===
                                    combo.filteredCategories.length
                                      ? "rgba(129,140,248,0.09)"
                                      : "transparent",
                                }}
                              >
                                <Plus className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  Create{" "}
                                  <span className="font-semibold">
                                    &ldquo;{combo.category.trim()}&rdquo;
                                  </span>
                                </span>
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              </div>

              <div
                className="flex items-center justify-end gap-2 pt-4 mt-2"
                style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-white/[0.07] bg-white/[0.02] text-white/40 hover:text-white/85 hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-white text-[#0f0f12] cursor-pointer transition-colors"
                >
                  Save Bookmark
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

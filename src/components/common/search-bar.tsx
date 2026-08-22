"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search bookmarks, notes, tools...",
  onSearch,
  value,
  className = "",
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState("");
  
  const query = value !== undefined ? value : internalQuery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalQuery(val);
    if (onSearch) onSearch(val);
  };

  const handleClear = () => {
    setInternalQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <div
      className={`group relative flex items-center w-full max-w-sm rounded-xl border border-border bg-card px-3 py-1.5 transition-all duration-200 focus-within:border-foreground focus-within:bg-card focus-within:ring-2 focus-within:ring-ring/10 ${className}`}
    >
      <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5 transition-colors group-focus-within:text-foreground" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      {query ? (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground select-none">
          ⌘K
        </kbd>
      )}
    </div>
  );
}

export default SearchBar;

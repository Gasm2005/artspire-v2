import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableSearchProps {
  /** Called with debounced value as user types */
  onSearch: (query: string) => void;
  /** Debounce delay in ms. Default 300. */
  debounceMs?: number;
  placeholder?: string;
  className?: string;
  /** Initial value */
  defaultValue?: string;
  /** Keep expanded (controlled mode) */
  alwaysOpen?: boolean;
}

/**
 * Expandable search bar.
 * - Collapses to icon on mobile/desktop until clicked
 * - Expands with smooth animation
 * - Debounced onChange
 * - Keyboard: Escape to close, auto-focus on open
 * - Future-ready: same API for Portfolio, Shop, Admin
 *
 * Usage:
 *   <ExpandableSearch onSearch={(q) => setQuery(q)} placeholder="Search artworks…" />
 */
export function ExpandableSearch({
  onSearch,
  debounceMs = 300,
  placeholder = "Search…",
  className,
  defaultValue = "",
  alwaysOpen = false,
}: ExpandableSearchProps) {
  const [isOpen, setIsOpen] = useState(alwaysOpen || !!defaultValue);
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      setValue(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(q), debounceMs);
    },
    [onSearch, debounceMs]
  );

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (alwaysOpen) {
        setValue("");
        onSearch("");
      } else {
        close();
      }
    }
  };

  const open = () => setIsOpen(true);

  const close = () => {
    if (alwaysOpen) return;
    setIsOpen(false);
    setValue("");
    onSearch("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  const clear = () => {
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      {/* Search icon button (collapsed state) */}
      {!isOpen && (
        <button
          onClick={open}
          aria-label="Open search"
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-white text-stone hover:text-forest hover:border-forest/30 transition-colors"
        >
          <Search size={15} />
        </button>
      )}

      {/* Expanded input */}
      {isOpen && (
        <div className="flex items-center gap-2 h-[40px] pl-3 pr-2 rounded-xl border border-border bg-white shadow-sm focus-within:border-gold transition-colors w-full min-w-[200px] max-w-[320px]">
          <Search size={14} className="text-stone/50 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={placeholder}
            className="flex-1 bg-transparent font-body text-[13px] text-forest placeholder:text-stone/40 focus:outline-none min-w-0"
          />
          {value && (
            <button
              onClick={clear}
              aria-label="Clear search"
              className="text-stone/40 hover:text-stone transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          )}
          {!alwaysOpen && (
            <button
              onClick={close}
              aria-label="Close search"
              className="text-stone/40 hover:text-stone transition-colors shrink-0 pl-1 border-l border-border ml-1"
            >
              <X size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

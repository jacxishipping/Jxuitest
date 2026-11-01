// @jxui/react v3.0.0 — JXAutocomplete (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useId } from 'react';
import { Search, X, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';
import { fuzzyScore } from '../../utils/jxuiLogic';

export interface JXAutocompleteOption {
  id: string;
  label: string;
  subtitle?: string;
  group?: string;
  shortcut?: string;
  avatarText?: string;
  disabled?: boolean;
  meta?: string;
}

export interface JXAutocompleteProps {
  options: JXAutocompleteOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  onChange?: (newValue: string | string[]) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  loading?: boolean;
  disabled?: boolean;
  fuzzyHighlight?: boolean;
  shortcut?: string;
  size?: 'sm' | 'md' | 'lg';
  glass?: boolean;
  halo?: boolean;
  clearable?: boolean;
  className?: string;
}

function renderHighlightedText(text: string, query: string, enabled: boolean) {
  if (!enabled || !query.trim()) return <>{text}</>;
  const q = query.trim();
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);
  return (
    <>
      {before}
      <mark className="bg-indigo-500/20 dark:bg-indigo-400/30 text-indigo-700 dark:text-indigo-200 rounded-xs px-0.5 font-semibold">
        {match}
      </mark>
      {after}
    </>
  );
}

export const JXAutocomplete: React.FC<JXAutocompleteProps> = ({
  options,
  value,
  defaultValue,
  multiple = false,
  onChange,
  label,
  placeholder = 'Search or jump to option...',
  helperText,
  error = false,
  errorMessage,
  loading = false,
  disabled = false,
  fuzzyHighlight = true,
  shortcut,
  size = 'md',
  glass = false,
  halo = true,
  clearable = true,
  className = '',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const inputId = useId();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState<string | string[]>(
    defaultValue !== undefined ? defaultValue : multiple ? [] : ''
  );
  const currentVal = isControlled ? value! : internalVal;

  const selectedArray: string[] = useMemo(() => {
    if (Array.isArray(currentVal)) return currentVal;
    return currentVal ? [currentVal] : [];
  }, [currentVal]);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    return options
      .map((opt) => {
        const s1 = fuzzyScore(opt.label, query);
        const s2 = opt.subtitle ? fuzzyScore(opt.subtitle, query) : 0;
        const s3 = opt.group ? fuzzyScore(opt.group, query) : 0;
        return { opt, score: Math.max(s1 * 1.2, s2, s3 * 0.9) };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.opt);
  }, [options, query]);

  const groupedOptions = useMemo(() => {
    const groups = new Map<string, JXAutocompleteOption[]>();
    for (const opt of filteredOptions) {
      const g = opt.group || 'Options';
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(opt);
    }
    return Array.from(groups.entries());
  }, [filteredOptions]);

  useEffect(() => {
    setActiveIndex(0);
  }, [filteredOptions.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const commitValue = (nextList: string[]) => {
    const next = multiple ? nextList : nextList[0] || '';
    if (!isControlled) setInternalVal(next);
    onChange?.(next);
  };

  const toggleOption = (opt: JXAutocompleteOption) => {
    if (opt.disabled || disabled) return;
    if (multiple) {
      const exists = selectedArray.includes(opt.id);
      const next = exists
        ? selectedArray.filter((id) => id !== opt.id)
        : [...selectedArray, opt.id];
      commitValue(next);
    } else {
      commitValue([opt.id]);
      setQuery(opt.label);
      setIsOpen(false);
    }
  };

  const removeTag = (idToRemove: string) => {
    if (disabled) return;
    commitValue(selectedArray.filter((id) => id !== idToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prev) =>
        filteredOptions.length > 0 ? (prev + 1) % filteredOptions.length : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prev) =>
        filteredOptions.length > 0
          ? (prev - 1 + filteredOptions.length) % filteredOptions.length
          : 0
      );
    } else if (e.key === 'Enter' && filteredOptions[activeIndex]) {
      e.preventDefault();
      toggleOption(filteredOptions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (
      e.key === 'Backspace' &&
      multiple &&
      !query &&
      selectedArray.length > 0
    ) {
      removeTag(selectedArray[selectedArray.length - 1]);
    }
  };

  const sizePadding =
    size === 'sm' ? 'p-1.5 text-xs' : size === 'lg' ? 'p-3 text-sm' : 'p-2 text-xs';

  return (
    <div ref={containerRef} className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
          {shortcut && (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
              {shortcut}
            </kbd>
          )}
        </div>
      )}

      <div
        className={`border transition-all jx-spring ${sizePadding} ${getRadiusClass('control')} ${
          glass
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'
            : 'bg-slate-50/90 dark:bg-slate-950/60'
        } ${
          error
            ? 'border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/20'
            : `border-slate-200 dark:border-slate-800 ${
                halo ? `focus-within:ring-3 ${palette.ring}` : ''
              }`
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {multiple &&
            selectedArray.map((id) => {
              const opt = options.find((o) => o.id === id);
              if (!opt) return null;
              return (
                <span
                  key={id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 jx-elevation-1 ${getRadiusClass('control')}`}
                >
                  <span>{opt.label}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(id)}
                    aria-label={`Remove ${opt.label}`}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

          <div className="flex-1 min-w-[160px] flex items-center gap-2 px-1">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-autocomplete="list"
              disabled={disabled}
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none py-1 text-xs"
            />
            {clearable && (query || (!multiple && selectedArray.length > 0)) && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  if (!multiple) commitValue([]);
                  inputRef.current?.focus();
                }}
                aria-label="Clear autocomplete input"
                className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              aria-label="Toggle options list"
              className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Grouped Combobox Options List */}
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable={multiple}
          className="border-t border-slate-200/70 dark:border-slate-800 mt-2 pt-2 max-h-52 overflow-y-auto space-y-2"
        >
          {loading ? (
            <div className="space-y-2 p-1.5" aria-busy="true" aria-label="Loading options">
              <div className="h-7 rounded-md jx-shimmer-wave" />
              <div className="h-7 rounded-md jx-shimmer-wave" />
              <div className="h-7 rounded-md jx-shimmer-wave" />
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400">
              No matching options for "{query}"
            </div>
          ) : (
            groupedOptions.map(([groupName, groupItems]) => (
              <div key={groupName} className="space-y-0.5">
                {groupedOptions.length > 1 && (
                  <div className="sticky top-0 z-10 px-2 py-1 text-[10px] font-mono font-semibold text-slate-400 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xs">
                    {groupName}
                  </div>
                )}
                {groupItems.map((opt) => {
                  const flatIdx = filteredOptions.findIndex((o) => o.id === opt.id);
                  const isSelected = selectedArray.includes(opt.id);
                  const isHighlighted = flatIdx === activeIndex;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={opt.disabled}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      onClick={() => toggleOption(opt)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs transition-colors ${getRadiusClass('control')} ${
                        isSelected
                          ? `${palette.softBg} text-slate-900 dark:text-white font-medium`
                          : isHighlighted
                          ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                      } ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${palette.bg}`}
                        >
                          {opt.avatarText || opt.label.charAt(0)}
                        </div>
                        <span className="truncate">
                          {renderHighlightedText(opt.label, query, fuzzyHighlight)}
                        </span>
                        {opt.subtitle && (
                          <>
                            <span aria-hidden="true" className="text-slate-400">
                              ·
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {renderHighlightedText(opt.subtitle, query, fuzzyHighlight)}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {opt.meta && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {opt.meta}
                          </span>
                        )}
                        {opt.shortcut && (
                          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">
                            {opt.shortcut}
                          </kbd>
                        )}
                        {isSelected && <Check className={`w-3.5 h-3.5 ${palette.text}`} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {(errorMessage || helperText) && (
        <p
          className={`text-[11px] ${
            error ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {error ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

// @jxui/react v3.0.0 — JXSelect (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXSelectOption {
  id: string;
  label: string;
  meta?: string;
  status?: 'Healthy' | 'Degraded' | 'Offline';
  disabled?: boolean;
}

export interface JXSelectProps {
  options: JXSelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  label?: string;
  placeholder?: string;
  searchable?: boolean;
  searchThreshold?: number;
  disabled?: boolean;
  className?: string;
}

export const JXSelect: React.FC<JXSelectProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  label,
  placeholder = 'Select an option...',
  searchable = true,
  searchThreshold = 5,
  disabled = false,
  className = '',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue || options[0]?.id || '');
  const currentVal = isControlled ? value! : internalVal;

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selectedOption = options.find((o) => o.id === currentVal);
  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(filter.toLowerCase())
  );

  const showSearch = searchable && options.length >= searchThreshold;

  return (
    <div ref={wrapperRef} className={`relative space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 focus-visible:outline-none focus-visible:ring-3 ${palette.ring} ${getRadiusClass('control')} ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <span className="truncate text-slate-900 dark:text-slate-100">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {selectedOption?.meta && (
            <span className="font-mono text-[11px] text-slate-400">
              {selectedOption.meta}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {open && (
        <div
          role="listbox"
          className={`mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 jx-elevation-2 space-y-1.5 ${getRadiusClass('control')}`}
        >
          {showSearch && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={`Filter ${options.length} options...`}
                aria-label="Filter select options"
                className="w-full text-xs bg-transparent focus:outline-none"
              />
            </div>
          )}

          <div className="max-h-44 overflow-y-auto space-y-0.5">
            {filteredOptions.map((opt) => {
              const isSelected = opt.id === currentVal;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  onClick={() => {
                    if (!isControlled) setInternalVal(opt.id);
                    onChange?.(opt.id);
                    setOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-md flex items-center justify-between gap-2 transition-colors ${
                    isSelected
                      ? `${palette.softBg} font-semibold text-slate-900 dark:text-white`
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {opt.meta && (
                      <span className="font-mono text-[11px] text-slate-400">
                        {opt.meta}
                      </span>
                    )}
                    {isSelected && <Check className={`w-3.5 h-3.5 ${palette.text}`} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

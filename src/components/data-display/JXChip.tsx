// @jxui/react v3.0.0 — JXChip (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXChipProps {
  label: string;
  tone?: 'neutral' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
  onDelete?: () => void;
  onClick?: () => void;
  filterOptions?: string[];
  onFilterSelect?: (opt: string) => void;
  disabled?: boolean;
  className?: string;
}

export const JXChip: React.FC<JXChipProps> = ({
  label,
  tone = 'neutral',
  onDelete,
  onClick,
  filterOptions,
  onFilterSelect,
  disabled = false,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toneStyles: Record<NonNullable<JXChipProps['tone']>, string> = {
    neutral:
      'bg-slate-100 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200',
    indigo:
      'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800/60 text-indigo-800 dark:text-indigo-200',
    emerald:
      'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200',
    amber:
      'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-200',
    rose:
      'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/60 text-rose-800 dark:text-rose-200',
    sky:
      'bg-sky-50/80 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/60 text-sky-800 dark:text-sky-200',
  };

  return (
    <div className="relative inline-block">
      <div
        onClick={() => {
          if (disabled) return;
          if (filterOptions && filterOptions.length > 0) {
            setDropdownOpen((o) => !o);
          }
          onClick?.();
        }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border transition-all whitespace-nowrap select-none ${
          toneStyles[tone]
        } ${getRadiusClass('control')} ${
          onClick || filterOptions ? 'cursor-pointer hover:opacity-90' : ''
        } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      >
        <span>{label}</span>
        {filterOptions && filterOptions.length > 0 && (
          <ChevronDown className="w-3 h-3 opacity-70" />
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label={`Remove ${label}`}
            className="p-0.5 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {dropdownOpen && filterOptions && (
        <div className="absolute left-0 top-8 z-20 w-40 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 jx-elevation-2 text-xs">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onFilterSelect?.(opt);
                setDropdownOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

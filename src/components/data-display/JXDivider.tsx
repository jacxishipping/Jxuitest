// @jxui/react v3.0.0 — JXDivider (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface JXDividerProps {
  variant?: 'radial-fade' | 'solid' | 'dashed';
  label?: string;
  actionLabel?: string;
  expanded?: boolean;
  onAction?: () => void;
  className?: string;
}

export const JXDivider: React.FC<JXDividerProps> = ({
  variant = 'radial-fade',
  label,
  actionLabel,
  expanded = false,
  onAction,
  className = '',
}) => {
  const lineClass =
    variant === 'radial-fade'
      ? 'w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent'
      : variant === 'dashed'
      ? 'w-full border-t border-dashed border-slate-200 dark:border-slate-800'
      : 'w-full h-px bg-slate-200 dark:bg-slate-800';

  return (
    <div className={`relative flex items-center justify-center my-3 ${className}`}>
      <div className={lineClass} role="separator" />
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          aria-expanded={expanded}
          className="absolute px-3 py-1 text-[11px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1 whitespace-nowrap"
        >
          <span>{actionLabel}</span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      ) : label ? (
        <span className="absolute px-2.5 py-0.5 text-[11px] font-mono bg-white dark:bg-slate-900 text-slate-500">
          {label}
        </span>
      ) : null}
    </div>
  );
};

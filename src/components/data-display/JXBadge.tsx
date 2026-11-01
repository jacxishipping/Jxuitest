// @jxui/react v3.0.0 — JXBadge (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { Bell } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXBadgeProps {
  count?: number;
  max?: number;
  statusText?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  showZero?: boolean;
  children?: React.ReactNode;
  showInteractiveControls?: boolean;
  onCountChange?: (nextCount: number) => void;
  className?: string;
}

export const JXBadge: React.FC<JXBadgeProps> = ({
  count = 14,
  max = 99,
  statusText,
  color = 'primary',
  showZero = false,
  children,
  showInteractiveControls = false,
  onCountChange,
  className = '',
}) => {
  const { palette } = useJXTheme();

  const colorClass =
    color === 'success'
      ? 'bg-emerald-600 text-white'
      : color === 'warning'
      ? 'bg-amber-500 text-white'
      : color === 'error'
      ? 'bg-rose-600 text-white'
      : `${palette.bg} text-white`;

  const displayValue =
    statusText !== undefined
      ? statusText
      : count > max
      ? `${max}+`
      : String(count);

  const visible = statusText !== undefined || count > 0 || showZero;

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="relative inline-flex items-center justify-center">
        {children || (
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 flex items-center justify-center">
            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </div>
        )}
        {visible && (
          <span
            aria-live="polite"
            className={`absolute -top-1.5 -right-1.5 px-2 py-0.5 text-[11px] font-mono font-bold rounded-full tabular-nums jx-elevation-1 transition-transform duration-200 jx-spring ${colorClass}`}
          >
            {displayValue}
          </span>
        )}
      </div>

      {showInteractiveControls && onCountChange && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCountChange(Math.max(0, count - 1))}
            className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            -1
          </button>
          <button
            type="button"
            onClick={() => onCountChange(count + 1)}
            className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
          >
            +1 Odometer
          </button>
        </div>
      )}
    </div>
  );
};

// @jxui/react v3.0.0 — CommandButton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Command } from 'lucide-react';

// 18. CommandButton
export interface CommandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  shortcut?: string;
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}
export const CommandButton: React.FC<CommandButtonProps> = ({
  label = 'Search Project',
  shortcut = '⌘K',
  variant = 'outline',
  tone = 'primary',
  className = '',
  onClick,
  ...props
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [triggered, setTriggered] = useState(false);

  const toneMap = {
    primary: {
      solid: `${palette.bg} text-white border-transparent`,
      soft: `${palette.softBg} ${palette.text} ${palette.border}`,
      outline: 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700',
      glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
    },
    success: {
      solid: 'bg-emerald-600 text-white border-transparent',
      soft: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      outline: 'bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500',
      glass: 'bg-emerald-500/15 backdrop-blur-md text-emerald-700 dark:text-emerald-200 border-emerald-400/40',
    },
    warning: {
      solid: 'bg-amber-500 text-white border-transparent',
      soft: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      outline: 'bg-transparent text-amber-600 dark:text-amber-400 border-amber-500',
      glass: 'bg-amber-500/15 backdrop-blur-md text-amber-700 dark:text-amber-200 border-amber-400/40',
    },
    danger: {
      solid: 'bg-rose-600 text-white border-transparent',
      soft: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      outline: 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500',
      glass: 'bg-rose-500/15 backdrop-blur-md text-rose-700 dark:text-rose-200 border-rose-400/40',
    },
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        setTriggered(true);
        setTimeout(() => setTriggered(false), 1200);
        onClick?.(e);
      }}
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium ${
        triggered
          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500'
          : toneMap[tone][variant]
      } border ${getRadiusClass('control')} shadow-xs active:scale-95 transition-all cursor-pointer ${className}`}
      {...props}
    >
      <Command className="w-3.5 h-3.5 opacity-80" />
      <span>{triggered ? 'Command Executed!' : label}</span>
      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-black/10 dark:bg-white/10 rounded">
        {shortcut}
      </kbd>
    </button>
  );
};

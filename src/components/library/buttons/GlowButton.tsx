// @jxui/react v3.0.0 — GlowButton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Flame } from 'lucide-react';

// 6. GlowButton
export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}
export const GlowButton: React.FC<GlowButtonProps> = ({
  children = 'Luminescent Glow',
  variant = 'solid',
  tone = 'primary',
  className = '',
  onClick,
  ...props
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [clicks, setClicks] = useState(0);

  const toneMap = {
    primary: {
      solid: `${palette.bg} text-white shadow-[0_0_20px_rgba(99,102,241,0.45)]`,
      soft: `${palette.softBg} ${palette.text} border ${palette.border} shadow-[0_0_16px_rgba(99,102,241,0.25)]`,
      outline: `bg-transparent ${palette.text} border-2 ${palette.border} shadow-[0_0_16px_rgba(99,102,241,0.3)]`,
      glass: 'bg-white/75 dark:bg-slate-800/75 backdrop-blur-md text-slate-900 dark:text-white border border-indigo-400/50 shadow-[0_0_18px_rgba(99,102,241,0.3)]',
    },
    success: {
      solid: 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.45)]',
      soft: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-[0_0_16px_rgba(16,185,129,0.25)]',
      outline: 'bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.3)]',
      glass: 'bg-emerald-500/15 backdrop-blur-md text-emerald-700 dark:text-emerald-200 border border-emerald-400/50 shadow-[0_0_18px_rgba(16,185,129,0.3)]',
    },
    warning: {
      solid: 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.45)]',
      soft: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-[0_0_16px_rgba(245,158,11,0.25)]',
      outline: 'bg-transparent text-amber-600 dark:text-amber-400 border-2 border-amber-500 shadow-[0_0_16px_rgba(245,158,11,0.3)]',
      glass: 'bg-amber-500/15 backdrop-blur-md text-amber-700 dark:text-amber-200 border border-amber-400/50 shadow-[0_0_18px_rgba(245,158,11,0.3)]',
    },
    danger: {
      solid: 'bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.45)]',
      soft: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-[0_0_16px_rgba(244,63,94,0.25)]',
      outline: 'bg-transparent text-rose-600 dark:text-rose-400 border-2 border-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.3)]',
      glass: 'bg-rose-500/15 backdrop-blur-md text-rose-700 dark:text-rose-200 border border-rose-400/50 shadow-[0_0_18px_rgba(244,63,94,0.3)]',
    },
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        setClicks((c) => c + 1);
        onClick?.(e);
      }}
      className={`relative group px-4 py-2 text-xs font-semibold ${toneMap[tone][variant]} ${getRadiusClass('control')} cursor-pointer transition-all duration-300 active:scale-95 inline-flex items-center gap-1.5 ${className}`}
      {...props}
    >
      <Flame className="w-3.5 h-3.5" />
      <span>{children}</span>
      {clicks > 0 && (
        <span className="px-1.5 py-0.2 rounded-full bg-black/15 dark:bg-white/20 text-[10px] font-mono">
          {clicks}x
        </span>
      )}
    </button>
  );
};

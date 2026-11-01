// @jxui/react v3.0.0 — GradientButton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles } from 'lucide-react';

// 7. GradientButton
export interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}
export const GradientButton: React.FC<GradientButtonProps> = ({
  children = 'Gradient Aura',
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
      solid: `text-white bg-gradient-to-r ${palette.gradient}`,
      soft: `${palette.softBg} ${palette.text} border ${palette.border}`,
      outline: `bg-transparent ${palette.text} border-2 ${palette.border}`,
      glass: 'bg-white/75 dark:bg-slate-800/75 backdrop-blur-md text-slate-900 dark:text-white border border-indigo-400/40',
    },
    success: {
      solid: 'text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600',
      soft: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
      outline: 'bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500',
      glass: 'bg-emerald-500/15 backdrop-blur-md text-emerald-700 dark:text-emerald-200 border border-emerald-400/40',
    },
    warning: {
      solid: 'text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500',
      soft: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
      outline: 'bg-transparent text-amber-600 dark:text-amber-400 border-2 border-amber-500',
      glass: 'bg-amber-500/15 backdrop-blur-md text-amber-700 dark:text-amber-200 border border-amber-400/40',
    },
    danger: {
      solid: 'text-white bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600',
      soft: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
      outline: 'bg-transparent text-rose-600 dark:text-rose-400 border-2 border-rose-500',
      glass: 'bg-rose-500/15 backdrop-blur-md text-rose-700 dark:text-rose-200 border border-rose-400/40',
    },
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        setClicks((c) => c + 1);
        onClick?.(e);
      }}
      className={`px-4 py-2 text-xs font-bold ${toneMap[tone][variant]} ${getRadiusClass('control')} shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 ${className}`}
      {...props}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>{children}</span>
      {clicks > 0 && (
        <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
          {clicks}x
        </span>
      )}
    </button>
  );
};

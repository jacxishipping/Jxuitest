// @jxui/react v3.0.0 — MagneticIconButton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, Check } from 'lucide-react';

// 10. MagneticIconButton
export interface MagneticIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}
export const MagneticIconButton: React.FC<MagneticIconButtonProps> = ({
  icon: Icon = Sparkles,
  variant = 'solid',
  tone = 'primary',
  className = '',
  onClick,
  ...props
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [active, setActive] = useState(false);

  const toneMap = {
    primary: {
      solid: `${palette.bg} text-white`,
      soft: `${palette.softBg} ${palette.text} border ${palette.border}`,
      outline: `bg-transparent ${palette.text} border-2 ${palette.border}`,
      glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
    },
    success: {
      solid: 'bg-emerald-600 text-white',
      soft: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
      outline: 'bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500',
      glass: 'bg-emerald-500/15 backdrop-blur-md text-emerald-700 dark:text-emerald-200 border border-emerald-400/40',
    },
    warning: {
      solid: 'bg-amber-500 text-white',
      soft: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
      outline: 'bg-transparent text-amber-600 dark:text-amber-400 border-2 border-amber-500',
      glass: 'bg-amber-500/15 backdrop-blur-md text-amber-700 dark:text-amber-200 border border-amber-400/40',
    },
    danger: {
      solid: 'bg-rose-600 text-white',
      soft: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
      outline: 'bg-transparent text-rose-600 dark:text-rose-400 border-2 border-rose-500',
      glass: 'bg-rose-500/15 backdrop-blur-md text-rose-700 dark:text-rose-200 border border-rose-400/40',
    },
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        aria-label="Magnetic icon action"
        onClick={(e) => {
          setActive((a) => !a);
          onClick?.(e);
        }}
        className={`w-10 h-10 flex items-center justify-center ${
          active ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20' : toneMap[tone][variant]
        } ${getRadiusClass('pill')} shadow-md hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer ${className}`}
        {...props}
      >
        {active ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </button>
      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
        {active ? 'Pinned' : 'Click icon'}
      </span>
    </div>
  );
};

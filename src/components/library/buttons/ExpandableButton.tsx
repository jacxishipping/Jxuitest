// @jxui/react v3.0.0 — ExpandableButton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Plus, Check } from 'lucide-react';

// 13. ExpandableButton
export interface ExpandableButtonProps {
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  onClick?: () => void;
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}

export const ExpandableButton: React.FC<ExpandableButtonProps> = ({
  icon: Icon = Plus,
  label = 'Create New Project',
  onClick,
  variant = 'solid',
  tone = 'primary',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [expanded, setExpanded] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);

  const toneMap = {
    primary: {
      solid: `${palette.bg} text-white`,
      soft: `${palette.softBg} ${palette.text} border ${palette.border}`,
      outline: `bg-transparent border-2 ${palette.border} ${palette.text}`,
      glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
    },
    success: {
      solid: 'bg-emerald-600 text-white',
      soft: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
      outline: 'bg-transparent border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400',
      glass: 'bg-emerald-500/15 backdrop-blur-md border border-emerald-400/40 text-emerald-700 dark:text-emerald-200',
    },
    warning: {
      solid: 'bg-amber-500 text-white',
      soft: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
      outline: 'bg-transparent border-2 border-amber-500 text-amber-600 dark:text-amber-400',
      glass: 'bg-amber-500/15 backdrop-blur-md border border-amber-400/40 text-amber-700 dark:text-amber-200',
    },
    danger: {
      solid: 'bg-rose-600 text-white',
      soft: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
      outline: 'bg-transparent border-2 border-rose-500 text-rose-600 dark:text-rose-400',
      glass: 'bg-rose-500/15 backdrop-blur-md border border-rose-400/40 text-rose-700 dark:text-rose-200',
    },
  };

  const handleClick = () => {
    setExpanded((prev) => !prev);
    setCreatedCount((c) => c + 1);
    onClick?.();
  };

  return (
    <button
      type="button"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      onClick={handleClick}
      className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold ${toneMap[tone][variant]} ${getRadiusClass('pill')} shadow-md transition-all duration-300 cursor-pointer overflow-hidden`}
    >
      {createdCount > 0 ? <Check className="w-4 h-4 shrink-0" /> : <Icon className="w-4 h-4 shrink-0" />}
      <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${expanded || createdCount > 0 ? 'max-w-xs opacity-100 pr-1' : 'max-w-0 opacity-0'}`}>
        {createdCount > 0 ? `${label} (${createdCount})` : label}
      </span>
    </button>
  );
};

// @jxui/react v3.0.0 — SplitButton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { ChevronDown, Check } from 'lucide-react';

// 16. SplitButton
export interface SplitButtonProps {
  label?: string;
  options?: string[];
  onPrimaryClick?: () => void;
  onSelectOption?: (opt: string) => void;
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}

export const SplitButton: React.FC<SplitButtonProps> = ({
  label = 'Commit Changes',
  options = ['Commit & Push', 'Commit to New Branch', 'Save Stash'],
  onPrimaryClick,
  onSelectOption,
  variant = 'solid',
  tone = 'primary',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(label);
  const [executedCount, setExecutedCount] = useState(0);

  const toneMap = {
    primary: {
      solid: `${palette.bg} text-white`,
      soft: `${palette.softBg} ${palette.text} border ${palette.border}`,
      outline: `bg-transparent border ${palette.border} ${palette.text}`,
      glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
    },
    success: {
      solid: 'bg-emerald-600 text-white',
      soft: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
      outline: 'bg-transparent border border-emerald-500 text-emerald-600 dark:text-emerald-400',
      glass: 'bg-emerald-500/15 backdrop-blur-md border border-emerald-400/40 text-emerald-700 dark:text-emerald-200',
    },
    warning: {
      solid: 'bg-amber-500 text-white',
      soft: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
      outline: 'bg-transparent border border-amber-500 text-amber-600 dark:text-amber-400',
      glass: 'bg-amber-500/15 backdrop-blur-md border border-amber-400/40 text-amber-700 dark:text-amber-200',
    },
    danger: {
      solid: 'bg-rose-600 text-white',
      soft: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
      outline: 'bg-transparent border border-rose-500 text-rose-600 dark:text-rose-400',
      glass: 'bg-rose-500/15 backdrop-blur-md border border-rose-400/40 text-rose-700 dark:text-rose-200',
    },
  };

  return (
    <div className="relative inline-flex rounded-lg shadow-sm">
      <button
        type="button"
        onClick={() => {
          setExecutedCount((c) => c + 1);
          onPrimaryClick?.();
        }}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold ${toneMap[tone][variant]} rounded-l-lg border-r border-white/20 hover:brightness-105 active:scale-98 transition-all cursor-pointer`}
      >
        {executedCount > 0 && <Check className="w-3.5 h-3.5" />}
        <span>{selectedLabel}</span>
        {executedCount > 0 && <span className="font-mono text-[10px] opacity-80">×{executedCount}</span>}
      </button>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`px-2 py-2 ${toneMap[tone][variant]} rounded-r-lg hover:brightness-105 active:scale-98 transition-all cursor-pointer`}
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`absolute top-full mt-1.5 right-0 z-30 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl ${getRadiusClass('control')} py-1`}>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setSelectedLabel(opt);
                onSelectOption?.(opt);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <span>{opt}</span>
              {selectedLabel === opt && <Check className="w-3.5 h-3.5 text-indigo-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

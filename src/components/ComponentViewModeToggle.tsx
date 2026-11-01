import React from 'react';
import { Eye, Layers, Sparkles } from 'lucide-react';
import { useJXTheme, ComponentViewMode } from '../context/JXThemeContext';

export interface ComponentViewModeToggleProps {
  mode?: ComponentViewMode;
  onChange?: (mode: ComponentViewMode) => void;
  size?: 'sm' | 'md';
  className?: string;
  showBadge?: boolean;
}

export const ComponentViewModeToggle: React.FC<ComponentViewModeToggleProps> = ({
  mode: propMode,
  onChange: propOnChange,
  size = 'md',
  className = '',
  showBadge = true,
}) => {
  const { componentViewMode, setComponentViewMode, pushToast } = useJXTheme();

  const activeMode = propMode !== undefined ? propMode : componentViewMode;

  const handleSelect = (nextMode: ComponentViewMode) => {
    if (activeMode === nextMode) return;

    if (propOnChange) {
      propOnChange(nextMode);
    } else {
      setComponentViewMode(nextMode);
      pushToast({
        title: nextMode === 'anatomy' ? 'Code Anatomy Mode Active' : 'Preview Mode Active',
        description:
          nextMode === 'anatomy'
            ? 'Highlighting accessibility roles, keyboard contracts, and DOM slot boundaries.'
            : 'Rendering standard interactive component previews.',
        variant: nextMode === 'anatomy' ? 'default' : 'success',
      });
    }
  };

  const isMd = size === 'md';

  return (
    <div
      role="radiogroup"
      aria-label="Component Display View Mode"
      className={`inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-850 p-1 border border-slate-200/80 dark:border-slate-800 shadow-2xs ${className}`}
    >
      {/* Preview Mode Option */}
      <button
        type="button"
        role="radio"
        aria-checked={activeMode === 'preview'}
        onClick={() => handleSelect('preview')}
        className={`inline-flex items-center gap-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap select-none ${
          isMd ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-[11px]'
        } ${
          activeMode === 'preview'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold border border-slate-200/60 dark:border-slate-700/60'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Preview Mode: Clean interactive component rendering"
      >
        <Eye className={`shrink-0 ${isMd ? 'w-3.5 h-3.5' : 'w-3 h-3'} ${
          activeMode === 'preview' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
        }`} />
        <span>Preview Mode</span>
      </button>

      {/* Code Anatomy Mode Option */}
      <button
        type="button"
        role="radio"
        aria-checked={activeMode === 'anatomy'}
        onClick={() => handleSelect('anatomy')}
        className={`inline-flex items-center gap-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap select-none ${
          isMd ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-[11px]'
        } ${
          activeMode === 'anatomy'
            ? 'bg-indigo-600 text-white shadow-xs font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Code Anatomy Mode: Highlights accessibility roles, contracts, and DOM slot boundaries"
      >
        <Layers className={`shrink-0 ${isMd ? 'w-3.5 h-3.5' : 'w-3 h-3'} ${
          activeMode === 'anatomy' ? 'text-white' : 'text-slate-400'
        }`} />
        <span>Code Anatomy Mode</span>
        {showBadge && (
          <span
            className={`font-mono text-[9px] px-1 py-0.2 rounded font-bold uppercase tracking-wider ${
              activeMode === 'anatomy'
                ? 'bg-white/25 text-white'
                : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
            }`}
          >
            A11y
          </span>
        )}
      </button>
    </div>
  );
};

// @jxui/react v3.0.0 — JXPaper (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../context/JXThemeContext';

export type JXSurfaceTier = 'base' | 'raised' | 'overlay' | 'glass' | 'sunken';

export interface JXPaperProps {
  surface?: JXSurfaceTier;
  defaultSurface?: JXSurfaceTier;
  onSurfaceChange?: (surface: JXSurfaceTier) => void;
  showTierSwitcher?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const JXPaper: React.FC<JXPaperProps> = ({
  surface,
  defaultSurface = 'glass',
  onSurfaceChange,
  showTierSwitcher = true,
  children,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const isControlled = surface !== undefined;
  const [internalTier, setInternalTier] = useState<JXSurfaceTier>(defaultSurface);
  const currentTier = isControlled ? surface! : internalTier;

  const selectTier = (t: JXSurfaceTier) => {
    if (!isControlled) setInternalTier(t);
    onSurfaceChange?.(t);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {showTierSwitcher && (
        <div className="flex flex-wrap gap-1.5">
          {(['base', 'raised', 'overlay', 'glass', 'sunken'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => selectTier(t)}
              className={`px-2.5 py-1 text-xs font-mono rounded capitalize transition-colors ${
                currentTier === t
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div
        className={`p-4 border text-xs transition-all ${getRadiusClass('control')} ${
          currentTier === 'sunken'
            ? 'bg-slate-100 dark:bg-slate-950 border-slate-200/70 dark:border-slate-800 shadow-inner'
            : currentTier === 'glass'
            ? 'bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-slate-200/80 dark:border-slate-700 jx-elevation-2'
            : currentTier === 'overlay'
            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 jx-elevation-3'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 jx-elevation-1'
        }`}
      >
        {children || (
          <>
            Active semantic surface token:{' '}
            <strong className="font-mono">surface="{currentTier}"</strong>
          </>
        )}
      </div>
    </div>
  );
};

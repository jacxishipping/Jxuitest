// @jxui/react v3.0.0 — JXSkeleton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';

export type JXSkeletonPreset = 'card' | 'table-row' | 'profile' | 'chart';

export interface JXSkeletonProps {
  preset?: JXSkeletonPreset;
  defaultPreset?: JXSkeletonPreset;
  onPresetChange?: (preset: JXSkeletonPreset) => void;
  showPresetSwitcher?: boolean;
  className?: string;
}

export const JXSkeleton: React.FC<JXSkeletonProps> = ({
  preset,
  defaultPreset = 'card',
  onPresetChange,
  showPresetSwitcher = true,
  className = '',
}) => {
  const isControlled = preset !== undefined;
  const [internalPreset, setInternalPreset] = useState<JXSkeletonPreset>(defaultPreset);
  const currentPreset = isControlled ? preset! : internalPreset;

  const selectPreset = (p: JXSkeletonPreset) => {
    if (!isControlled) setInternalPreset(p);
    onPresetChange?.(p);
  };

  return (
    <div className={`space-y-3 ${className}`} aria-busy="true">
      {showPresetSwitcher && (
        <div className="flex items-center gap-1">
          {(['card', 'table-row', 'profile'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => selectPreset(p)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                currentPreset === p
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {currentPreset === 'card' && (
        <div className="space-y-2 p-2.5 border border-slate-200/70 dark:border-slate-800 rounded-xl">
          <div className="h-8 w-full rounded-lg jx-shimmer-wave" />
          <div className="h-3 w-2/3 rounded jx-shimmer-wave" />
        </div>
      )}

      {currentPreset === 'table-row' && (
        <div className="space-y-2">
          <div className="h-5 w-full rounded jx-shimmer-wave" />
          <div className="h-5 w-full rounded jx-shimmer-wave" />
        </div>
      )}

      {currentPreset === 'profile' && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl jx-shimmer-wave shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/2 rounded jx-shimmer-wave" />
            <div className="h-3 w-3/4 rounded jx-shimmer-wave" />
          </div>
        </div>
      )}

      {currentPreset === 'chart' && (
        <div className="flex items-end gap-2 h-20 p-2 border border-slate-200/70 dark:border-slate-800 rounded-xl">
          <div className="flex-1 h-1/2 rounded jx-shimmer-wave" />
          <div className="flex-1 h-4/5 rounded jx-shimmer-wave" />
          <div className="flex-1 h-2/3 rounded jx-shimmer-wave" />
          <div className="flex-1 h-full rounded jx-shimmer-wave" />
        </div>
      )}
    </div>
  );
};

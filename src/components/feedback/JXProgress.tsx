// @jxui/react v3.0.0 — JXProgress (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXProgressProps {
  value?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
  label?: string;
  completeLabel?: string;
  eta?: string;
  showControls?: boolean;
  className?: string;
}

export const JXProgress: React.FC<JXProgressProps> = ({
  value,
  defaultValue = 72,
  onChange,
  label = 'Compiling Edge Bundles...',
  completeLabel = 'Build Complete',
  eta = 'ETA ~4s remaining',
  showControls = true,
  className = '',
}) => {
  const { palette } = useJXTheme();
  const isControlled = value !== undefined;
  const [internalVal, setInternalVal] = useState(defaultValue);
  const currentVal = isControlled ? value! : internalVal;

  const commit = (v: number) => {
    const clamped = Math.min(100, Math.max(0, v));
    if (!isControlled) setInternalVal(clamped);
    onChange?.(clamped);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {currentVal >= 100 ? completeLabel : label}
        </span>
        <span className="font-mono font-bold tabular-nums">{currentVal}%</span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={currentVal}
        className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
      >
        <div
          style={{ width: `${currentVal}%` }}
          className={`h-full transition-all duration-300 ${
            currentVal >= 100 ? 'bg-emerald-500' : palette.bg
          }`}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400">
          {currentVal >= 100 ? '0s remaining · Verified' : eta}
        </span>
        {showControls && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => commit(65)}
              className="px-2 py-0.5 text-[11px] font-mono rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              65%
            </button>
            <button
              type="button"
              onClick={() => commit(100)}
              className="px-2 py-0.5 text-[11px] font-mono rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              100% Morph
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const JXLinearProgress = JXProgress;
export const JXCircularProgress = JXProgress;

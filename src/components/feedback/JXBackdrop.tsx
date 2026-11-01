// @jxui/react v3.0.0 — JXBackdrop (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXBackdropProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  triggerLabel?: string;
  blur?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const JXBackdrop: React.FC<JXBackdropProps> = ({
  open,
  defaultOpen = false,
  onOpenChange,
  label = 'Synchronizing Edge Snapshots (Click anywhere to dismiss)',
  triggerLabel = 'Activate Frosted Glass Scrim',
  blur = 'md',
  className = '',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isActive = isControlled ? open! : internalOpen;

  const setOpenState = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const blurClass =
    blur === 'sm'
      ? 'backdrop-blur-xs'
      : blur === 'lg'
      ? 'backdrop-blur-lg'
      : 'backdrop-blur-md';

  return (
    <div
      className={`relative h-40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 flex flex-col justify-between ${className}`}
    >
      <div className="text-xs text-slate-600 dark:text-slate-400">
        Underlying Workspace Surface · Click button below to test progressive frosted glass scrim (`backdrop-filter: blur(8px)`).
      </div>
      <button
        type="button"
        onClick={() => setOpenState(true)}
        className={`self-start px-3.5 py-2 text-xs font-semibold text-white ${palette.bg} ${getRadiusClass('control')}`}
      >
        {triggerLabel}
      </button>

      {isActive && (
        <div
          onClick={() => setOpenState(false)}
          className={`absolute inset-0 bg-slate-900/35 ${blurClass} flex flex-col items-center justify-center gap-2 text-white cursor-pointer transition-opacity`}
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-semibold">{label}</span>
        </div>
      )}
    </div>
  );
};

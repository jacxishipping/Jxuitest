// @jxui/react v3.0.0 — HoldToConfirmButton (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Trash2, Check, RotateCcw } from 'lucide-react';

// 11. HoldToConfirmButton
export interface HoldToConfirmButtonProps {
  label?: string;
  onConfirm?: () => void;
  holdDurationMs?: number;
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}

export const HoldToConfirmButton: React.FC<HoldToConfirmButtonProps> = ({
  label = 'Hold to Delete',
  onConfirm,
  holdDurationMs = 900,
  variant = 'soft',
  tone = 'danger',
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleStart = () => {
    if (confirmed) {
      setConfirmed(false);
      return;
    }
    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / holdDurationMs) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current!);
        setConfirmed(true);
        onConfirm?.();
        setProgress(0);
        startTimeRef.current = null;
      }
    }, 20);
  };

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
    startTimeRef.current = null;
  };

  const toneStyles = {
    primary: variant === 'solid' ? `${palette.bg} text-white border-transparent` : `${palette.softBg} ${palette.text} ${palette.border}`,
    success: variant === 'solid' ? 'bg-emerald-600 text-white border-transparent' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    warning: variant === 'solid' ? 'bg-amber-500 text-white border-transparent' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    danger: variant === 'solid' ? 'bg-rose-600 text-white border-transparent' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800',
  };

  return (
    <button
      type="button"
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      className={`relative overflow-hidden px-4 py-2 text-xs font-semibold border ${
        confirmed
          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
          : toneStyles[tone]
      } ${getRadiusClass('control')} cursor-pointer select-none active:scale-98 transition-all`}
    >
      <div
        className="absolute inset-y-0 left-0 bg-rose-500/25 dark:bg-rose-500/35 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
      <div className="relative z-10 flex items-center gap-2">
        {confirmed ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Confirmed! Click to Reset</span>
            <RotateCcw className="w-3 h-3 opacity-70" />
          </>
        ) : (
          <>
            <Trash2 className="w-3.5 h-3.5" />
            <span>{label}</span>
            {progress > 0 && <span className="font-mono text-[10px]">{Math.round(progress)}%</span>}
          </>
        )}
      </div>
    </button>
  );
};

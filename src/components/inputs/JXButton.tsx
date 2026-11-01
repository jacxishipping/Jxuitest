// @jxui/react v3.0.0 — JXButton (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export type JXButtonMorphState = 'idle' | 'loading' | 'success' | 'error';

export interface JXButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'soft' | 'outlined' | 'text' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  loading?: boolean;
  morphState?: JXButtonMorphState;
  morphSuccess?: boolean;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  lockWidth?: boolean;
  spring?: boolean;
  halo?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const JXButton: React.FC<JXButtonProps> = ({
  children,
  variant = 'contained',
  size = 'md',
  color = 'primary',
  disabled = false,
  loading = false,
  morphState,
  morphSuccess = false,
  loadingLabel = 'Processing...',
  successLabel = 'Completed (0ms Shift)',
  errorLabel = 'Verification Failed',
  lockWidth = true,
  spring = true,
  halo = true,
  startIcon,
  endIcon,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
  ...rest
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [lockedMinWidth, setLockedMinWidth] = useState<number | undefined>(undefined);
  const [internalMorph, setInternalMorph] = useState<JXButtonMorphState>('idle');

  const activeState: JXButtonMorphState =
    morphState !== undefined
      ? morphState
      : loading
      ? 'loading'
      : internalMorph;

  useEffect(() => {
    if (lockWidth && activeState === 'idle' && buttonRef.current) {
      setLockedMinWidth(buttonRef.current.offsetWidth);
    }
  }, [activeState, lockWidth, children, size]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || activeState === 'loading') return;

    if (morphSuccess && morphState === undefined) {
      if (buttonRef.current && lockWidth) {
        setLockedMinWidth(buttonRef.current.offsetWidth);
      }
      setInternalMorph('loading');
      try {
        await Promise.resolve(onClick?.(e));
        setInternalMorph('success');
      } catch {
        setInternalMorph('error');
      } finally {
        setTimeout(() => setInternalMorph('idle'), 1800);
      }
      return;
    }

    onClick?.(e);
  };

  const sizeClasses =
    size === 'sm'
      ? 'h-8 px-3 text-xs gap-1.5'
      : size === 'lg'
      ? 'h-11 px-6 text-sm gap-2.5'
      : 'h-10 px-4.5 text-xs gap-2';

  const getVariantColorClasses = () => {
    if (activeState === 'success') {
      return 'bg-emerald-600 text-white border-transparent jx-elevation-2';
    }
    if (activeState === 'error') {
      return 'bg-rose-600 text-white border-transparent jx-animate-shake jx-elevation-2';
    }

    if (variant === 'contained') {
      switch (color) {
        case 'success':
          return 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent jx-elevation-2';
        case 'warning':
          return 'bg-amber-500 hover:bg-amber-400 text-white border-transparent jx-elevation-2';
        case 'error':
          return 'bg-rose-600 hover:bg-rose-500 text-white border-transparent jx-elevation-2';
        case 'neutral':
        case 'secondary':
          return 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 border-transparent jx-elevation-1';
        default:
          return `${palette.bg} ${palette.bgHover} text-white border-transparent jx-elevation-2`;
      }
    }

    if (variant === 'soft') {
      switch (color) {
        case 'success':
          return 'bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/80';
        case 'warning':
          return 'bg-amber-50/90 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100/80';
        case 'error':
          return 'bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100/80';
        case 'neutral':
        case 'secondary':
          return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200/80';
        default:
          return `${palette.softBg} ${palette.text} ${palette.border} hover:opacity-90`;
      }
    }

    if (variant === 'outlined') {
      switch (color) {
        case 'success':
          return 'bg-transparent border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40';
        case 'warning':
          return 'bg-transparent border-amber-400 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40';
        case 'error':
          return 'bg-transparent border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40';
        case 'neutral':
        case 'secondary':
          return 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 jx-elevation-1';
        default:
          return `bg-white dark:bg-slate-900 ${palette.border} ${palette.text} hover:bg-slate-50 dark:hover:bg-slate-800 jx-elevation-1`;
      }
    }

    if (variant === 'glass') {
      switch (color) {
        case 'success':
          return 'bg-emerald-500/15 backdrop-blur-md border-emerald-400/40 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-500/25 jx-elevation-2';
        case 'warning':
          return 'bg-amber-500/15 backdrop-blur-md border-amber-400/40 text-amber-700 dark:text-amber-200 hover:bg-amber-500/25 jx-elevation-2';
        case 'error':
          return 'bg-rose-500/15 backdrop-blur-md border-rose-400/40 text-rose-700 dark:text-rose-200 hover:bg-rose-500/25 jx-elevation-2';
        default:
          return 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 jx-elevation-2';
      }
    }

    switch (color) {
      case 'success':
        return 'bg-transparent border-transparent text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40';
      case 'warning':
        return 'bg-transparent border-transparent text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40';
      case 'error':
        return 'bg-transparent border-transparent text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40';
      default:
        return 'bg-transparent border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
    }
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled || activeState === 'loading'}
      onClick={handleClick}
      style={
        lockWidth && lockedMinWidth
          ? { minWidth: `${Math.max(lockedMinWidth, 180)}px` }
          : undefined
      }
      className={`relative inline-flex items-center justify-center font-semibold border transition-all duration-200 whitespace-nowrap shrink-0 select-none ${sizeClasses} ${getRadiusClass('control')} ${getVariantColorClasses()} ${
        spring ? 'jx-spring active:scale-[0.98]' : ''
      } ${halo ? `focus-visible:outline-none focus-visible:ring-3 ${palette.ring}` : ''} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      {...rest}
    >
      {activeState === 'idle' && (
        <>
          {startIcon && <span className="shrink-0">{startIcon}</span>}
          <span>{children}</span>
          {endIcon && <span className="shrink-0">{endIcon}</span>}
        </>
      )}
      {activeState === 'loading' && (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{loadingLabel}</span>
        </>
      )}
      {activeState === 'success' && (
        <>
          <Check className="w-4 h-4 shrink-0" />
          <span>{successLabel}</span>
        </>
      )}
      {activeState === 'error' && (
        <>
          <X className="w-4 h-4 shrink-0" />
          <span>{errorLabel}</span>
        </>
      )}
    </button>
  );
};

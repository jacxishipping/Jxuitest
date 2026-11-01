// @jxui/react v3.0.0 — MorphButton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, Check, Loader2, X } from 'lucide-react';

// 3. MorphButton (Zero-shift 3-state morphing: idle -> loading -> success)
export interface MorphButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status?: 'idle' | 'loading' | 'success' | 'error';
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  idleText?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  onTrigger?: () => void;
}
export const MorphButton: React.FC<MorphButtonProps> = ({
  status,
  variant = 'solid',
  tone = 'primary',
  idleText = 'Deploy Changes',
  loadingText = 'Deploying...',
  successText = 'Deployed!',
  errorText = 'Failed — Retry',
  onTrigger,
  onClick,
  className = '',
  ...props
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [internalStatus, setInternalStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const currentStatus = status ?? internalStatus;

  const toneMap = {
    primary: {
      solid: `${palette.bg} text-white border-transparent shadow-md`,
      soft: `${palette.softBg} ${palette.text} border ${palette.border}`,
      outline: `bg-transparent ${palette.text} border-2 ${palette.border}`,
      glass: 'bg-white/75 dark:bg-slate-800/75 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 shadow-sm',
    },
    success: {
      solid: 'bg-emerald-600 text-white border-transparent shadow-md',
      soft: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
      outline: 'bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500',
      glass: 'bg-emerald-500/15 backdrop-blur-md text-emerald-700 dark:text-emerald-200 border border-emerald-400/40',
    },
    warning: {
      solid: 'bg-amber-500 text-white border-transparent shadow-md',
      soft: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
      outline: 'bg-transparent text-amber-600 dark:text-amber-400 border-2 border-amber-500',
      glass: 'bg-amber-500/15 backdrop-blur-md text-amber-700 dark:text-amber-200 border border-amber-400/40',
    },
    danger: {
      solid: 'bg-rose-600 text-white border-transparent shadow-md',
      soft: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
      outline: 'bg-transparent text-rose-600 dark:text-rose-400 border-2 border-rose-500',
      glass: 'bg-rose-500/15 backdrop-blur-md text-rose-700 dark:text-rose-200 border border-rose-400/40',
    },
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onTrigger?.();
    if (status === undefined && internalStatus === 'idle') {
      setInternalStatus('loading');
      setTimeout(() => {
        setInternalStatus(tone === 'danger' ? 'error' : 'success');
        setTimeout(() => setInternalStatus('idle'), 1600);
      }, 650);
    }
  };

  const getVariantStyle = () => {
    if (currentStatus === 'success') {
      return 'bg-emerald-600 text-white border-transparent shadow-md shadow-emerald-500/20';
    }
    if (currentStatus === 'error') {
      return 'bg-rose-600 text-white border-transparent shadow-md shadow-rose-500/20';
    }
    return toneMap[tone][variant];
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={currentStatus === 'loading'}
      className={`relative min-w-[148px] px-4 py-2 text-xs font-semibold transition-all duration-300 ${getRadiusClass('control')} cursor-pointer active:scale-95 ${getVariantStyle()} ${className}`}
      {...props}
    >
      <div className="flex items-center justify-center gap-2 min-h-[20px]">
        {currentStatus === 'idle' && (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{idleText}</span>
          </>
        )}
        {currentStatus === 'loading' && (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{loadingText}</span>
          </>
        )}
        {currentStatus === 'success' && (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>{successText}</span>
          </>
        )}
        {currentStatus === 'error' && (
          <>
            <X className="w-3.5 h-3.5" />
            <span>{errorText}</span>
          </>
        )}
      </div>
    </button>
  );
};

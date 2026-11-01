// @jxui/react v3.0.0 — ParticleButton (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles } from 'lucide-react';

// 9. ParticleButton
export interface ParticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}

export const ParticleButton: React.FC<ParticleButtonProps> = ({
  children = 'Particle Burst',
  className = '',
  variant = 'solid',
  tone = 'primary',
  onClick,
  ...props
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [burst, setBurst] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  const toneMap = {
    primary: {
      solid: `${palette.bg} text-white border-transparent`,
      soft: `${palette.softBg} ${palette.text} ${palette.border}`,
      outline: `bg-transparent border-2 ${palette.border} ${palette.text}`,
      glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
    },
    success: {
      solid: 'bg-emerald-600 text-white border-transparent',
      soft: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      outline: 'bg-transparent border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400',
      glass: 'bg-emerald-500/15 backdrop-blur-md border-emerald-400/40 text-emerald-700 dark:text-emerald-200',
    },
    warning: {
      solid: 'bg-amber-500 text-white border-transparent',
      soft: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      outline: 'bg-transparent border-2 border-amber-500 text-amber-600 dark:text-amber-400',
      glass: 'bg-amber-500/15 backdrop-blur-md border-amber-400/40 text-amber-700 dark:text-amber-200',
    },
    danger: {
      solid: 'bg-rose-600 text-white border-transparent',
      soft: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      outline: 'bg-transparent border-2 border-rose-500 text-rose-600 dark:text-rose-400',
      glass: 'bg-rose-500/15 backdrop-blur-md border-rose-400/40 text-rose-700 dark:text-rose-200',
    },
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setBurst(true);
    setBurstCount((c) => c + 1);
    setTimeout(() => setBurst(false), 700);
    onClick?.(e);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold border ${toneMap[tone][variant]} ${getRadiusClass('control')} shadow-md active:scale-95 transition-all cursor-pointer ${className}`}
        {...props}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{children}</span>
        {burstCount > 0 && <span className="font-mono text-[10px] opacity-80">×{burstCount}</span>}
      </button>
      {burst && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"
              style={{
                transform: `rotate(${i * 45}deg) translate(${28 + (i % 2) * 10}px)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

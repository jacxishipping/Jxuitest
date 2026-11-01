// @jxui/react v3.0.0 — MagneticButton (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles } from 'lucide-react';

// 1. MagneticButton
export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  strength?: number;
  variant?: 'solid' | 'soft' | 'outline' | 'glass';
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children = 'Magnetic Action',
  strength = 0.35,
  variant = 'solid',
  tone = 'primary',
  className = '',
  onClick,
  ...props
}) => {
  const { palette, getRadiusClass } = useJXTheme();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const toneMap = {
    primary: {
      solid: `${palette.bg} text-white`,
      soft: `${palette.softBg} ${palette.text} border ${palette.border}`,
      outline: `bg-transparent ${palette.text} border-2 ${palette.border}`,
      glass: 'bg-white/75 dark:bg-slate-800/75 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700',
    },
    success: {
      solid: 'bg-emerald-600 text-white',
      soft: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
      outline: 'bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500',
      glass: 'bg-emerald-500/15 backdrop-blur-md text-emerald-700 dark:text-emerald-200 border border-emerald-400/40',
    },
    warning: {
      solid: 'bg-amber-500 text-white',
      soft: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
      outline: 'bg-transparent text-amber-600 dark:text-amber-400 border-2 border-amber-500',
      glass: 'bg-amber-500/15 backdrop-blur-md text-amber-700 dark:text-amber-200 border border-amber-400/40',
    },
    danger: {
      solid: 'bg-rose-600 text-white',
      soft: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
      outline: 'bg-transparent text-rose-600 dark:text-rose-400 border-2 border-rose-500',
      glass: 'bg-rose-500/15 backdrop-blur-md text-rose-700 dark:text-rose-200 border border-rose-400/40',
    },
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        setClicks((c) => c + 1);
        onClick?.(e);
      }}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 ? 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.1s ease-out',
      }}
      className={`px-4 py-2 font-semibold text-xs ${toneMap[tone][variant]} ${getRadiusClass('control')} shadow-md hover:shadow-lg active:scale-95 cursor-pointer inline-flex items-center gap-2 ${className}`}
      {...props}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>{children}</span>
      {clicks > 0 && (
        <span className="px-1.5 py-0.2 rounded-full bg-black/15 dark:bg-white/20 text-[10px] font-mono">
          {clicks}x
        </span>
      )}
    </button>
  );
};

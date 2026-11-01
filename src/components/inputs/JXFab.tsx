// @jxui/react v3.0.0 — JXFab (JXUI v3.0 Unified Component Suite)
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXFabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
  extended?: boolean;
  autoCollapseOnScroll?: boolean;
  glass?: boolean;
  badgeCount?: number;
  size?: 'sm' | 'md' | 'lg';
  position?: 'inline' | 'bottom-right' | 'bottom-center';
}

export const JXFab: React.FC<JXFabProps> = ({
  label = 'Create Issue',
  icon,
  extended = true,
  autoCollapseOnScroll = false,
  glass = false,
  badgeCount,
  size = 'md',
  position = 'inline',
  disabled = false,
  className = '',
  ...rest
}) => {
  const { palette } = useJXTheme();
  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    if (!autoCollapseOnScroll) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolledDown(currentY > lastY && currentY > 80);
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [autoCollapseOnScroll]);

  const isExtended = autoCollapseOnScroll ? !scrolledDown && extended : extended;

  const sizeClass =
    size === 'sm'
      ? 'h-10 px-4 text-xs'
      : size === 'lg'
      ? 'h-14 px-6 text-sm'
      : 'h-12 px-5 text-xs';

  const posClass =
    position === 'bottom-right'
      ? 'fixed bottom-6 right-6 z-40'
      : position === 'bottom-center'
      ? 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40'
      : 'relative';

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={label}
      className={`${posClass} inline-flex items-center justify-center gap-2.5 font-semibold rounded-full jx-elevation-3 transition-all duration-300 jx-spring active:scale-95 whitespace-nowrap shrink-0 ${sizeClass} ${
        glass
          ? 'bg-slate-900/85 dark:bg-white/90 text-white dark:text-slate-900 backdrop-blur-md border border-white/15'
          : `${palette.bg} ${palette.bgHover} text-white`
      } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      {...rest}
    >
      <span className="shrink-0">{icon || <Plus className="w-4 h-4" />}</span>
      {isExtended && label && <span>{label}</span>}
      {typeof badgeCount === 'number' && badgeCount > 0 && (
        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 dark:bg-black/20 rounded-full tabular-nums">
          {badgeCount}
        </span>
      )}
    </button>
  );
};

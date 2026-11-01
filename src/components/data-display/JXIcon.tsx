// @jxui/react v3.0.0 — JXIcon (JXUI v3.0 Unified Component Suite)
import React from 'react';
import { useJXTheme } from '../../context/JXThemeContext';

export type JXIconHoverAnimation = 'bounce' | 'scale' | 'rotate' | 'lift' | 'none';

export interface JXIconProps {
  icon: React.ReactNode;
  label?: string;
  variant?: 'soft-box' | 'circle' | 'plain';
  size?: 'sm' | 'md' | 'lg';
  hoverAnimation?: JXIconHoverAnimation;
  onClick?: () => void;
  className?: string;
}

export const JXIcon: React.FC<JXIconProps> = ({
  icon,
  label,
  variant = 'soft-box',
  size = 'md',
  hoverAnimation = 'bounce',
  onClick,
  className = '',
}) => {
  const { palette } = useJXTheme();

  const animClass: Record<JXIconHoverAnimation, string> = {
    bounce: 'hover:-translate-y-1',
    scale: 'hover:scale-110',
    rotate: 'hover:rotate-12',
    lift: 'hover:-translate-y-1 hover:shadow-md',
    none: '',
  };

  const sizeClass =
    size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-13 h-13' : 'w-11 h-11';

  const shapeClass =
    variant === 'circle'
      ? `rounded-full ${palette.softBg} border ${palette.border}`
      : variant === 'soft-box'
      ? `rounded-2xl ${palette.softBg} border ${palette.border}`
      : '';

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center gap-1.5 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div
        className={`${sizeClass} ${shapeClass} flex items-center justify-center ${palette.text} transition-transform duration-200 cursor-pointer ${animClass[hoverAnimation]}`}
      >
        {icon}
      </div>
      {label && <span className="text-[11px] text-slate-500">{label}</span>}
    </div>
  );
};

export const JXSvgIcon = JXIcon;

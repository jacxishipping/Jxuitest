// @jxui/react v3.0.0 — MagneticCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Magnet } from 'lucide-react';

// 2. MagneticCard
// Tracks cursor proximity and pulls the card surface toward the pointer with damped spring return
export interface MagneticCardProps {
  title?: string;
  subtitle?: string;
  strength?: number;
  className?: string;
}

export const MagneticCard: React.FC<MagneticCardProps> = ({
  title = 'Magnetic Attraction Card',
  subtitle = 'Pulls toward the pointer coordinates on hover and springs back smoothly upon mouse exit.',
  strength = 0.25,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.08s ease-out',
      }}
      className={`p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl ${getRadiusClass(
        'card'
      )} cursor-pointer select-none space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <Magnet className="w-3.5 h-3.5" />
          <span>Magnetic Physics</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          dx: {Math.round(offset.x)}px, dy: {Math.round(offset.y)}px
        </span>
      </div>
      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{subtitle}</p>
    </div>
  );
};

// @jxui/react v3.0.0 — TiltCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, Layers } from 'lucide-react';

// 3. TiltCard
// Real 3D perspective tilt tracking cursor coordinates across X and Y axes
export interface TiltCardProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  title = '3D Parallax Tilt Card',
  subtitle = 'Move your cursor across this surface to experience real 3D perspective pitch and yaw.',
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      style={{ perspective: '800px' }}
      className={`inline-block w-full ${className}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: tilt.rotateX === 0 ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.08s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className={`p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl ${getRadiusClass(
          'card'
        )} cursor-pointer select-none`}
      >
        <div style={{ transform: 'translateZ(24px)' }} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Motion Spec</span>
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

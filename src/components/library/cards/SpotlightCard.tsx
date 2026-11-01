// @jxui/react v3.0.0 — SpotlightCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles } from 'lucide-react';

// 11. SpotlightCard
// Dynamic luminescent spotlight projection that follows cursor coordinates in real time
export interface SpotlightCardProps {
  title?: string;
  subtitle?: string;
  spotlightColor?: string;
  className?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  title = 'Spotlight Luminescence',
  subtitle = 'Projects a radial illumination beam directly under the pointer coordinates.',
  spotlightColor = 'rgba(99, 102, 241, 0.18)',
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 120, y: 60 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundImage: isHovered
          ? `radial-gradient(240px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 80%)`
          : undefined,
      }}
      className={`relative overflow-hidden p-5 bg-slate-950 text-white border border-slate-800 ${getRadiusClass(
        'card'
      )} shadow-xl hover:border-slate-700 transition-colors cursor-pointer select-none space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Spotlight Spec</span>
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          X: {Math.round(pos.x)}, Y: {Math.round(pos.y)}
        </span>
      </div>
      <h4 className="font-bold text-sm text-white">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{subtitle}</p>
    </div>
  );
};

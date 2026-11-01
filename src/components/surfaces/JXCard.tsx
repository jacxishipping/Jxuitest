// @jxui/react v3.0.0 — JXCard (JXUI v3.0 Unified Component Suite)
import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useJXTheme } from '../../context/JXThemeContext';

export interface JXCardProps {
  title?: string;
  kicker?: string;
  description?: string;
  spotlight?: boolean;
  hoverLift?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const JXCardHeader: React.FC<{
  title: string;
  subheader?: string;
  icon?: React.ReactNode;
}> = ({ title, subheader, icon }) => (
  <div className="mb-2">
    {subheader && (
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
          {subheader}
        </span>
        {icon}
      </div>
    )}
    <h4 className="text-base font-bold text-slate-900 dark:text-white">{title}</h4>
  </div>
);

export const JXCardContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{children}</div>
);

export const JXCardMedia: React.FC<{
  gradient?: string;
  caption?: string;
}> = ({
  gradient = 'from-indigo-500/20 via-violet-500/20 to-sky-500/20',
  caption,
}) => (
  <div
    className={`h-24 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-mono text-slate-600 dark:text-slate-300 mb-3`}
  >
    {caption}
  </div>
);

export const JXCardActions: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-2">
    {children}
  </div>
);

export const JXCard: React.FC<JXCardProps> = ({
  title = 'Move cursor across this Bento Card',
  kicker = 'Interactive Cursor Spotlight Surface',
  description = 'Tracks pointer coordinates to project a subtle radial specular highlight with zero layout overhead.',
  spotlight = true,
  hoverLift = true,
  children,
  className = '',
}) => {
  const { getRadiusClass } = useJXTheme();
  const [mousePos, setMousePos] = useState({ x: 140, y: 80 });

  return (
    <div
      onMouseMove={(e) => {
        if (!spotlight) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      style={
        spotlight
          ? {
              backgroundImage: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.10), transparent 80%)`,
            }
          : undefined
      }
      className={`p-5 border border-slate-200/90 dark:border-slate-800 transition-transform duration-200 ${
        hoverLift ? 'hover:-translate-y-0.5' : ''
      } jx-elevation-2 ${getRadiusClass('card')} ${className}`}
    >
      {children || (
        <>
          <JXCardHeader
            title={title}
            subheader={kicker}
            icon={<Layers className="w-4 h-4 text-slate-400" />}
          />
          <JXCardContent>{description}</JXCardContent>
        </>
      )}
    </div>
  );
};

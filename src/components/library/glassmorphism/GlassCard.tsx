// @jxui/react v3.0.0 — GlassCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Sparkles, 
  Layers, 
  Search, 
  Sliders, 
  Bell, 
  X, 
  Folder, 
  FileText, 
  Settings, 
  Maximize2,
  ChevronRight,
  Info
} from 'lucide-react';

// 5. GlassCard
export interface GlassCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}
export const GlassCard: React.FC<GlassCardProps> = ({ title = 'Luminescent Metric', subtitle = 'Zero latency event loop', children, className = '' }) => {
  const { getRadiusClass } = useJXTheme();
  return (
    <div className={`p-5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/50 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 ${getRadiusClass('card')} ${className}`}>
      <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">{subtitle}</p>
      {children}
    </div>
  );
};

// @jxui/react v3.0.0 — BreadcrumbTrail (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  Home, 
  Compass, 
  Layers, 
  Settings, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Menu, 
  X, 
  Sliders, 
  Folder, 
  FileText,
  Share2,
  Grid,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Bell
} from 'lucide-react';

// 10. BreadcrumbTrail
export interface BreadcrumbTrailProps {
  crumbs?: string[];
}
export const BreadcrumbTrail: React.FC<BreadcrumbTrailProps> = ({ crumbs = ['JXUI', 'Library', 'Navigation', 'Dock'] }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
      {crumbs.map((crumb, idx) => (
        <React.Fragment key={crumb}>
          {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          <span className={idx === crumbs.length - 1 ? 'font-bold text-slate-900 dark:text-white' : 'hover:underline cursor-pointer'}>
            {crumb}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

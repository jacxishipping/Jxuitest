// @jxui/react v3.0.0 — MorphingModal (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { X, Search, ChevronRight, CornerDownLeft, Sparkles, Layers } from 'lucide-react';

// 1. MorphingModal
export const MorphingModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { palette, getRadiusClass } = useJXTheme();
  return (
    <div>
      <button onClick={() => setOpen(true)} className={`px-4 py-2 text-xs font-semibold text-white ${palette.bg} ${getRadiusClass('control')} cursor-pointer`}>
        Open Morphing Modal
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-sm p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl ${getRadiusClass('card')} animate-scale-in`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Morphing Surface</span>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 py-3">Zero-shift geometric expansion from trigger coordinates.</p>
          </div>
        </div>
      )}
    </div>
  );
};

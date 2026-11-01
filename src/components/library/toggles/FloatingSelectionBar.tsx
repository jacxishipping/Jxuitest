// @jxui/react v3.0.0 — FloatingSelectionBar (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Check, Minus, X, Trash2, Copy, Sparkles } from 'lucide-react';

// 15. FloatingSelectionBar
export const FloatingSelectionBar: React.FC = () => {
  const { palette, getRadiusClass } = useJXTheme();
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 bg-slate-900 text-white shadow-2xl ${getRadiusClass('pill')} text-xs`}>
      <span className="font-semibold text-indigo-400">3 selected</span>
      <button className="flex items-center gap-1 hover:text-slate-300 cursor-pointer"><Copy className="w-3.5 h-3.5" /> Duplicate</button>
      <button className="flex items-center gap-1 text-rose-400 hover:text-rose-300 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
    </div>
  );
};

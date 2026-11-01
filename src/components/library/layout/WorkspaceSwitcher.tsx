// @jxui/react v3.0.0 — WorkspaceSwitcher (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Layout, Maximize2, Minimize2, X, Move, Split } from 'lucide-react';

// 15. WorkspaceSwitcher
export const WorkspaceSwitcher: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold">
      <span className="px-2 py-0.5 bg-indigo-600 text-white rounded">Design</span>
      <span className="px-2 py-0.5 text-slate-500 hover:text-slate-800">Production</span>
    </div>
  );
};

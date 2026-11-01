// @jxui/react v3.0.0 — LiveTicker (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

// 16. LiveTicker
export const LiveTicker: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 font-mono text-xs">
      <span className="font-bold text-slate-900 dark:text-white">JX/USD</span>
      <span className="text-emerald-500 font-semibold">$1,489.20</span>
      <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 rounded">+4.2%</span>
    </div>
  );
};

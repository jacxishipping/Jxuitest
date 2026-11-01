// @jxui/react v3.0.0 — DataComparisonChart (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

// 20. DataComparisonChart
export const DataComparisonChart: React.FC = () => {
  return (
    <div className="flex flex-col gap-1 w-28 text-[10px] font-mono">
      <div className="flex justify-between"><span>Vite</span><span className="font-bold">0.8s</span></div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded"><div className="w-1/4 h-full bg-indigo-600 rounded" /></div>
    </div>
  );
};

// @jxui/react v3.0.0 — BubbleChart (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

// 9. BubbleChart
export const BubbleChart: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-indigo-500/40 border border-indigo-600 flex items-center justify-center text-[8px]">A</div>
      <div className="w-10 h-10 rounded-full bg-emerald-500/40 border border-emerald-600 flex items-center justify-center text-[10px]">B</div>
    </div>
  );
};

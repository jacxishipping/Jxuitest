// @jxui/react v3.0.0 — RadialChart (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

// 4. RadialChart
export const RadialChart: React.FC = () => {
  return (
    <div className="w-16 h-16 relative flex items-center justify-center font-mono text-[10px] font-bold">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx="18" cy="18" r="14" fill="none" stroke="#4f46e5" strokeWidth="3" strokeDasharray="88" strokeDashoffset="30" />
      </svg>
      <span className="absolute">65%</span>
    </div>
  );
};

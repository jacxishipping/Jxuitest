// @jxui/react v3.0.0 — Heatmap (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

// 10. Heatmap
export const Heatmap: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-1">
      {[1, 2, 4, 3, 2, 4, 1, 3].map((val, idx) => (
        <div key={idx} className={`w-4 h-4 rounded-xs ${val === 4 ? 'bg-indigo-600' : val === 3 ? 'bg-indigo-400' : 'bg-indigo-200 dark:bg-indigo-900'}`} />
      ))}
    </div>
  );
};

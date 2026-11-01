// @jxui/react v3.0.0 — NumberCounter (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

// 17. NumberCounter
export const NumberCounter: React.FC<{ value?: number }> = ({ value = 14209 }) => {
  return (
    <div className="font-mono text-xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
      {value.toLocaleString()}
    </div>
  );
};

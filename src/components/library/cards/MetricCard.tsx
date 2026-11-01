// @jxui/react v3.0.0 — MetricCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, ArrowUpRight, Check, Heart, ShoppingCart, TrendingUp } from 'lucide-react';

// 17. MetricCard
export const MetricCard: React.FC = () => {
  return (
    <div className="p-4 border rounded-2xl flex flex-col gap-1 text-xs">
      <span className="text-slate-500 font-medium">Render Latency</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono">0.8ms</span>
        <span className="text-emerald-500 font-bold flex items-center text-[10px]"><TrendingUp className="w-3 h-3" /> -62%</span>
      </div>
    </div>
  );
};

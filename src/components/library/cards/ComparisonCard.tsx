// @jxui/react v3.0.0 — ComparisonCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, ArrowUpRight, Check, Heart, ShoppingCart, TrendingUp } from 'lucide-react';

// 18. ComparisonCard
export const ComparisonCard: React.FC = () => {
  return (
    <div className="p-3 border rounded-xl text-xs grid grid-cols-2 gap-2 text-center">
      <div className="p-1 bg-rose-50 dark:bg-rose-950/30 rounded text-rose-600 font-medium">MUI: 34ms</div>
      <div className="p-1 bg-emerald-50 dark:bg-emerald-950/30 rounded text-emerald-600 font-bold">JXUI: 0.8ms</div>
    </div>
  );
};

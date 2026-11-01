// @jxui/react v3.0.0 — GradientBorderCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, ArrowUpRight, Check, Heart, ShoppingCart, TrendingUp } from 'lucide-react';

// 13. GradientBorderCard
export const GradientBorderCard: React.FC = () => {
  return (
    <div className="p-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4 bg-white dark:bg-slate-900 rounded-[14px] text-xs font-bold">
        Gradient Border
      </div>
    </div>
  );
};

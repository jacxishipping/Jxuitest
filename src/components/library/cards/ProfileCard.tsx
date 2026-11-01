// @jxui/react v3.0.0 — ProfileCard (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Sparkles, ArrowUpRight, Check, Heart, ShoppingCart, TrendingUp } from 'lucide-react';

// 14. ProfileCard
export const ProfileCard: React.FC = () => {
  return (
    <div className="p-3 border rounded-xl flex items-center gap-3 text-xs">
      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">JX</div>
      <div>
        <div className="font-bold">Alex Mercer</div>
        <div className="text-[10px] text-slate-500">Core Architect</div>
      </div>
    </div>
  );
};

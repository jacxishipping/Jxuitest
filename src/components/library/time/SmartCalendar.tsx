// @jxui/react v3.0.0 — SmartCalendar (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Calendar, Clock, Clock3, ChevronRight, Check } from 'lucide-react';

// 1. SmartCalendar
export const SmartCalendar: React.FC = () => {
  return (
    <div className="w-52 p-3 border rounded-2xl bg-white dark:bg-slate-900 text-xs">
      <div className="flex justify-between font-bold mb-2">
        <span>October 2026</span>
        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="text-slate-400">{d}</span>)}
        {[...Array(14)].map((_, i) => (
          <span key={i} className={`p-1 rounded cursor-pointer ${i === 9 ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{i + 1}</span>
        ))}
      </div>
    </div>
  );
};

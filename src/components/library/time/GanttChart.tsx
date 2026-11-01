// @jxui/react v3.0.0 — GanttChart (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Calendar, Clock, Clock3, ChevronRight, Check } from 'lucide-react';

// 4. GanttChart
export const GanttChart: React.FC = () => {
  return (
    <div className="w-56 p-2 border rounded-xl text-xs flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px]">Sprint 1</span>
        <div className="w-24 h-3 bg-indigo-500 rounded text-[9px] text-white flex items-center px-1">Active</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px]">QA Audit</span>
        <div className="w-16 h-3 bg-slate-300 dark:bg-slate-700 rounded text-[9px] flex items-center px-1">Next</div>
      </div>
    </div>
  );
};

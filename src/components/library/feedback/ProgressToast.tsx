// @jxui/react v3.0.0 — ProgressToast (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle, 
  RotateCcw, 
  X, 
  Wifi, 
  WifiOff, 
  PartyPopper, 
  RefreshCw,
  Bell
} from 'lucide-react';

// 8. ProgressToast
export const ProgressToast: React.FC = () => {
  return (
    <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl shadow-lg text-xs w-60 flex flex-col gap-1.5">
      <div className="flex justify-between font-semibold">
        <span>Exporting tokens...</span>
        <span className="font-mono">78%</span>
      </div>
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="w-[78%] h-full bg-indigo-600" />
      </div>
    </div>
  );
};

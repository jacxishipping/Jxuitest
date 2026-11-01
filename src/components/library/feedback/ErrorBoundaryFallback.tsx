// @jxui/react v3.0.0 — ErrorBoundaryFallback (JXUI v3.0 Unified Component Suite)
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

// 15. ErrorBoundaryFallback
export const ErrorBoundaryFallback: React.FC = () => {
  return (
    <div className="p-4 border border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between">
      <div>
        <span className="font-bold">Execution Error</span>
        <p className="text-[11px] text-rose-600">Component crashed safely.</p>
      </div>
      <button className="px-2.5 py-1 bg-rose-600 text-white rounded text-xs flex items-center gap-1 cursor-pointer">
        <RefreshCw className="w-3 h-3" /> Retry
      </button>
    </div>
  );
};

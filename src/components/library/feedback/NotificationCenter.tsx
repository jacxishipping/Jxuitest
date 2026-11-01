// @jxui/react v3.0.0 — NotificationCenter (JXUI v3.0 Unified Component Suite)
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

// 3. NotificationCenter
export const NotificationCenter: React.FC = () => {
  return (
    <div className="w-64 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl text-xs flex flex-col gap-2">
      <div className="flex items-center justify-between font-bold pb-1 border-b">
        <span>Activity Log</span>
        <Bell className="w-3.5 h-3.5 text-slate-400" />
      </div>
      <p className="text-slate-500 text-[11px]">No unread system alerts.</p>
    </div>
  );
};

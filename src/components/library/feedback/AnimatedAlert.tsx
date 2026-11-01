// @jxui/react v3.0.0 — AnimatedAlert (JXUI v3.0 Unified Component Suite)
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

// 5. AnimatedAlert
export const AnimatedAlert: React.FC = () => {
  return (
    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs flex items-center gap-2 text-amber-800 dark:text-amber-200 animate-pulse">
      <AlertTriangle className="w-4 h-4 text-amber-500" />
      <span>Canary rollout currently at 25% traffic</span>
    </div>
  );
};

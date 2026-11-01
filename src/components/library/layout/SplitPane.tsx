// @jxui/react v3.0.0 — SplitPane (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Layout, Maximize2, Minimize2, X, Move, Split } from 'lucide-react';

// 7. SplitPane
export const SplitPane: React.FC = () => {
  return (
    <div className="flex border rounded-lg overflow-hidden text-xs w-48 h-12">
      <div className="flex-1 p-2 bg-slate-50 dark:bg-slate-900">Left Pane</div>
      <div className="w-1 bg-indigo-500 cursor-col-resize" />
      <div className="flex-1 p-2 bg-slate-100 dark:bg-slate-800">Right Pane</div>
    </div>
  );
};

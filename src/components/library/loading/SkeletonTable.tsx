// @jxui/react v3.0.0 — SkeletonTable (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Loader2, Check, Sparkles, UploadCloud } from 'lucide-react';

// 8. SkeletonTable
export const SkeletonTable: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      <div className="w-full h-6 bg-slate-100 dark:bg-slate-900 rounded animate-pulse" />
    </div>
  );
};

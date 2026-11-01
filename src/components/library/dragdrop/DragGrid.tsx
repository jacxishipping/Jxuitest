// @jxui/react v3.0.0 — DragGrid (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Move, GripVertical, UploadCloud, Calendar, Grid } from 'lucide-react';

// 2. DragGrid
export const DragGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-1.5 w-36">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-8 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-mono cursor-grab active:cursor-grabbing">
          {i}
        </div>
      ))}
    </div>
  );
};

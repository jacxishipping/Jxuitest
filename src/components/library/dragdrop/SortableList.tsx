// @jxui/react v3.0.0 — SortableList (JXUI v3.0 Unified Component Suite)
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useJXTheme } from '../../../context/JXThemeContext';
import { Move, GripVertical, UploadCloud, Calendar, Grid } from 'lucide-react';

// 3. SortableList
export const SortableList: React.FC = () => {
  return (
    <div className="flex flex-col gap-1 w-44 text-xs">
      <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border rounded cursor-grab">
        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
        <span>1. High Priority</span>
      </div>
      <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border rounded cursor-grab">
        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
        <span>2. Medium Priority</span>
      </div>
    </div>
  );
};
